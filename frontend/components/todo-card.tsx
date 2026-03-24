import { useState } from "react";
import { CircleCheck, ClockFading, EllipsisVertical } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { TodoDialog } from "./todo-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { getCookie } from "@/lib/utils";

interface TodoCardProps {
  id: string;
  name: string;
  description: string;
  priority: string;
  completed: boolean;
  deadline: Date;
}

interface DropDownItemsType {
  text: string;
  onClick: () => void;
  className?: string;
}

export const TodoCard = ({
  id,
  name,
  description,
  priority,
  completed,
  deadline,
}: TodoCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const token = getCookie("authToken");
  const deleteTodo = useMutation({
    mutationFn: () =>
      fetch(`http://localhost:8000/todo/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const getPriorityLabel = (value: number) => {
    switch (value) {
      case 0:
        return "low";
      case 1:
        return "medium";
      case 2:
        return "high";
      default:
        return "none";
    }
  };

  const dropDownItems: DropDownItemsType[] = [
    {
      text: "udpate",
      onClick: () => setIsDialogOpen(true),
    },
    {
      text: "delete",
      className: "text-destructive hover:text-destructive!",
      onClick: () => deleteTodo.mutate(),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription className="h-10">
            <Tooltip delayDuration={600}>
              <TooltipTrigger className="line-clamp-2 text-left">
                {description}
              </TooltipTrigger>
              <TooltipContent>
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  {dropDownItems.map((item, ind) => (
                    <DropdownMenuItem
                      key={ind}
                      className={`${item.className}`}
                      onClick={item.onClick}
                    >
                      {item.text}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p>{getPriorityLabel(Number(priority))}</p>
          {completed ? (
            <div className="flex gap-2 items-center">
              <CircleCheck className="text-green-600 size-3.5" />
              <span>Completed</span>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <ClockFading className="text-yellow-400 size-3.5" />
              <span>Pending</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p>{deadline.toLocaleString()}</p>
        </CardFooter>
      </Card>

      <TodoDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        id={id}
        name={name}
        description={description}
        priority={String(priority) as "0" | "1" | "2"}
        deadline={deadline}
      />
    </>
  );
};
