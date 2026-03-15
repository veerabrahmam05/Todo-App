"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Filter, Moon, Plus, Sun } from "lucide-react";

import { useMounted } from "@/hooks/useMounted";
import { Button } from "./ui/button";
import { TodoDialog } from "./todo-dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const dropDownStatusItems = [
  { label: "All", value: null },
  { label: "Pending", value: false },
  { label: "Completed", value: true },
];

const dropDownPriorityItems = [
  { label: "None", value: null },
  { label: "High to Low", value: "high_to_low" },
  { label: "Low to High", value: "low_to_high" },
];

interface HeaderProps {
  filter: boolean | null;
  sort: string | null;
  setFilter: (val: boolean | null) => void;
  setSort: (val: string | null) => void;
}

export const Header = ({ filter, sort, setFilter, setSort }: HeaderProps) => {
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
    <div className="min-h-16 w-full bg-primary border border-primary text-primary-foreground flex items-center justify-between gap-4 p-4 rounded-xl">
      <h1 className="text-2xl">Todo App</h1>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <Filter />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuGroup>
              {dropDownStatusItems.map((item, ind) => (
                <DropdownMenuCheckboxItem
                  key={ind}
                  checked={filter === item.value}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            <DropdownMenuGroup>
              {dropDownPriorityItems.map((item, ind) => (
                <DropdownMenuCheckboxItem
                  key={ind}
                  checked={sort === item.value}
                  onClick={() => setSort(item.value)}
                >
                  {item.label}
                </DropdownMenuCheckboxItem>
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
