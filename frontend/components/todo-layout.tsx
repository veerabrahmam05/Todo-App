"use client";
import { useQuery } from "@tanstack/react-query";
import { TodoCard } from "./todo-card";
import { ScrollArea } from "./ui/scroll-area";
import { useAuthHeader } from "@/contexts/auth-provider";

interface TodoData {
  id: string;
  name: string;
  description: string;
  priority: string;
  completed: boolean;
  deadline: Date;
}

interface TodoLayoutProps {
  filter: boolean | null;
  sort: string | null;
}

export const TodoLayout = ({ filter, sort }: TodoLayoutProps) => {
  const { authHeader } = useAuthHeader();
  const getCookie = (name: string) => {
    const cookie = `; ${document.cookie}`;
    const parts = cookie.split(`${name}=`);
    console.log("parts: ", parts);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };
  const { data, isLoading, isRefetching, isError } = useQuery<TodoData[]>({
    queryKey: ["todos", filter, sort],
    queryFn: () => {
      const params = new URLSearchParams();

      if (filter !== null) {
        params.append("completed", String(filter));
      }

      if (sort) {
        params.append("sort", sort);
      }

      return fetch(`http://localhost:8000/todo/get?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${getCookie("authToken")}`,
        },
      }).then((res) => res.json());
    },
  });

  if (isLoading || isRefetching) {
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
    <ScrollArea className="h-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 m-1">
        {/* {data?.map((todo) => (
          <TodoCard
            key={todo.id}
            id={todo.id}
            name={todo.name}
            description={todo.description}
            priority={todo.priority}
            completed={todo.completed}
            deadline={todo.deadline}
          />
        ))} */}
      </div>
    </ScrollArea>
  );
};
