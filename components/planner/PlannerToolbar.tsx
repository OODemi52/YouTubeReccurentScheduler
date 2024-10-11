import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { endOfDay, endOfWeek, startOfWeek } from "date-fns";

import { DateRangePicker } from "../ui/date-range-picker";

import AddAppointmentDialog from "./AddAppointmentDialog";

import { useCalendar } from "@/contexts/PlannerContext";
import { cn } from "@/lib/utils";
import { useData } from "@/contexts/PlannerDataContext";

interface CalendarToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  className,
  ...props
}) => {
  const { setDateRange } = useCalendar();
  const { addResource, addAppointment } = useData();

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
        align="start"
        initialDateFrom={range.from}
        initialDateTo={range.to}
        showCompare={false}
        onUpdate={(value) => handleDateRangeUpdate(value.range)}
      />
    </div>
  );
};

export default React.memo(CalendarToolbar);
