"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/db/db";
import { UsersTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/server/clerkClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { RedirectType } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const runtime = "edge";

const createUserFormData = z.object({
  fullName: z.string().min(5),
});

type CreateUserFormData = z.infer<typeof createUserFormData>;

async function createUser(data: CreateUserFormData) {
  "use server";

  const user = await currentUser();
  if (!user) throw Error("No clerk user provided at login.");

  const email = getPrimaryEmailAddress(user);
  if (!email) throw Error("No email provided in clerk object");

  const { fullName } = createUserFormData.parse(data);

  await db
    .insert(UsersTable)
    .values([{ clerkId: user.id, email, fullName }])
    .returning();

  redirect("/", RedirectType.replace);
}

export default async function CreateUser() {
  const user = await currentUser();
  if (!user) throw Error("No clerk user provided at login.");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<CreateUserFormData>({ resolver: zodResolver(createUserFormData), mode: "onBlur" });
  const [isPending, startTransition] = useTransition();
  const isPendingOrSubmitting = isPending || isSubmitting;

  return (
    <div>
      Using email: {getPrimaryEmailAddress(user)}
      <form onSubmit={handleSubmit((data) => startTransition(() => createUser(data)))}>
        <Input placeholder="Name" {...register("fullName")} />
        {errors.fullName?.message && <p>{errors.fullName?.message}</p>}
        <Button type="submit" disabled={isPendingOrSubmitting || isDirty || isValid}>
          Create user
        </Button>
      </form>
    </div>
  );
}

const getPrimaryEmailAddress = (user: User) => {
  const { primaryEmailAddressId } = user;
  if (primaryEmailAddressId === null) return undefined;
  const primaryEmailAddress = user.emailAddresses.find((emailAddress) => emailAddress.id === primaryEmailAddressId);
  return primaryEmailAddress?.emailAddress;
};
