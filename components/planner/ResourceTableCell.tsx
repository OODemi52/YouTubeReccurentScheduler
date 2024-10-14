import React from "react";
import { TableCell } from "@nextui-org/table";

import { Resource } from "@/models";
import { cn } from "@/lib/utils";

export interface ResourceTableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  resourceItem: Resource;
}

const ResourceTableCell: React.FC<ResourceTableCellProps> = ({
  className,
  resourceItem,
  ...props
}) => {
  return (
    <TableCell
      className={cn(className, "sticky left-0 z-10 border-y bg-background")}
      {...props}
    >
      <div className="flex items-center space-x-4   ">
        <div className="relative h-10 w-10">
          <img
            alt={resourceItem.name}
            className="rounded-full object-fill"
            src={resourceItem.details.image}
          />
        </div>
        <h2>{resourceItem.name}</h2>
      </div>
    </TableCell>
  );
};

export default ResourceTableCell;
