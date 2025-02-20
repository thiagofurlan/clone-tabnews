const { exec } = require("node:child_process");

function checkPostgress() {
  exec(
    "docker exec postgres-dev pg_isready --host localhost",
    (_error, stdout, _stderr) => {
      if (stdout.search("accepting connections") === -1) {
        process.stdout.write(".");
        checkPostgress();
        return;
      }
      console.log("\n✅ PostgreSQL is ready");
    },
  );
}

process.stdout.write("\n\n⏱️ Waiting for PostgreSQL to become available...");

checkPostgress();
