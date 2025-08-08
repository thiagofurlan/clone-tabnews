import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
import user from "models/user";
import password from "models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const makePost = async () =>
        await fetch("http://localhost:3000/api/v1/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "testuser",
            email: "contato@curso.dev",
            password: "123456",
          }),
        });

      const response = await makePost();
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "testuser",
        email: "contato@curso.dev",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      const userInDatabase = await user.findOneByUsername("testuser");
      const correctPasswordMatch = await password.compare(
        "123456",
        userInDatabase.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "senhaerrada",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });

    test("With duplicated 'email'", async () => {
      const makePost = async (data) =>
        await fetch("http://localhost:3000/api/v1/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

      const response1 = await makePost({
        username: "testuser1",
        email: "duplicado@curso.dev",
        password: "123456",
      });

      expect(response1.status).toBe(201);

      const response2 = await makePost({
        username: "testuser2",
        email: "Duplicado@curso.dev",
        password: "123456",
      });

      const response2Body = await response2.json();

      expect(response2.status).toBe(400);
      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "Os dados informados já estão sendo utilizados.",
        action: "Utilize outro email ou username para realizar o cadastro.",
        status_code: 400,
      });
    });

    test("With duplicated 'username'", async () => {
      const makePost = async (data) =>
        await fetch("http://localhost:3000/api/v1/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

      const response1 = await makePost({
        username: "usernameduplicado",
        email: "email1@curso.dev",
        password: "123456",
      });

      expect(response1.status).toBe(201);

      const response2 = await makePost({
        username: "UsernameDuplicado",
        email: "email2@curso.dev",
        password: "123456",
      });

      const response2Body = await response2.json();

      expect(response2.status).toBe(400);
      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "Os dados informados já estão sendo utilizados.",
        action: "Utilize outro email ou username para realizar o cadastro.",
        status_code: 400,
      });
    });
  });
});
