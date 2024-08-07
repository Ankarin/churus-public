import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
const connectionString = process.env.NEXT_DATABASE_URL;

if (!connectionString) {
  throw new Error("NEXT_DATABASE_URL is not set");
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
