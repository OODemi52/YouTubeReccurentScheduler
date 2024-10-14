import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  FC,
  useEffect,
} from "react";

import { AppointmentService, ResourceService } from "../services";
import { Appointment, Resource } from "../models";

interface DataContextType {
  appointments: Appointment[];
  resources: Resource[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  removeAppointment: (id: string) => void;
  addResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const PlannerDataContextProvider: FC<{
  children: ReactNode;
  initialAppointments: Appointment[];
  initialResources: Resource[];
}> = ({ children, initialAppointments, initialResources }) => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [resources, setResources] = useState(initialResources);
  const appointmentService = useMemo(
    () => new AppointmentService(),
    [], // Removed dependency on appointments
  );
  // Updating the state for re-renders
  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => {
      const updated = appointmentService.createAppointment(prev, appointment);
      return updated;
    });
  };

  const updateAppointment = (appointment: Appointment) => {
    setAppointments((prev) => {
      const updated = appointmentService.updateAppointment(
        [...prev],
        appointment,
      );
      return updated;
    });
  };

  const removeAppointment = (id: string) => {
    setAppointments((prev) => {
      const updated = appointmentService.deleteAppointment([...prev], id);
      return updated;
    });
  };

  const contextValue: DataContextType = {
    appointments: initialAppointments,
    resources,
    addAppointment,
    updateAppointment,
    removeAppointment,
    addResource: function (resource: Resource): void {
      throw new Error("Function not implemented.");
    },
    updateResource: function (resource: Resource): void {
      throw new Error("Function not implemented.");
    },
    removeResource: function (id: string): void {
      throw new Error("Function not implemented.");
    },
  };

  useEffect(() => {
    console.log("New", appointments), console.log("Og", initialAppointments);
  }, [appointments, initialAppointments]);

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData must be used within a PlannerDataContextProvider");
  }

  return context;
};
