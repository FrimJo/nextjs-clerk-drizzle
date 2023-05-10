import { sql } from "@vercel/postgres";
import { db } from "./db";
import { NewUser, User, UsersTable } from "./schema";

const newUsers: NewUser[] = [
  {
    fullName: "Guillermo Rauch",
    email: "rauchg@vercel.com",
  },
  {
    fullName: "Lee Robinson",
    email: "lee@vercel.com",
  },
  {
    fullName: "Steven Tey",
    email: "stey@vercel.com",
  },
];

async function seed() {
  // Create table with raw SQL
  const createTable = await sql.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        image VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
  `);
  console.log(`Created "users" table`);

  const insertedUsers: User[] = await db.insert(UsersTable).values(newUsers).returning();
  console.log(`Seeded ${insertedUsers.length} users`);

  return {
    createTable,
    insertedUsers,
  };
}

// Run seed
seed();
