"use server";

import { db } from "@/db/db";
import { UsersTable } from "@/db/schema";
import { CreateUserFormData, createUserFormData } from "@/lib/create-user-form";
import { getPrimaryEmailAddress } from "@/lib/utils";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { RedirectType } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export async function createUser(data: CreateUserFormData) {
  const clerkUser = await currentUser();
  if (!clerkUser) throw Error("No clerk user provided at login.");

  const email = getPrimaryEmailAddress(clerkUser);
  if (!email) throw Error("No email provided in clerk object");

  const { fullName } = createUserFormData.parse(data);

  await db
    .insert(UsersTable)
    .values([{ clerkId: clerkUser.id, email, fullName }])
    .returning();

  await clerkClient.users.updateUserMetadata(clerkUser.id, {
    privateMetadata: { ...clerkUser.privateMetadata, isInDb: true },
  });

  redirect("/", RedirectType.replace);
}
