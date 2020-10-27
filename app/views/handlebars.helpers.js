const qs = require("qs");
const { datastore } = require("../db");
const { ArtistService } = require("../services");

const startsWithCapital = new RegExp("^[A-Z]");
const endsWithSentenceBoundary = new RegExp("[.!?]$");

function addEllipses(fragment) {
  if (!startsWithCapital.test(fragment)) {
    fragment = `...${fragment}`;
  }

  if (!endsWithSentenceBoundary.test(fragment)) {
    fragment = `${fragment}...`;
  }

  return fragment;
}

module.exports = {
  addStartAndEndDates(query) {
    let params = "";

    if (query.start) {
      params += `&start=${query.start}`;
    }
    if (query.end) {
      params += `&end=${query.end}`;
    }

    return params;
  },

  displayAlbumArtist(album) {
    if (!album) {
      return "";
    }

    if (album.album_artist) {
      return album.album_artist.name;
    }

    if (album.is_compilation) {
      return "Various Artists";
    }

    return "Unknown";
  },

  displayAlbumOrTrackArtist(track) {
    if (track.album.is_compilation && track.track_artist) {
      return track.track_artist.name;
    } else if (track.album && track.album.album_artist) {
      return track.album.album_artist.name;
    }

    return "";
  },

  displayAlbumTitle(album) {
    let title = album.title;

    if (album.disc_number) {
      title += ` (Disc ${album.disc_number})`;
    }

    return title;
  },

  displayCrateName(crate) {
    return crate.getCrateName();
  },

  displayPlaylistTrackTitle(track) {
    return track.freeform_track_title || track.track.title;
  },

  escapeQuotes(text) {
    return text ? text.replace('"', '""') : "";
  },

  formatTag(value) {
    return value
      .split("_")
      .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
      .join(" ");
  },

  formatDate(date) {
    return date.toLocaleDateString();
  },

  formatDJName(user) {
    return user.dj_name || `${user.first_name} ${user.last_name}`;
  },

  formatMinutesAndSeconds(value) {
    const inSeconds = value / 1000;
    const minutes = Math.trunc(inSeconds / 60);
    const seconds = Math.round(inSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  },

  formatTime(date) {
    return date.toLocaleTimeString("en-US", { timeZone: "America/Chicago" });
  },

  getArtistKeyProp(artist) {
    return ArtistService.getKeyValue(artist);
  },

  getTrackArtistKey(track) {
    const artist = track.album.is_compilation
      ? track.track_artist
      : track.album.album_artist;
    return ArtistService.getKeyValue(artist);
  },

  inc(value) {
    return parseInt(value) + 1;
  },

  isActive(a, b) {
    return a === b ? "active" : "";
  },

  isChecked(prop, value) {
    // eslint-disable-next-line
    return prop == value ? "checked" : "";
  },

  isDisabled(prop) {
    return !prop ? "disabled" : "";
  },

  isExplicit(track) {
    return track.current_tags && track.current_tags.includes("explicit");
  },

  isInvisible(bool) {
    return bool ? "invisible" : "";
  },

  isRecommended(track) {
    return track.current_tags && track.current_tags.includes("recommended");
  },

  isSelected(prop, value) {
    // eslint-disable-next-line
    return prop == value ? "selected" : "";
  },

  parseQuery(query) {
    delete query.from;
    return qs.stringify(query);
  },

  prepareFragment(fragment) {
    return addEllipses(fragment);
  },

  serializeKey(item) {
    const key = item[datastore.KEY] || item.entityKey;
    return JSON.stringify(key.serialized);
  },

  toLowerCase(word) {
    return word.toLowerCase();
  },
};
