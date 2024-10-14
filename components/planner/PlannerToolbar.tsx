import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { endOfDay, endOfWeek, startOfWeek } from "date-fns";
import { DateRangePicker } from "@nextui-org/date-picker";

import AddAppointmentDialog from "./AddAppointmentDialog";

import { useCalendar } from "@/contexts/PlannerContext";
import { cn } from "@/lib/utils";
//import { useData } from "@/contexts/PlannerDataContext";

interface CalendarToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}
// eslint-disable-next-line import/order
import { parseDate } from "@internationalized/date";

const toDate = (date: any): Date => {
  return new Date(date.year, date.month - 1, date.day);
};

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  className,
  ...props
}) => {
  const { setDateRange } = useCalendar();
  //const { addResource, addAppointment } = useData();

  const [range, setRange] = useState<DateRange>({
    from: startOfWeek(new Date(), {
      locale: { options: { weekStartsOn: 1 } },
    }),
    to: endOfWeek(new Date()),
  });

  const handleDateRangeUpdate = (range: DateRange) => {
    const from = range.from;
    const to = range.to ?? endOfDay(range.from as Date);

    setDateRange({
      from: from,
      to: to,
    });
  };

  useEffect(() => {
    setDateRange(range);
  }, [range]);

  return (
    <div
      className={cn("flex items-center justify-end space-x-2", className)}
      {...props}
    >
      <AddAppointmentDialog />
      <DateRangePicker
        defaultValue={{
          start: parseDate(range.from!.toISOString().split("T")[0]),
          end: parseDate(range.to!.toISOString().split("T")[0]),
        }}
        value={{
          start: parseDate(range.from!.toISOString().split("T")[0]),
          end: parseDate(range.to!.toISOString().split("T")[0]),
        }}
        onChange={(value) =>
          handleDateRangeUpdate({
            from: toDate(value.start),
            to: value.end ? toDate(value.end) : undefined,
          })
        }
      />
    </div>
  );
};

export default React.memo(CalendarToolbar);
