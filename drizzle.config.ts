// import type { Config } from "drizzle-kit";
import "dotenv/config";

import { Config, defineConfig } from 'drizzle-kit'
export default defineConfig({
  out: "./drizzle",
  schema: "./drizzle/schema.ts",
  driver: 'mysql2',
  dbCredentials: {
    uri: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
}) satisfies Config;  