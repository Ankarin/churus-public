import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NEXT_DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
});
