const { User } = require("../../../models");
const { CrateService, PasswordService } = require("../../../services");
const { errorMessages } = require("../errors");

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

      // Generate a temporary password
      const temporaryPassword = PasswordService.generateTemporaryPassword();

      // Create new user
      const userData = {
        email,
        first_name,
        last_name,
        password: temporaryPassword,
        date_joined: new Date(),
        is_active,
        is_superuser: false,
        password_reset_required: true,
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
        temporary_password: temporaryPassword,
        message:
          "User created successfully. Please provide the temporary password to the user. They can change it using the change password feature.",
      });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
      const { email, currentPassword, newPassword } = req.body;
      const user = await User.findOne({ email });
      if (!user || !user.is_active || !user.authenticate(currentPassword)) {
        return res
          .status(400)
          .json({ error: errorMessages.INVALID_CREDENTIALS });
      }
      if (currentPassword === newPassword) {
        return res.status(400).json({ error: "Your new password cannot match your previous password"});
      }

      user.password = newPassword;
      user.password_reset_required = false;
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  },
};
