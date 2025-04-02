import database from "infra/database";
import { InternalServerError } from "infra/errors";

export default async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const databaseName = process.env.POSTGRES_DB;
    const serverVersion = await database.query("SHOW server_version;");
    const serverMaxConnections = await database.query("SHOW max_connections;");
    const openedMaxConnections = await database.query({
      text: `SELECT COUNT(*)::int as opened_connections FROM pg_stat_activity WHERE datname = $1;`,
      values: [databaseName],
    });

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          server_version: serverVersion.rows[0].server_version,
          max_connections: parseInt(
            serverMaxConnections.rows[0].max_connections,
          ),
          opened_connections: openedMaxConnections.rows[0].opened_connections,
        },
      },
    });
  } catch (error) {
    const publicError = new InternalServerError({
      cause: error,
    });
    console.error(error);
    response.status(publicError.status_code).json(publicError);
  }
}
