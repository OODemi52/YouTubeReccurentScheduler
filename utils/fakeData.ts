import { addDays, addHours, differenceInCalendarDays } from "date-fns";

import { Appointment, Resource } from "@/models";

const generateRandomString = (length: number): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
};

const generateResources = (num: number): Resource[] => {
  const types = ["room", "person", "equipment", "service", "other"];

  return Array.from({ length: num }, () => ({
    id: generateRandomString(8),
    name: `Resource ${Math.floor(Math.random() * 100)}`,
    type: types[Math.floor(Math.random() * types.length)] as
      | "room"
      | "person"
      | "equipment"
      | "service"
      | "other",
    details: {
      description: `Description ${Math.floor(Math.random() * 1000)}`,
      image: `https://example.com/avatar/${Math.floor(Math.random() * 1000)}.png`,
    },
  }));
};

const generateAppointments = (
  num: number,
  resources: Resource[],
): Appointment[] => {
  return Array.from({ length: num }, (_, i) => {
    const resource = resources[Math.floor(Math.random() * resources.length)];
    const start = addDays(new Date(), Math.floor(Math.random() * 14) + 1);
    let end = new Date(start.getTime());
    const hoursToAdd = Math.floor(Math.random() * 48) + 1;

    end = addHours(end, hoursToAdd);

    if (differenceInCalendarDays(end, new Date()) > 14) {
      end = addDays(new Date(), 14);
    }

    return {
      id: generateRandomString(8),
      title: `Appointment ${i + 1}`,
      start,
      end,
      resourceId: resource.id,
      order: i,
      details: {
        notes: `Note for appointment ${i + 1}`,
        service: `Service ${Math.floor(Math.random() * 10)}`,
        image: `https://example.com/appointment-image/${Math.floor(Math.random() * 1000)}.png`,
      },
    };
  });
};

export { generateResources, generateAppointments };
