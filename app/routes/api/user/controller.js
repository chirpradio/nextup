const { User } = require("../../../models");
const { CrateService } = require("../../../services");
const crypto = require("crypto");

function generateRandomPassword() {
  return crypto.randomBytes(12).toString("hex");
}

module.exports = {
  async listUsers(req, res, next) {
    try {
      const options = {
        format: "ENTITY",
        showKey: true,
      };

      const { entities: users } = await User.list(options);

      // Remove password field from all users
      const safeUsers = users.map((user) => {
        const { password, ...userResponse } = user.entityData;
        userResponse.__key = user.entityKey;
        return userResponse;
      });

      res.json(safeUsers);
    } catch (error) {
      next(error);
    }
  },

  async createUser(req, res, next) {
    try {
      const {
        email,
        first_name,
        last_name,
        dj_name,
        roles = [],
        is_active = true,
      } = req.body;

      // Check if user already exists
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({
            error: "User with this email already exists",
          });
        }
      } catch (error) {}

      // Generate a random password
      const password = generateRandomPassword();

      // Create new user
      const userData = {
        email,
        first_name,
        last_name,
        password,
        date_joined: new Date(),
        is_active,
        is_superuser: false,
        roles,
      };

      if (dj_name) {
        userData.dj_name = dj_name;
      }

      const user = new User(userData);
      await user.save();

      // Create a default crate for the new user
      try {
        await CrateService.addCrate(user.entityKey, "My first crate", true);
      } catch (error) {
        req.log.warn(
          {
            email: user.email,
            error: error.message,
          },
          "failed to create default crate for user"
        );
      }

      // Return user data without password
      const { password: _, ...userResponse } = user.entityData;
      userResponse.__key = user.entityKey;

      req.log.info(
        {
          email: user.email,
          created_by: req.user.email,
        },
        "user created"
      );

      res.status(201).json({
        user: userResponse,
        temporary_password: password,
        message:
          "User created successfully. Please provide the temporary password to the user.",
      });
    } catch (error) {
      next(error);
    }
  },
};
