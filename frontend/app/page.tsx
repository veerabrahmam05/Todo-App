import { Header } from "@/components/header";
import { TodoLayout } from "@/components/todo-layout";

export default function Home() {
  return (
    <div className="h-screen w-screen p-4 bg-background text-foreground flex flex-col gap-3 overflow-hidden">
      <Header />
      <TodoLayout />
    </div>
  );
}
