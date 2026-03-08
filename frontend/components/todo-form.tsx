import { TodoSchema, TodoSchemaValues } from "@/schemas/todo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TodoFormProps extends Partial<TodoSchemaValues> {
  id?: string;
  setOpen: (val: boolean) => void;
}

export const TodoForm = ({
  name,
  description,
  priority,
  deadline,
  id,
  setOpen,
}: TodoFormProps) => {
  const queryClient = useQueryClient();
  const { control, handleSubmit } = useForm<TodoSchemaValues>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      name: name ?? "",
      description: description ?? "",
      priority: priority ?? "",
      deadline: deadline ?? "",
    },
  });

  const updateTodo = useMutation({
    mutationFn: (data: TodoSchemaValues) =>
      fetch(`http://localhost:8000/todo/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...data
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setOpen(false);
    },
  });

  const createTodo = useMutation({
    mutationFn: (data: TodoSchemaValues) =>
      fetch(`http://localhost:8000/todo/create_todo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...data,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setOpen(false);
    },
  });

  const onSubmit = (data: TodoSchemaValues) => {
    if (id) {
      updateTodo.mutate(data);
    } else {
      createTodo.mutate(data);
    }
  };

  return (
    <form id="todo-form" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="todo-form-name">Title</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="todo-form-name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="todo-form-description">
                Description
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="todo-form-description"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={control}
          name="priority"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="todo-form-priority">Priority</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="todo-form-priority"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={control}
          name="deadline"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="todo-form-deadline">Deadline</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="todo-form-deadline"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
};
