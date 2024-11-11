const elasticsearch = require("elasticsearch");

let host;
if (process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD) {
  host = `https://${process.env.ELASTICSEARCH_USERNAME}:${process.env.ELASTICSEARCH_PASSWORD}@${process.env.ELASTICSEARCH_DOMAIN}`;
} else {
  host = `http://${process.env.ELASTICSEARCH_DOMAIN}`;
}

const client = new elasticsearch.Client({
  host,
  ssl: { rejectUnauthorized: false, pfx: [] },
});

async function search(params, index = "all", options) {
  const trimmedParams = removeEmptyStrings(params);
  const searchFn =
    index === "all"
      ? doMSearch(trimmedParams, options)
      : doSearchByIndex(trimmedParams, index, options);
  return await searchFn;
}

function removeEmptyStrings(obj) {
  return Object.entries(obj)
    .filter(([_, v]) => v !== "")
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: v === Object(v) ? removeEmptyStrings(v) : v,
      }),
      {}
    );
}

async function doMSearch(params, options) {
  const keys = Object.keys(params);
  const emptyParams =
    keys.length === 0 ||
    (keys.length === 1 && keys[0] === "term" && params.term === "");
  const lines = emptyParams ? getRandomQueries() : getQueries(params);

  const { responses } = await client.msearch({
    body: lines.join("\n"),
  });

  return {
    artist: getFormattedResultsObject(responses[0]),
    album: getFormattedResultsObject(responses[1]),
    track: getFormattedResultsObject(responses[2]),
    document: getFormattedResultsObject(responses[3]),
  };
}

function getRandomQuery({ from = 0, size = 10 } = options) {
  return {
    from,
    size,
    query: {
      bool: {
        must: {
          function_score: {
            random_score: {},
          },
        },
        must_not: {
          terms: {
            current_tags: ["explicit"],
          },
        },
      },
    },
  };
}

function getRandomQueries() {
  const queryString = JSON.stringify(getRandomQuery({ size: 10 }));

  return [
    '{ "index": "artist" }',
    queryString,
    '{ "index": "album" }',
    queryString,
    '{ "index": "track" }',
    queryString,
  ];
}

function getQueries(params) {
  return [
    '{ "index": "artist" }',
    JSON.stringify(buildArtistSearch(params)),
    '{ "index": "album" }',
    JSON.stringify(buildAlbumSearch(params)),
    '{ "index": "track" }',
    JSON.stringify(buildTrackSearch(params)),
    '{ "index": "document" }',
    JSON.stringify(buildDocumentSearch(params)),
  ];
}

function buildQueryObj({ from = 0, size = 10 } = {}) {
  return {
    from: from,
    size: size,
    query: {
      bool: {},
    },
  };
}

function buildArtistSearch(params, options) {
  if (!options) {
    options = {
      size: 5,
    };
  }

  const queryObj =
    options.as_you_type === true
      ? buildArtistSearchAsYouType(params, options)
      : buildFuzzyArtistSearch(params, options);
  return queryObj;
}

function buildFuzzyArtistSearch(params, options) {
  const queryObj = buildQueryObj(options);

  if (params.term) {
    Object.assign(
      queryObj.query.bool,
      buildFuzzyMultiMatch(params.term, [
        "name.normalized_standard",
        "name.normalized_whitespace",
        "name",
      ])
    );
  }

  return queryObj;
}

function buildArtistSearchAsYouType(params, options) {
  return {
    query: {
      multi_match: {
        query: params.term,
        type: "bool_prefix",
        fields: [
          "name.search_as_you_type",
          "name.search_as_you_type._2gram",
          "name.search_as_you_type._3gram",
          "name.normalized_standard",
        ],
      },
    },
    size: options.size,
  };
}

function buildAlbumSearch(params, options) {
  const queryObj = buildQueryObj(options);
  queryObj.sort = ["_score", "album_artist.name.keyword", "title.keyword"];

  if (params.term) {
    Object.assign(
      queryObj.query.bool,
      buildFuzzyMultiMatch(params.term, [
        "title.normalized_standard^3",
        "title.normalized_whitespace^3",
        "title^2",
        "album_artist.name.normalized_standard",
        "album_artist.name.normalized_whitespace",
        "album_artist.name",
        "label",
      ])
    );
  }

  if (params.album) {
    queryObj.query.bool.filter = buildAlbumFilters(params.album);
  }

  return queryObj;
}

function buildAlbumFilters(params, prefix = "") {
  const filters = [];
  for (const key in params) {
    switch (key) {
      case "rotation":
        if (params.rotation !== "any") {
          filters.push(
            buildQuery("terms", `${prefix}current_tags`, [params.rotation])
          );
        }
        break;
      case "local":
        if (params.local !== "any") {
          filters.push(
            buildQuery("terms", `${prefix}current_tags`, [params.local])
          );
        }
        break;
      case "is_compilation":
        filters.push(buildQuery("match", `${prefix}${key}`, params[key]));
        break;
      default:
        filters.push(
          buildQuery("match_phrase", `${prefix}${key}`, params[key])
        );
    }
  }

  return filters;
}

function buildTrackSearch(params, options) {
  const queryObj = buildQueryObj(options);
  queryObj.sort = [
    "_score",
    "album.album_artist.name.keyword",
    "track_artist.name.keyword",
    "album.title.keyword",
    "track_num",
  ];

  if (params.term) {
    Object.assign(
      queryObj.query.bool,
      buildFuzzyMultiMatch(params.term, [
        "title.normalized_standard^4",
        "title.normalized_whitespace^4",
        "title^3",
        "track_artist.name.normalized_standard^2",
        "track_artist.name.normalized_whitespace^2",
        "track_artist.name^2",
        "album.album_artist.name.normalized_standard",
        "album.album_artist.name.normalized_whitespace",
        "album.album_artist.name",
        "album.title.normalized_standard",
        "album.title.normalized_whitespace",
        "album.title",
      ])
    );
  }

  queryObj.query.bool.filter = [];
  if (params.track) {
    queryObj.query.bool.filter = queryObj.query.bool.filter.concat(
      buildTrackFilters(params)
    );
  }
  if (params.album) {
    queryObj.query.bool.filter = queryObj.query.bool.filter.concat(
      buildAlbumFilters(params.album, "album.")
    );
  }

  return queryObj;
}

function buildTrackFilters(params) {
  const filters = [];

  if (params.track) {
    if (params.track.duration_ms) {
      const durationFilter = {
        range: {
          duration_ms: params.track.duration_ms,
        },
      };

      if (durationFilter.range.duration_ms.lte === "") {
        delete durationFilter.range.duration_ms.lte;
      }

      filters.push(durationFilter);
    }

    if (params.track.is_recommended) {
      filters.push({ match: { current_tags: "recommended" } });
    }
  }

  return filters;
}

function buildDocumentSearch(params, { from = 0, size = 10 } = {}) {
  return {
    from: from,
    size: size,
    query: {
      multi_match: {
        query: params.term,
        operator: "AND",
        fields: ["unsafe_text.normalized", "unsafe_text"],
      },
    },
    highlight: {
      fields: {
        "unsafe_text*": {},
      },
      number_of_fragments: 3,
      pre_tags: ["<mark>"],
      post_tags: ["</mark>"],
    },
  };
}

function buildFuzzyMultiMatch(term, fields) {
  return {
    minimum_should_match: 1,
    should: [
      {
        multi_match: {
          query: term,
          operator: "AND",
          fields: fields,
          boost: 2,
        },
      },
      {
        multi_match: {
          query: term,
          operator: "AND",
          fuzziness: 1,
          prefix_length: 1,
          fields: fields,
        },
      },
    ],
  };
}

function buildQuery(type, field, value) {
  const query = {};
  const filter = {};
  filter[field] = value;
  query[type] = filter;
  return query;
}

function noSearchTermsInParams(params) {
  const noTerm =
    !Object.prototype.hasOwnProperty.call(params, "term") || params.term === "";
  const noAlbum =
    !Object.prototype.hasOwnProperty.call(params, "album") ||
    (typeof params.album === "object" &&
      Object.keys(params.album).length === 0);
  const noTrack =
    !Object.prototype.hasOwnProperty.call(params, "track") ||
    (typeof params.track === "object" &&
      Object.keys(params.track).length === 0);
  return noTerm && noAlbum && noTrack;
}

async function doSearchByIndex(params, index, options) {
  const body = noSearchTermsInParams(params)
    ? getRandomQuery(options)
    : getSearchBody(params, index, options);
  // const body = Object.assign(mainBody, options);

  const results = await client.search({
    index,
    body,
  });

  return getFormattedResultsObject(results);
}

function getSearchBody(params, index, options) {
  switch (index) {
    case "artist":
      return buildArtistSearch(params, options);
    case "album":
      return buildAlbumSearch(params, options);
    case "track":
      return buildTrackSearch(params, options);
    case "document":
      return buildDocumentSearch(params, options);
    default:
      throw new Error("Invalid index for typed search");
  }
}

function getFormattedResultsObject(results) {
  const formatted = {
    hits: [],
    count: 0,
  };

  if (results) {
    formatted.hits = results.hits.hits;
    formatted.count = results.hits.total.value;
  }

  return formatted;
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

async function get(index, id) {
  return await client.get({
    index,
    id,
  });
}

async function update(index, id, doc) {
  const result = await client.update({
    id: id,
    index: index,
    body: {
      doc: doc,
      doc_as_upsert: true,
    },
    refresh: true,
  });
  return result;
}

module.exports = {
  bulk,
  count,
  get,
  getAlbumId,
  getArtistId,
  getDocumentId,
  getTrackId,
  search,
  update,
};
