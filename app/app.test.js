const request = require("supertest");
const app = require("./app");

describe("Test the root path", () => {
  test("It should require login", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/auth/login");
  });
});
