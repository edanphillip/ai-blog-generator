import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

const connection = connect({
  host: process.env.SUPABASE_URL ,
  username: process.env.DATABASE_USERNAME,
  password: process.env.SUPABASE_KEY
});
export const db = drizzle(connection);
