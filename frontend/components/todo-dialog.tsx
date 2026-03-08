import { TodoSchemaValues } from "@/schemas/todo.schema";
import { TodoForm } from "./todo-form";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface TodoDialogProps extends Partial<TodoSchemaValues> {
  open: boolean;
  setOpen: (val: boolean) => void;
  id?: string;
}

export const TodoDialog = ({
  open,
  setOpen,
  id,
  name,
  description,
  priority,
  deadline,
}: TodoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Todo</DialogTitle>
          <DialogDescription>
            provide the details for the todo
          </DialogDescription>
        </DialogHeader>
        <TodoForm
          id={id}
          name={name}
          description={description}
          priority={priority}
          deadline={deadline}
          setOpen={setOpen}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="todo-form" size="sm">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
