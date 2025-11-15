process.env.DATASTORE_PROJECT_ID = "nextup-integration-tests";
process.env.DATASTORE_EMULATOR_HOST = "localhost:8081";
process.env.LASTFM_API_KEY = "abc";
process.env.SESSION_SECRET = "xyz";
process.env.JWT_SECRET = "qwerty";

module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  detectOpenHandles: true,
  testTimeout: 10000,
};
