"use client";

import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Button } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import {
  CalendarDaysIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Badge } from "@nextui-org/badge";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/input";
import { Calendar } from "@nextui-org/calendar";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { parseDate, now } from "@internationalized/date";
import { DatePicker } from "@nextui-org/date-picker";

import {
  Appointment as AppointmentType,
  updateAppointmentSchema,
} from "@/models/Appointment";
import { useData } from "@/contexts/PlannerDataContext";
import { cn } from "@/lib/utils";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AppointmentProps {
  appointment: AppointmentType;
  resourceId: string;
  columnIndex: number;
}

const Appointment: React.FC<AppointmentProps> = ({
  appointment,
  resourceId,
  columnIndex,
}) => {
  const { updateAppointment } = useData();
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = ref.current!;

    return draggable({
      element,
      getInitialData: () => ({
        appointmentId: appointment.id,
        columnIndex: columnIndex,
        resourceId: resourceId,
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, []);

  const form = useForm<z.infer<typeof updateAppointmentSchema>>({
    resolver: zodResolver(updateAppointmentSchema),
    defaultValues: {
      title: appointment.title,
      start: new Date(appointment.start) ?? new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof updateAppointmentSchema>) {
    updateAppointment({
      ...appointment,
      ...values,
    });
  }

  return (
    <Card ref={ref} className="hover:cursor-grab">
      <CardHeader className="flex flex-row items-center justify-between p-1">
        <Badge className="  truncate pl-2 text-xs" variant="faded">
          {appointment.details.service}
        </Badge>
        <Popover backdrop="blur">
          <PopoverTrigger>
            <div className=" text-xs">
              <EllipsisVerticalIcon className="h-4 w-4" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <Card className="border-none p-0 shadow-none w-fit">
              <CardHeader className="p-0">
                <h3 className="text-xs">{appointment.title}</h3>
                <p className="text-xs">
                  {format(new Date(appointment.start), "MMM dd yyyy HH:mm")} -{" "}
                </p>
              </CardHeader>
              <CardBody className="w-fit">
                <Form {...form}>
                  <form
                    className="space-y-8"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <Input placeholder="Title" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="start"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-left">Start</FormLabel>
                          <Popover>
                            <PopoverTrigger>
                              <Button
                                className={cn(
                                  "w-[280px] justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                                variant="faded"
                              >
                                <CalendarDaysIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP HH:mm:ss")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                value={
                                  field.value
                                    ? parseDate(
                                        field.value.toISOString().split("T")[0],
                                      )
                                    : now("UTC")
                                }
                                onChange={(date) => field.onChange(date)}
                              />
                              <div className="border-t border-border p-3">
                                <DatePicker
                                  value={
                                    field.value
                                      ? parseDate(
                                          field.value
                                            .toISOString()
                                            .split("T")[0],
                                        )
                                      : null
                                  }
                                  onChange={field.onChange}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </CardBody>
            </Card>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardBody
        className={cn("px-2 py-2", {
          "cursor-grabbing bg-muted opacity-50": isDragging,
        })}
      >
        <div className="flex flex-col items-center gap-2 text-xs">
          <div>{appointment.title}</div>
          <div>{format(new Date(appointment.start), "kk:mm")} - </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Appointment;
