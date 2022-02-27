const { PubSub } = require("@google-cloud/pubsub");
const pubsub = new PubSub({
  projectId: process.env.DATASTORE_PROJECT_ID,
});
const PLAYLIST_EVENT = "playlist-event";
const topicIds = {
  PLAYLIST_EVENT,
};

async function publish(topicId, message) {
  const data = Buffer.from(message);
  try {
    await pubsub.topic(topicId).publishMessage({ data });
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
  }
}

module.exports = {
  publish,
  topicIds,
};
