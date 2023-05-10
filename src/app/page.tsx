import { db } from "@/db/db";
import { NewUser, UsersTable } from "@/db/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { like } from "drizzle-orm";

export const runtime = "edge";

export default async function Home() {
  const user = auth();

  if (!user.userId) throw new Error("No user id");

  const users = await db.select().from(UsersTable).where(like(UsersTable.clerkId, user.userId));
  let dbUser = users[0];
  if (!dbUser) {
    console.log("no user found, creating one");
    const newUser: NewUser = {
      clerkId: user.userId,
      email: "who@knows.com",
    };
    const users = await db.insert(UsersTable).values([newUser]).returning();
    if (users.length === 0) throw new Error("Failed to create user");
    console.log("created user");
    dbUser = users[0];
  } else {
    console.log("found user");
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
