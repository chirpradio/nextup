const request = require("supertest");
const app = require("./app");

describe("Test the root path", () => {
  test("It should redirect you to /music", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/music");
  });

  test("Without authenticating, /music should redirect you to login", async () => {
    const response = await request(app).get("/music");
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/auth/login");
  });
});
