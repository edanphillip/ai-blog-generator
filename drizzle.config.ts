// // import type { Config } from "drizzle-kit";
// import "dotenv/config";

// import { Config, defineConfig } from 'drizzle-kit';
// export default defineConfig({
//   out: "./drizzle",
//   schema: "./drizzle/schema.ts",
//   driver: 'pg',
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL!,
//   },
//   verbose: true,
//   strict: true,
// }) satisfies Config;  
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
config({ path: '.env' });
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './supabase/migrations', 
  driver: 'pg',
   dbCredentials: {connectionString: process.env.DATABASE_URL!},
});