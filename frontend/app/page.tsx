"use client";
import { Header } from "@/components/header";
import { TodoLayout } from "@/components/todo-layout";
import { useState } from "react";

export default function Home() {
  const [filter, setFilter] = useState<boolean | null>(null);
  console.log("filter: ", filter);

  return (
    <div className="h-screen w-screen p-4 bg-background text-foreground flex flex-col gap-3 overflow-hidden">
      <Header setFilter={setFilter}/>
      <TodoLayout filter={filter}/>
    </div>
  );
}
