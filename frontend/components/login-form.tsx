"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { UserLoginSchema, UserLoginSchemaValues } from "@/schemas/user.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthHeader } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";

type AuthResBody = {
  access_token: string;
  token_type: string;
};

interface LoginFormProps {
  setNewUser: (val: boolean) => void;
}

export function LoginForm({
  setNewUser,
  className,
  ...props
}: LoginFormProps & React.ComponentProps<"div">) {
  const [viewPassword, setViewPassword] = useState(false);
  const { setAuthHeader } = useAuthHeader();
  const router = useRouter();
  const authenticateUser = useMutation({
    mutationFn: async (data: UserLoginSchemaValues) => {
      const res = await fetch("http://localhost:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: data.username,
          password: data.password,
        }),
      });

      if (!res.ok) {
        throw new Error("authentication failed");
      }
      const authResData = await res.json();
      return authResData;
    },
    onSuccess: (data: AuthResBody) => {
      setAuthHeader({
        accessToken: data.access_token,
        tokenType: data.token_type,
      });
      let date = new Date();
      date.setMinutes(date.getMinutes() + 30);
      document.cookie =
        "authToken" +
        "=" +
        data.access_token +
        date.toUTCString() +
        "; path = /";
      router.push("/dashboard");
    },
  });

  const { control, handleSubmit } = useForm<UserLoginSchemaValues>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: UserLoginSchemaValues) => {
    authenticateUser.mutate(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-login" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={control}
                name="username"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-login-username">
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-login-username"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-login-password">
                      Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type={viewPassword ? "text" : "password"}
                        id="form-login-password"
                        aria-invalid={fieldState.invalid}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-1.5 top-0.5"
                        type="button"
                        onClick={() => setViewPassword((prev) => !prev)}
                      >
                        {viewPassword ? <Eye /> : <EyeOff />}
                      </Button>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <span
                    className="hover:text-foreground"
                    onClick={() => setNewUser(true)}
                  >
                    Sign up
                  </span>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
