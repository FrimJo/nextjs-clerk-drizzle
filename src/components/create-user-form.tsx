"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateUserFormData, createUserFormData } from "@/lib/create-user-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren, useTransition } from "react";
import { useForm } from "react-hook-form";

type CreateUserFormProps = {
  createUser: (data: CreateUserFormData) => Promise<void>;
};

export default function CreateUserForm(props: PropsWithChildren<CreateUserFormProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<CreateUserFormData>({ resolver: zodResolver(createUserFormData), mode: "onBlur" });
  const [isPending, startTransition] = useTransition();

  return (
    <form onSubmit={handleSubmit((data) => startTransition(() => props.createUser(data)))}>
      <Input placeholder="Name" {...register("fullName")} />
      {errors.fullName?.message && <p>{errors.fullName?.message}</p>}
      <Button type="submit" disabled={isPending || isSubmitting || !isDirty || !isValid}>
        Create user
      </Button>
    </form>
  );
}
