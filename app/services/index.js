const AlbumService = require("./album.service");
const ArtistService = require("./artist.service");
const CrateService = require("./crate.service");
const DateService = require("./date.service");
const DocumentService = require("./document.service");
const PlaylistEventService = require("./playlistevent.service");
const PubSubService = require("./pubsub");
const SearchService = require("./search.service");
const SpotService = require("./spot.service");
const TagEditService = require("./tagedit.service");
const TrackService = require("./track.service");
const TrafficLogService = require("./trafficLog.service");

module.exports = {
  AlbumService,
  ArtistService,
  CrateService,
  DateService,
  DocumentService,
  PlaylistEventService,
  PubSubService,
  SearchService,
  SpotService,
  TagEditService,
  TrackService,
  TrafficLogService,
};
