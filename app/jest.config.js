process.env.DATASTORE_PROJECT_ID = "nextup-integration-tests";
process.env.DATASTORE_EMULATOR_HOST = "localhost:8081";
process.env.LASTFM_API_KEY = "abc";
process.env.SESSION_SECRET = "xyz";

module.exports = {
  testEnvironment: "node",
};
