import React, { FC, useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  Table,
  TableBody,
  TableRow,
  TableHeader,
  TableColumn,
  TableCell
} from "@nextui-org/table";

import CalendarToolbar from "./PlannerToolbar";
import Appointment from "./Appointment";
import DropTableCell from "./DropTableCell";
import ResourceTableCell from "./ResourceTableCell";
import { Timeline } from "./Timeline";

import { Appointment as AppointmentType, Resource } from "@/models";
import {
  PlannerDataContextProvider,
  useData,
} from "@/contexts/PlannerDataContext";
import { PlannerProvider, useCalendar } from "@/contexts/PlannerContext";
import { calculateNewDates, filterAppointments } from "@/lib/utils";

export interface PlannerProps extends React.HTMLAttributes<HTMLDivElement> {
  initialResources: Resource[];
  initialAppointments: AppointmentType[];
}

const Planner: React.FC<PlannerProps> = ({
  initialResources,
  initialAppointments,
  ...props
}) => {
  return (
    <PlannerDataContextProvider
      initialAppointments={initialAppointments}
      initialResources={initialResources}
    >
      <PlannerProvider>
        <PlannerMainComponent {...props} />
      </PlannerProvider>
    </PlannerDataContextProvider>
  );
};

export interface PlannerMainComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const PlannerMainComponent: FC<PlannerMainComponentProps> = ({ ...props }) => {
  return (
    <div className="flex flex-col gap-2  ">
      <CalendarToolbar />
      <CalendarContent />
    </div>
  );
};

interface CalendarContentProps extends React.HTMLAttributes<HTMLDivElement> {}
const CalendarContent: React.FC<CalendarContentProps> = () => {
  const { viewMode, dateRange, timeLabels } = useCalendar();
  const { resources, appointments, updateAppointment } = useData();

  useEffect(() => {
    console.log("From context in planner", appointments);
  }, [appointments]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0]?.data;
        const sourceData = source.data;

        if (!destination || !sourceData) return;

        const appointment = appointments.find(
          (appt) => appt.id === sourceData.appointmentId,
        );

        if (!appointment) return;

        const newResource = resources.find(
          (res) => res.id === destination.resourceId,
        );

        if (!newResource) return;

        const newDates = calculateNewDates(
          viewMode,
          destination.columnIndex as unknown as number,
          sourceData.columnIndex as unknown as number,
          {
            from: appointment.start,
          },
        );

        updateAppointment({
          ...appointment,
          start: newDates.start as Date,
          resourceId: newResource.id,
        });
      },
    });
  }, [appointments]);

  const columns = [
    { key: "id", label: "Appointment ID" },
    { key: "title", label: "Title" },
    { key: "start", label: "Start Time" },
    { key: "resourceId", label: "Resource ID" },
  ];

  // Define rows based on the appointments
  const rows = appointments.map((appt) => ({
    key: appt.id,
    id: appt.id,
    title: appt.title,
    start: appt.start.toString(), // Convert Date to string for display
    resourceId: appt.resourceId,
  }));

  // Helper function to get key value
  const getKeyValue = (item: any, columnKey: string) => {
    return item[columnKey];
  };

  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn className="border-red-900 rounded-lg mx-4" key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow className="border-red-900 rounded-lg" key={item.key.toString()}>
            {columns.map((column) => (
              <TableCell key={column.key}>{getKeyValue(item, column.key)}</TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default Planner;
