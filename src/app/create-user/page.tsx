import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/db/db";
import { UsersTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { RedirectType } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export const runtime = "edge";

async function createUser(data: FormData) {
  "use server";

  const user = await currentUser();
  if (!user) throw Error("No clerk user provided at login.");
  const email = user.emailAddresses[0]?.emailAddress as string | undefined;
  if (!email) throw Error("No email provided in clerk object");
  const fullName = data.get("fullName");
  if (!fullName) throw Error("No name provided in form");

  const users = await db
    .insert(UsersTable)
    .values([{ clerkId: user.id, email, fullName: fullName.toString() }])
    .returning();
  if (users.length === 0) throw new Error("Failed to create user");
  console.log("Created user");
  redirect("/", RedirectType.replace);
}

export default async function CreateUser() {
  const user = await currentUser();

  if (!user) throw Error("No clerk user provided at login.");

  return (
    <div>
      Using email: {user.emailAddresses[0]?.emailAddress}
      <form action={createUser}>
        <Input placeholder="Name" name="fullName" />
        <Button type="submit">Create user</Button>
      </form>
    </div>
  );
}
