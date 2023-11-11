import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import drizzleConfig from "../../drizzle.config";

const client = createClient({ ...drizzleConfig.dbCredentials });

export const db = drizzle(client, { schema });
