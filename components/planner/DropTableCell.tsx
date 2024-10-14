import { FC, useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { TableCell } from "@nextui-org/table";

import { cn } from "@/lib/utils";

interface DropTableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  resourceId: string;
  columnIndex: number;
}

const DropTableCell: FC<DropTableCellProps> = ({
  children,
  resourceId,
  columnIndex,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const element = ref.current!;

    return dropTargetForElements({
      element,
      getData: () => ({ resourceId, columnIndex }),
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => setIsOver(false),
    });
  }, [resourceId, columnIndex]);

  return (
    <TableCell
      className={cn(
        "border bg-background",
        isOver ? "bg-primary-foreground" : "bg-background",
      )}
      {...props}
    >
      {children}
    </TableCell>
  );
};

export default DropTableCell;
