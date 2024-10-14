import React from "react";
import { TableColumn, TableHeader, TableRow } from "@nextui-org/table";

import { useCalendar } from "@/contexts/PlannerContext";
import { cn } from "@/lib/utils";

export const Timeline: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...props
}) => {
  const { timeLabels } = useCalendar();

  return (
    <TableHeader>
      <TableRow className="bg-background">
        {timeLabels.map((label, index) => (
          <TableColumn
            key={index}
            className={cn(
              "sticky top-0 z-10 bg-background border-x min-w-56 text-center lg:min-w-72 ",
            )}
          >
            {label}
          </TableColumn>
        ))}
      </TableRow>
    </TableHeader>
  );
};
