const { SearchService } = require("../../../services");
const qs = require("qs");

async function indexHandler(req, res) {
  if (req.query.type) {
    res.redirect(`/music/search/${req.query.type}?${qs.stringify(req.query)}`);
    return;
  }

  try {
    const title = req.query.term ? req.query.term : "Search";
    const locals = {
      title: `${title} - CHIRP NextUp`,
      query: req.query,
      search: false,
    };

    const results = await SearchService.search(req.query);
    locals.artists = results.artists;
    locals.albums = results.albums;
    locals.tracks = results.tracks;
    locals.documents = results.documents;
    locals.showAllLink = {
      artists: results.artists.count > 5,
      albums: results.albums.count > 10,
      tracks: results.tracks.count > 10,
      documents: results.documents.count > 10,
    };
    locals.search = true;
    locals.hideSearch = true;

    res.render("music/search/searchResults", locals);
  } catch (err) {
    console.trace(err.message);
    res.status(500).send();
  }
}

async function typeHandler(req, res) {
  try {
    const from = parseInt(req.query.from, 10) || 0;
    const size = 50;
    const results = await SearchService.search(req.query, req.params.type, {
      from,
      size,
    });
    const type = `${req.params.type[0].toUpperCase()}${req.params.type.slice(
      1
    )}`;
    const renderOptions = {
      title: `${type} Search - CHIRP NextUp`,
      query: req.query,
      next: from + size,
      previous: Math.max(from - size, 0),
      first: from + 1,
      last: Math.min(from + 50, results.count),
      enablePrevious: from !== 0,
      enableNext: from + size < results.count,
      filterType: `search/${req.params.type}.filters`,
      resultType: `search/${req.params.type}.results`,
      results,
      type,
      hideSearch: true,
    };

    res.render("music/search/searchType", renderOptions);
  } catch (err) {
    console.trace(err.message);
  }
}

module.exports = {
  indexHandler,
  typeHandler,
};
