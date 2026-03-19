import { SignupSchema, SignupSchemaValues } from "@/schemas/signup.schema";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

interface SignUpForm {
  setNewUser: (val: boolean) => void;
}

type SignUpPayload = {
  userName: string;
  email: string;
  password: string;
};

export const SignupForm = ({ setNewUser }: SignUpForm) => {
  const { control, handleSubmit } = useForm<SignupSchemaValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const createUser = useMutation({
    mutationFn: async ({ userName, email, password }: SignUpPayload) => {
      const res = await fetch(`http://localhost:8000/user/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          email: email,
          password: password,
        }),
      });

      if (!res.ok) {
        throw new Error("Sign up failder");
      }

      return res.json();
    },
    onSuccess: () => {
      setNewUser(false);
    },
  });

  const onSubmit = (data: SignupSchemaValues) => {
    createUser.mutate({
      userName: data.userName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Card>
      <CardContent>
        <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="userName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-form-username">
                    User Name
                  </FieldLabel>
                  <Input
                    id="signup-form-username"
                    placeholder="User Name"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-form-email">Email</FieldLabel>
                  <Input
                    id="signup-form-email"
                    placeholder="example@gmail.com"
                    aria-invalid={fieldState.invalid}
                    {...field}
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
                  <FieldLabel htmlFor="signup-form-password">
                    Password
                  </FieldLabel>
                  <Input
                    id="signup-form-password"
                    placeholder="********"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-form-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="signup-form-confirm-password"
                    placeholder="********"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">Sign up</Button>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <span onClick={() => setNewUser(false)}>login</span>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
