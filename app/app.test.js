const request = require("supertest");
const app = require("./app");
const { User } = require("./models");
jest.mock("./models");

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
