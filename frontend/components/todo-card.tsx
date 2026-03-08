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
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { TodoDialog } from "./todo-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TodoCardProps {
  id: string;
  name: string;
  description: string;
  priority: string;
  deadline: string;
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
  deadline,
}: TodoCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteTodo = useMutation({
    mutationFn: () =>
      fetch(`http://localhost:8000/todo/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

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
        <CardContent>
          <p>{priority}</p>
        </CardContent>
        <CardFooter>
          <p>{deadline}</p>
        </CardFooter>
      </Card>

      <TodoDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        id={id}
        name={name}
        description={description}
        priority={priority}
        deadline={deadline}
      />
    </>
  );
};
