const { gstore } = require("../db");
const { Track, TagEdit } = require("../models");
const AlbumService = require("./album.service");

module.exports = {
  async getByAlbumAndNumber(album_id, track_num) {
    const album = await AlbumService.getAlbumById(album_id);
    return await Track.findOne({ album: album.entityKey, track_num });
  },
  async updateCurrentTags(track, tags, user) {
    const transaction = gstore.transaction();
    await transaction.run();

    const oldTags = [...track.current_tags];
    track.current_tags = tags;
    await track.save();

    const edit = new TagEdit({
      added: tags,
      removed: oldTags,
      author: user.entityKey,
      subject: track.entityKey,
    });
    await edit.save();

    await transaction.commit();
  },
};
