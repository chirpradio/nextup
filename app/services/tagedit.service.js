const { TagEdit } = require("../models");

async function getTimestampByTag(subjectKey, tag) {
  const { entities: edits } = await TagEdit.list({
    filters: [
      ["subject", subjectKey],
      ["added", tag],
    ],
    order: { property: "timestamp", descending: true },
    limit: 1,
  });

  const timestamp = edits.length ? edits[0].timestamp : undefined;
  return timestamp;
}

async function listTagEditsSinceDate(date) {
  const { entities: edits } = await TagEdit.list({
    filters: [["timestamp", ">=", date]],
  });
  return edits;
}

module.exports = {
  getTimestampByTag,
  listTagEditsSinceDate,
};
