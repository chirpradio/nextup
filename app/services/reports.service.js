const TagEditService = require("./tagedit.service");
const levenshtein = require("js-levenshtein");

async function countRotationAlbumPlays(albums, tracks) {
  await Promise.all(
    albums.map(async (album) => {
      const tag = album.current_tags.find((tag) => tag.endsWith("_rotation"));

      album.date_added = await TagEditService.getTimestampByTag(
        album.entityKey,
        tag
      );
      album.plays = [];
      album.play_count = 0;

      tracks.forEach((track) => {
        let freeform, albumDistance, artistDistance;
        if (
          track.freeform_album_title !== null &&
          track.freeform_artist_name !== null &&
          album.album_artist &&
          album.album_artist.name !== null
        ) {
          freeform = true;
          albumDistance = levenshtein(track.freeform_album_title, album.title);
          // remove "The" from the beginning of both strings when calculating distance
          artistDistance = levenshtein(
            track.freeform_artist_name.replace(/^the\s/i, ""),
            album.album_artist.name.replace(/^the\s/i, "")
          );
        }

        /* 
          If the PlaylistTrack references a Track object 
          and the Track object's Album matches this Album
          then count the PlaylistTrack as a play for this Album
          
          OR

          If the DJ entered something freeform
          and there are fewer than two character differences 
          between the manually entered artist and album names
          then count the PlaylistTrack as a play for this Album
        */
        if (
          (track.album !== null && track.album.name === album.entityKey.name) ||
          (freeform && albumDistance < 3 && artistDistance < 3)
        ) {
          album.play_count++;
          album.plays.push(track);
        }
      });
    })
  );

  return albums;
}

function matchFreeformTracks(track1, track2) {
  const matchesArtist =
    track1.freeform_artist_name &&
    track2.freeform_artist_name &&
    levenshtein(
      track1.freeform_artist_name.replace(/^the\s/i, ""),
      track2.freeform_artist_name.replace(/^the\s/i, "")
    ) < 3;
  const matchesAlbum =
    track1.freeform_album_title &&
    track2.freeform_album_title &&
    levenshtein(track1.freeform_album_title, track2.freeform_album_title) < 3;
  const matchesTrack =
    track1.freeform_track_title &&
    track2.freeform_track_title &&
    levenshtein(track1.freeform_track_title, track2.freeform_track_title) < 3;

  return (
    [matchesArtist, matchesAlbum, matchesTrack].filter(
      (match) => match === true
    ).length >= 2
  );
}

async function countFreeformTrackPlays(tracks) {
  const groupedTracks = [];

  const freeformTracks = tracks.filter((track) => track.track === null);
  freeformTracks.forEach((track) => {
    const alreadyAdded = groupedTracks.filter((grouped) =>
      matchFreeformTracks(grouped, track)
    );

    if (alreadyAdded.length > 0) {
      alreadyAdded[0].play_count = alreadyAdded[0].play_count + 1;
    } else {
      groupedTracks.push({
        album_artist: {
          name: track.freeform_artist_name,
        },
        title: track.freeform_album_title,
        playlistTrack: track,
        label: track.freeform_label,
        current_tags: track.categories,
        play_count: 1,
      });
    }
  });

  return groupedTracks;
}

function sortAlbumsByPlaysThenLocal(a, b) {
  // sort by play count first
  if (a.play_count !== b.play_count) {
    return b.play_count - a.play_count;
  }

  // then sort Local Current albums above others
  const aIsLocalCurrent =
    a.current_tags.includes("local_current") === true ? 1 : 0;
  const bIsLocalCurrent =
    b.current_tags.includes("local_current") === true ? 1 : 0;
  if (aIsLocalCurrent !== bIsLocalCurrent) {
    return bIsLocalCurrent - aIsLocalCurrent;
  }

  // then sort Local Classic above the rest
  const aIsLocalClassic =
    a.current_tags.includes("local_classic") === true ? 1 : 0;
  const bIsLocalClassic =
    b.current_tags.includes("local_classic") === true ? 1 : 0;
  return bIsLocalClassic - aIsLocalClassic;
}

module.exports = {
  countRotationAlbumPlays,
  countFreeformTrackPlays,
  sortAlbumsByPlaysThenLocal,
};
