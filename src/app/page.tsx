import { db } from "@/db/db";
import { UsersTable } from "@/db/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { like } from "drizzle-orm";
import { redirect } from "next/navigation";

const getUser = async () => {
  const clerkUser = auth();

  if (!clerkUser.userId) throw Error("No clerk id provided at login.");

  const [user] = await db.select().from(UsersTable).where(like(UsersTable.clerkId, clerkUser.userId));

  if (!user) {
    console.warn(`No user with clerk id ${clerkUser.userId} found in db. Redirect to create-user page.}`);
    redirect("/create-user");
  }

  return user;
};

export default async function Home() {
  const user = await getUser();

  return (
    <main>
      <div>
        Welcome {user.fullName} ({user.email})
        <UserButton />
      </div>
    </main>
  );
}
