"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Filter, Moon, Plus, Sun } from "lucide-react";

import { useMounted } from "@/hooks/useMounted";
import { Button } from "./ui/button";
import { TodoDialog } from "./todo-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const dropDownItems = [
  { label: "All", value: null },
  { label: "Pending", value: false },
  { label: "Completed", value: true },
];

interface HeaderProps {
  setFilter: (val: boolean | null) => void;
}

export const Header = ({ setFilter }: HeaderProps) => {
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <Filter />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {dropDownItems.map((item, ind) => (
                <DropdownMenuItem key={ind} onClick={() => setFilter((item.value))}>{item.label}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
