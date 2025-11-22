// Global test setup and teardown
const { gstore } = require("../db");

// Global teardown after all tests
afterAll(async () => {
  // Close datastore connection
  if (gstore && gstore.ds) {
    // Datastore doesn't have a direct close method, but we can clear any pending operations
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Clear all timers
  if (global.gc) {
    global.gc();
  }
});

// Increase timeout for integration tests
jest.setTimeout(15000);