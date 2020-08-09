const elasticsearch = require("elasticsearch");

let host;
if (process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD) {
  host = `https://${process.env.ELASTICSEARCH_USERNAME}:${process.env.ELASTICSEARCH_PASSWORD}@${process.env.ELASTICSEARCH_DOMAIN}`;
} else {
  host = `https://${process.env.ELASTICSEARCH_URL}`;
}

const client = new elasticsearch.Client({
  host,
});

function buildFuzzyMultiMatch(term, fields, { from = 0, size = 10 } = {}) {
  return {
    from: from,
    size: size,
    query: {
      bool: {
        should: [
          {
            multi_match: {
              query: term,
              fields: fields,
            },
          },
          {
            multi_match: {
              query: term,
              fuzziness: 1,
              prefix_length: 2,
              fields: fields,
            },
          },
        ],
      },
    },
  };
}

function buildArtistSearch(term, options) {
  const fields = ["normalized_name", "name"];
  return buildFuzzyMultiMatch(term, fields, options);
}

function buildAlbumSearch(term, options) {
  const fields = [
    "normalized_title^3",
    "title^2",
    "album_artist.normalized_name",
    "album_artist.name",
  ];
  return buildFuzzyMultiMatch(term, fields, options);
}

function buildTrackSearch(term, options) {
  const fields = [
    "normalized_title^4",
    "title^3",
    "track_artist.normalized_name^2",
    "track_artist.name^2",
    "album.album_artist.normalized_name",
    "album.album_artist.name",
    "album.normalized_title",
    "album.title",
  ];
  return buildFuzzyMultiMatch(term, fields, options);
}

function buildDocumentSearch(term, { from = 0, size = 10 } = {}) {
  return {
    from: from,
    size: size,
    query: {
      multi_match: {
        query: term,
        fields: ["normalized_unsafe_text", "unsafe_text"],
      },
    },
    highlight: {
      fields: {
        "*unsafe_text": {},
      },
      number_of_fragments: 3,
      pre_tags: ["<mark>"],
      post_tags: ["</mark>"],
    },
  };
}

function getSearchBody(term, index, options) {
  switch (index) {
    case "artist":
      return buildArtistSearch(term, options);
    case "album":
      return buildAlbumSearch(term, options);
    case "track":
      return buildTrackSearch(term, options);
    case "document":
      return buildDocumentSearch(term, options);
    default:
      throw new Error("Invalid index for typed search");
  }
}

async function doTypedSearch(term, index, options) {
  const results = await client.search({
    index,
    body: getSearchBody(term, index, options),
  });

  return {
    hits: results.hits.hits,
    count: results.hits.total.value,
  };
}

async function doMSearch(term) {
  const lines = [
    '{ "index": "artist" }',
    JSON.stringify(buildArtistSearch(term)),
    '{ "index": "album" }',
    JSON.stringify(buildAlbumSearch(term)),
    '{ "index": "track" }',
    JSON.stringify(buildTrackSearch(term)),
    '{ "index": "document" }',
    JSON.stringify(buildDocumentSearch(term)),
  ];

  const { responses } = await client.msearch({
    body: lines.join("\n"),
  });
  const artists = {
    hits: responses[0].hits.hits,
    count: responses[0].hits.total.value,
  };
  const albums = {
    hits: responses[1].hits.hits,
    count: responses[1].hits.total.value,
  };
  const tracks = {
    hits: responses[2].hits.hits,
    count: responses[2].hits.total.value,
  };
  const documents = {
    hits: responses[3].hits.hits,
    count: responses[3].hits.total.value,
  };

  return {
    artists,
    albums,
    tracks,
    documents,
  };
}

async function bulk(body) {
  return await client.bulk({ refresh: true, body });
}

async function count(index) {
  return await client.count({ index });
}

function getAlbumId(album) {
  return album.album_id.value;
}

function getArtistId(artist) {
  return artist.id.toString();
}

function getDocumentId(document, subjectId) {
  return `${document.id}-${subjectId}`;
}

function getTrackId(track, album) {
  return `${getAlbumId(album)}-${track.track_num}`;
}

async function search(term, type = "all", options) {
  const searchFn =
    type === "all" ? doMSearch(term) : doTypedSearch(term, type, options);
  return await searchFn;
}

async function update(index, id, doc) {
  await client.update({
    id: id,
    index: index,
    body: {
      doc: doc,
      doc_as_upsert: true,
    },
  });
}

module.exports = {
  bulk,
  count,
  getAlbumId,
  getArtistId,
  getDocumentId,
  getTrackId,
  search,
  update,
};
