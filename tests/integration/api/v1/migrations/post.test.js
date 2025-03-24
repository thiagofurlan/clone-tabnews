import database from "infra/database";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const makePost = async () =>
          await fetch("http://localhost:3000/api/v1/migrations", {
            method: "POST",
          });

        const firstResponse = await makePost();
        expect(firstResponse.status).toBe(201);
        const firstResponseBody = await firstResponse.json();
        expect(Array.isArray(firstResponseBody)).toBe(true);
        expect(firstResponseBody.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const makePost = async () =>
          await fetch("http://localhost:3000/api/v1/migrations", {
            method: "POST",
          });
        const secondResponse = await makePost();
        expect(secondResponse.status).toBe(200);
        const secondResponseBody = await secondResponse.json();
        expect(Array.isArray(secondResponseBody)).toBe(true);
        expect(secondResponseBody.length).toBe(0);
      });
    });
  });
});
