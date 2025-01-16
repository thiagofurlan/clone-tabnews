test("DELETE to /api/v1/migrations should return 405", async () => {
  const makeDelete = async () =>
    await fetch("http://localhost:3000/api/v1/migrations", {
      method: "DELETE",
    });

  const response = await makeDelete();
  expect(response.status).toBe(405);
});
