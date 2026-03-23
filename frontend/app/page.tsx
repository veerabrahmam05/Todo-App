"use client"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { useState } from "react"

export default function Page() {
  const [newUser, setNewUser] = useState(false)
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {newUser ? <SignupForm setNewUser={setNewUser}/> : <LoginForm setNewUser={setNewUser}/>}
      </div>
    </div>
  );
}
