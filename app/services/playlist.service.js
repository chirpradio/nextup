const { gstore, getPlaylistKey } = require("../db");
const { Playlist } = require("../models");

async function getPlaylist() {
  const playlistId = parseInt((await getPlaylistKey()).id);
  result = await Playlist.get(playlistId);
  return result;
}

module.exports = {
  async isAutomationCaptured() {
    const result = await getPlaylist();
    return result.entityData.is_automation_captured;
  },
  async setAutomationCaptured(isCapture) {
    const playlist = await getPlaylist();
  },
};
