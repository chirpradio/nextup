const request = require("supertest");
const app = require("./app");
const { User } = require("./models");
require("./services");
jest.mock("./models");
jest.mock("./services");

describe("Authenticate with email and password", () => {
  test("Bad password returns 401", async () => {
    User.findOne.mockReturnValue({
      is_active: true,
      authenticate: jest.fn().mockReturnValue(false),
    });
    const response = await request(app)
      .post("/api/token")
      .send({ email: "is@user.com", password: "wrong" });
    expect(response.statusCode).toBe(401);
  });

  test("Bad email address returns 401", async () => {
    User.findOne.mockRejectedValue(new Error("Not found"));
    const response = await request(app)
      .post("/api/token")
      .send({ email: "not@user.com", password: "password" });
    expect(response.statusCode).toBe(401);
  });
});

describe("Authenticate with API key", () => {
  test("Missing API key or JWT returns 401", async () => {
    const response = await request(app).get("/api/crate");
    expect(response.statusCode).toBe(401);
  });

  test("Bad API key returns 401", async () => {
    User.findOne.mockRejectedValue(new Error("Not found"));
    const response = await request(app).get("/api/crate?api_key=n0g00d");
    expect(response.statusCode).toBe(401);
  });

  test("Cannot authenticate with API key as inactive user", async () => {
    User.findOne.mockReturnValue({
      is_active: false,
    });
    const response = await request(app).get("/api/crate?api_key=abc123");
    expect(response.statusCode).toBe(401);
  });

  test("Authenticates with valid API key and active user", async () => {
    User.findOne.mockReturnValue({
      is_active: true,
    });
    const response = await request(app).get("/api/crate?api_key=abc123");
    expect(response.statusCode).toBe(200);
  });
});
