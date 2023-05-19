import { db } from "@/db/db";
import { UsersTable } from "@/db/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { like } from "drizzle-orm";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function Home() {
  const user = auth();
  if (!user.userId) throw Error("No clerk id provided at login.");

  const users = await db.select().from(UsersTable).where(like(UsersTable.clerkId, user.userId));
  const dbUser = users.at(0);

  if (!dbUser) {
    console.warn(`No user with clerk id ${user.userId} found in db. Redirect to create-user page.}`);
    redirect("/create-user");
  }

  return (
    <main>
      <div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <pre>{JSON.stringify(dbUser, null, 2)}</pre>
        <UserButton />
      </div>
    </main>
  );
}
