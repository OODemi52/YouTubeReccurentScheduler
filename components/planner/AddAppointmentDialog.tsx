"use client";

import React, { useState, useTransition } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Calendar } from "@nextui-org/calendar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { parseDate, now } from "@internationalized/date";
import { DatePicker } from "@nextui-org/date-picker";
import { Select, SelectItem } from "@nextui-org/select";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Appointment as AppointmentType,
  createAppointmentSchema,
} from "@/models/Appointment";
import { useData } from "@/contexts/PlannerDataContext";
import { cn } from "@/lib/utils";

const AddAppointmentDialog: React.FC = () => {
  const { addAppointment, resources } = useData();
  const [isOpened, setIsOpened] = useState(false);
  const [isPending, startAddAppointmentTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const form = useForm<AppointmentType>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      title: "",
      start: new Date(),
      resourceId: "",
    },
  });

  function onSubmit(values: z.infer<typeof createAppointmentSchema>) {
    const id = crypto.randomUUID();
    const newAppointment: AppointmentType = {
      details: {
        service: "Music",
      },
      order: 0,
      id: id,
      title: values.title,
      start: values.start,
      resourceId: values.resourceId,
    };

    startAddAppointmentTransition(() => {
      toast.promise(
        () =>
          new Promise((resolve) => {
            resolve(addAppointment(newAppointment));
          }),
        {
          loading: "Adding appointment...",
          success: "Appointment addedl.",
          error: "Failed to add appointment.",
        },
      );
      form.reset();
    });
    setTimeout(() => {
      setIsOpened(false);
    }, 1000);
  }

  return (
    <>
      <Button onPress={onOpen}>Schedule Stream</Button>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <h1>Schedule Stream</h1>
          </ModalHeader>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <ModalBody>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stream Title</FormLabel>
                      <Input placeholder="Appointment title" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stream Description</FormLabel>
                      <Textarea
                        label="Description"
                        placeholder="Enter stream description here..."
                        {...field}
                      />
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
                        <FormMessage />
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
                              //granularity="minute"
                              value={
                                field.value
                                  ? parseDate(
                                      field.value.toISOString().split("T")[0],
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
                <FormField
                  control={form.control}
                  name="resourceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource</FormLabel>
                      <div>
                        {field.value && (
                          <div>
                            Selected:{" "}
                            {
                              resources.find(
                                (resource) => resource.id === field.value,
                              )?.name
                            }
                          </div>
                        )}
                        <Select
                          placeholder="Select A Resource"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          {resources.map((resource) => (
                            <SelectItem key={resource.id} value={resource.id}>
                              {resource.name}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ModalBody>

              <ModalFooter>
                <Button type="submit">Save Stream</Button>
              </ModalFooter>
            </form>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddAppointmentDialog;
