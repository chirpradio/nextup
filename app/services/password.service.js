const crypto = require("crypto");

module.exports = {
  generateTemporaryPassword() {
    // Generate a 12-character secure password with mixed case, numbers, and symbols
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";

    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
  },
};
