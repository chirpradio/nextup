const { User } = require("../../../models");
const { CrateService, PasswordService } = require("../../../services");
const { errorMessages } = require("../errors");


function sanitizeUserData(user) {
  const { password: _password, api_key: _api_key, ...userResponse } = user.entityData;
  userResponse.__key = user.entityKey;
  return userResponse;
}

module.exports = {
  async listUsers(req, res, next) {
    try {
      const options = {
        format: "ENTITY",
        showKey: true,
      };

      const { entities: users } = await User.list(options);

      // Check if user has volunteer coordinator role or is superuser
      const hasFullAccess = req.user.is_superuser || 
                           req.user.roles?.includes('volunteer_coordinator');

      let responseUsers;
      if (hasFullAccess) {
        // Return full user objects for volunteer coordinators and superusers
        responseUsers = users.map(sanitizeUserData);
      } else {
        // Return limited user data for regular authenticated users
        responseUsers = users.map(user => ({
          first_name: user.entityData.first_name,
          last_name: user.entityData.last_name,
          __key: user.entityKey,
        }));
      }

      res.json(responseUsers);
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
      } catch (error) {
        req.log.error(error, "Error checking for existing user");
      }

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
      const userResponse = sanitizeUserData(user);

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
        return res.status(400).json({
          error: "Your new password cannot match your previous password",
        });
      }

      user.password = newPassword;
      user.password_reset_required = false;
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const updates = req.body;

      // Find existing user
      const user = await User.get(User.gstore.ds.int(userId));

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Email uniqueness check
      if (updates.email && updates.email !== user.email) {
        const existingUser = await User.findOne({ email: updates.email });
        if (existingUser) {
          return res.status(409).json({
            error: "User with this email already exists",
          });
        }
      }

      // Apply updates
      const allowedFields = [
        "first_name",
        "last_name",
        "dj_name",
        "email",
        "roles",
        "is_active",
      ];
      allowedFields.forEach((field) => {
        if (updates.hasOwnProperty(field)) {
          user[field] = updates[field];
        }
      });

      await user.save();

      // Simple success logging
      req.log.info(
        {
          email: user.email,
          updated_by: req.user.email,
          fields: Object.keys(updates),
        },
        "user updated"
      );

      // Return updated user without password or api_key
      const userResponse = sanitizeUserData(user);

      res.json(userResponse);
    } catch (error) {
      next(error);
    }
  },
};
