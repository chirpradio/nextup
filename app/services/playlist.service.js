const { gstore } = require("../db");
const { Playlist } = require("../models");

module.exports = {
  async isAutomationCaptured() {
    const playlist = await Playlist.list();
    return playlist.entities[0].is_automation_captured;
  },
};
