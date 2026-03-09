"use client";
import { useQuery } from "@tanstack/react-query";
import { TodoCard } from "./todo-card";

interface TodoData {
  id: string;
  name: string;
  description: string;
  priority: string;
  completed: boolean;
  deadline: Date;
}

export const TodoLayout = () => {
  const { data, isLoading, isRefetching, isError } = useQuery<TodoData[]>({
    queryKey: ["todos"],
    queryFn: () =>
      fetch("http://localhost:8000/todo/get").then((res) => res.json()),
  });

  if (isLoading && isRefetching) {
    return (
      <div className="h-full w-full flex flex-col gap-4 justify-center items-center">
        Loading todos..
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full w-full flex flex-col gap-4 justify-center items-center">
        Error loading todos
      </div>
    );
  }

  if (data && data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-medium">No Todos Yet</p>
        <p className="text-sm text-gray-500">Create your first todo</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {data?.map((todo) => (
        <TodoCard
          key={todo.id}
          id={todo.id}
          name={todo.name}
          description={todo.description}
          priority={todo.priority}
          completed={todo.completed}
          deadline={todo.deadline}
        />
      ))}
    </div>
  );
};
