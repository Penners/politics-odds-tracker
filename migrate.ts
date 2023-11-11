import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import config from "./drizzle.config";

async function main() {
  const db = drizzle(createClient(config.dbCredentials));

  console.log("Running migrations against DB url:", config.dbCredentials.url);

  await migrate(db, { migrationsFolder: config.out });

  console.log("Migrated successfully");

  process.exit(0);
}

main().catch((e) => {
  console.error("Migration failed");
  console.error(e);
  process.exit(1);
});
