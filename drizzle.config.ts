// import type { Config } from "drizzle-kit";
import "dotenv/config";

// export default {
//   schema: "./drizzle/schema.ts",
// out: "./drizzle",
//   dbCredentials: {
//   uri:
//   host: process.env.DATABASE_HOST,
//     database: process.env.DATABASE_URL!,
//       user: process.env.DATABASE_USERNAME,
//         password: process.env.DATABASE_PASSWORD
// },
// driver: "mysql2",
// } satisfies Config;

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