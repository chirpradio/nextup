const gstore = require("../db/index").gstore;
const { Schema } = gstore;
const crypto = require("crypto");

const userSchema = new Schema({
  date_joined: { type: Date, required: true, write: false },
  dj_name: { type: String },
  email: { type: String, validate: "isEmail", required: true },
  external_id: { type: Number, write: false },
  first_name: { type: String, required: true },
  is_active: { type: Boolean },
  is_superuser: { type: Boolean },
  last_login: { type: Date, default: gstore.defaultValues.NOW },
  last_name: { type: String, required: true },
  password: { type: String, required: true },
  password_reset_required: { type: Boolean, default: false },
  api_key: { type: String },
  roles: { type: Array, default: [] },
});

function hashPassword(input) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

userSchema.methods.setPassword = function (input) {
  // matches the approach of the existing DJDB app
  const salt = crypto.randomBytes(2).toString("hex");
  const hash = hashPassword(salt + input);
  this.password = salt + hash;

  return Promise.resolve();
};

userSchema.methods.authenticate = function (plainText) {
  const salt = this.password.substring(0, 4);
  const hash = this.password.substring(4);
  const rehash = hashPassword(salt + plainText);
  return hash === rehash;
};

userSchema.methods.isDJ = function () {
  return this.roles.includes("dj");
};

userSchema.methods.isMusicDirector = function () {
  return this.roles.includes("music_director");
};

userSchema.methods.isTrafficLogAdmin = function () {
  return this.roles.includes("traffic_log_admin");
};

userSchema.methods.isVolunteerCoordinator = function () {
  return this.roles.includes("volunteer_coordinator");
};

module.exports = gstore.model("User", userSchema);
