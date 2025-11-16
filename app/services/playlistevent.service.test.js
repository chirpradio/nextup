// Mock the PubSub service before importing anything that uses it
const mockPubSubPublish = jest.fn().mockResolvedValue();
jest.mock("./pubsub", () => ({
  publish: mockPubSubPublish,
  topicIds: {
    PLAYLIST_EVENT: "playlist-event"
  }
}));

const { datastore } = require("../db");
const { Playlist, PlaylistEvent, User } = require("../models");
const { PlaylistEventService } = require("../services");

const albumKey = datastore.key(["Album", 123]);
const artistKey = datastore.key(["Artist", 123]);
const trackKey = datastore.key(["Track", 123]);
const expectedTrackData = {
        album: albumKey,
        artist: artistKey,
        track: trackKey,
        label: "Matador",
      };

describe("PlaylistEventService", () => {

    let dj, playlist, eventId;    

    beforeAll(async () => {
      dj = new User({
        date_joined: new Date(),
        email: "dee@jay.com",
        first_name: "Dee",
        last_name: "Jay",
        password: "abc",
        roles: ["dj"],
      }); 
      await dj.save();

      playlist = new Playlist({
        channel: "CHIRP",
        class: ["Playlist", "BroadcastPlaylist"],
      });
      await playlist.save();
    });

    afterAll(async () => {
      await User.delete(dj.id);
      await Playlist.delete(playlist.id);
    });

    describe("Add events", () => {

      afterEach(async () => {        
        mockPubSubPublish.mockClear();
        
        if (eventId) {
          try {
            await PlaylistEvent.delete(eventId);
          } catch (error) {
            // ignore cleanup errors
          }
          eventId = null;
        }
      });

      test("Adds a break", async () => {
        const result = await PlaylistEventService.addBreak();
        eventId = result.id;
        expect(result.class).toEqual(['PlaylistEvent', 'PlaylistBreak']);
      });

      test("Adds a freeform track", async () => {
        const expectedFreeformData = {
          track: {
            title: "track name"
          },
          album: {
            title: "album title",
            label: "self-released"
          },
          artist: {
            name: "artist name"
          },
        }; 

        const result = await PlaylistEventService.addFreeformTrack(expectedFreeformData, dj.entityKey);        
        eventId = result.id;

        expect(result.class).toEqual(['PlaylistEvent', 'PlaylistTrack']);
        expect(result.freeform_album_title).toEqual(expectedFreeformData.album.title);
        expect(result.freeform_artist_name).toEqual(expectedFreeformData.artist.name);
        expect(result.freeform_label).toEqual(expectedFreeformData.album.label);
        expect(result.freeform_track_title).toEqual(expectedFreeformData.track.title);
        expect(result.selector).toEqual(dj.entityKey);
        
        expect(mockPubSubPublish).toHaveBeenCalledWith(
          "playlist-event",
          expect.stringContaining("added")
        );
      });

      test("Adds a library track", async () => {
        const result = await PlaylistEventService.addTrack(expectedTrackData, dj.entityKey);        
        eventId = result.id;

        expect(result.class).toEqual(["PlaylistEvent", "PlaylistTrack"]);
        expect(result.album).toEqual(albumKey);
        expect(result.artist).toEqual(artistKey);
        expect(result.track).toEqual(trackKey);
        expect(result.freeform_label).toEqual(expectedTrackData.label);        
        expect(result.selector).toEqual(dj.entityKey);
        
        expect(mockPubSubPublish).toHaveBeenCalledWith(
          "playlist-event",
          expect.stringContaining("added")
        );
      });

      test("Adds a library track with undesired tags/categories", async () => {
        try {
          const categoryData = Object.assign({
              categories: ["-"],
          }, expectedTrackData);

          const result = await PlaylistEventService.addTrack(categoryData, dj.entityKey);        
          eventId = result.id;

          expect(result.class).toEqual(["PlaylistEvent", "PlaylistTrack"]);        
          expect(mockPubSubPublish).toHaveBeenCalledWith(
            "playlist-event",
            expect.stringContaining("added")
          );
        } catch (error) {
          console.error(error);
          throw error;
        } 
      });
    });

    test("Deletes a track", async () => {
        const result = await PlaylistEventService.addTrack(expectedTrackData, dj.entityKey);
        await PlaylistEventService.deleteTrack(parseInt(result.id, 10));        
        
        await expect(PlaylistEvent.get(result.id)).rejects.toThrow(/not found/i);        
        expect(mockPubSubPublish).toHaveBeenCalledWith(
          "playlist-event",
          expect.stringContaining("deleted")
        );
      });
});
