import { TodoSchema, TodoSchemaValues } from "@/schemas/todo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "./date-picker";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

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
      completed: false,
      deadline: deadline ?? new Date(),
    },
  });

  const updateTodo = useMutation({
    mutationFn: async (data: TodoSchemaValues) => {
      const res = await fetch(`http://localhost:8000/todo/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          deadline: data.deadline.toISOString().split("T")[0]
        }),
      })

      if (!res.ok) throw new Error("error occured while updating todo");

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setOpen(false);
    },
  });

  const createTodo = useMutation({
    mutationFn: async (data: TodoSchemaValues) => {
      const res = await fetch(`http://localhost:8000/todo/create_todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          deadline: data.deadline.toISOString().split('T')[0]
        }),
      });

      if (!res.ok) throw new Error("error occures while creating todo");

      return res.json();
    },  
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
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low</Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High</Label>
                </div>
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={control}
          name="completed"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="todo-form-priority">Status</FieldLabel>
              <RadioGroup
                className="flex gap-2"
                value={String(field.value)}
                onValueChange={(val) => {
                  field.onChange(val === "true");
                }}
              >
                <div className="flex gap-1">
                  <RadioGroupItem value="false" id="pending" />
                  <Label>pending</Label>
                </div>
                <div className="flex gap-1">
                  <RadioGroupItem value="true" id="completed" />
                  <Label>completed</Label>
                </div>
              </RadioGroup>
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
              <DatePicker date={field.value} setDate={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
};
