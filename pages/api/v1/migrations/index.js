import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const migrationConfig = {
    dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationConfig);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationConfig,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      await dbClient.end();
      return response.status(201).json(migratedMigrations);
    }
    await dbClient.end();
    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}
