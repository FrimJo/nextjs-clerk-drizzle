"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateUserFormData, createUserFormData } from "@/lib/create-user-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { createUser } from "./actions";

export default function CreateUser() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<CreateUserFormData>({ resolver: zodResolver(createUserFormData), mode: "onBlur" });
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <form onSubmit={handleSubmit((data) => startTransition(() => createUser(data)))}>
        <Input placeholder="Name" {...register("fullName")} />
        {errors.fullName?.message && <p>{errors.fullName?.message}</p>}
        <Button type="submit" disabled={isPending || isSubmitting || !isDirty || !isValid}>
          Create user
        </Button>
      </form>
    </div>
  );
}
