"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Plus, Sun } from "lucide-react";

import { useMounted } from "@/hooks/useMounted";
import { Button } from "./ui/button";
import { TodoDialog } from "./todo-dialog";

export const Header = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const handleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div className="h-16 w-full bg-primary text-primary-foreground flex items-center justify-between p-4 rounded-xl">
      <h1 className="text-2xl">Todo App</h1>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
          <Plus />
          Create New Todo
        </Button>
        <Button variant="secondary" onClick={handleTheme} className="w-8">
          {mounted &&
            (theme === "light" ? (
              <Moon className="text-inherit" />
            ) : (
              <Sun className="text-inherit" />
            ))}
        </Button>
      </div>
      <TodoDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
    </div>
  );
};
