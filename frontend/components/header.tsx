"use client";
import { useState } from "react";
import { Plus } from "lucide-react"

import { Button } from "./ui/button"
import { TodoDialog } from "./todo-dialog";

export const Header = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="h-16 w-full bg-primary text-primary-foreground flex items-center justify-between p-4 rounded-xl">
        <h1 className="text-2xl">Todo App</h1>
        <Button
          variant="secondary"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus />
          Create New Todo
        </Button>
        <TodoDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
    </div>
  )
}
