require("../db");
const User = require("./user.model");

describe("Password hashing and authentication", () => {
  const input = "password";
  let user;

  beforeEach(async () => {
    user = new User({
      date_joined: new Date(),
      email: "test@test.com",
      first_name: "Test",
      last_name: "Test",      
    });

    try {
      user.setPassword(input);
      await user.save();
    } catch (err) {
      console.error(err);
    }
  });

  afterEach(async () => {
    await User.delete(parseInt(user.entityKey.id, 10));
  });

  test("The password should be hashed when saved", () => {
    expect(user.password).not.toEqual(input);
  });

  test("The plaintext password should authenticate successfully", () => {
    expect(user.authenticate(input)).toEqual(true);
  });

  test("An incorrect password should not authenticate successfully", () => {
    expect(user.authenticate("wrong-o")).toEqual(false);
  });
});
