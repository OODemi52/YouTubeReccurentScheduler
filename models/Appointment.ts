import { z } from "zod";

export interface Appointment {
  id: string;
  title: string;
  start: Date;
  resourceId: string;
  order: number;
  details: { [key: string]: any };
}

export const updateAppointmentSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title is too long" }),
  start: z.date(),
  details: z.record(z.any()).optional(),
});

export const createAppointmentSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title is too long" }),
  start: z.date(),
  resourceId: z.string().min(1, { message: "Resource is required" }),
  order: z.number().optional(),
  details: z.record(z.any()).optional(),
});
