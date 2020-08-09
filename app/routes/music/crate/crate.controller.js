const { CrateService } = require("../../../services");
const { Crate } = require("../../../models");
const { datastore } = require("../../../db");

async function getHandler(req, res) {
  try {
    const crate = await Crate.get(parseInt(req.params.crate_id, 10));
    // TODO: check ownership

    // FIXME: good enough to show that *something* was added
    const itemKeys = crate.items
      ? crate.items.map((key) => JSON.stringify(key))
      : [];

    res.render("music/crate/crateItems", {
      crate,
      itemKeys,
      title: "Crates - CHIRP NextUp",
    });
  } catch (err) {
    console.error(err);
    res.send("Crates could not be returned");
  }
}

async function indexHandler(req, res) {
  try {
    const crates = await CrateService.listCratesForUser(req.user);

    res.render("music/crate/crateIndex", {
      crates,
      title: "Crates - CHIRP NextUp",
    });
  } catch (err) {
    console.error(err);
    res.send("Crates could not be returned");
  }
}

async function postHandler(req, res) {
  try {
    const crate = await Crate.get(parseInt(req.params.crate_id, 10));
    const key = datastore.key(JSON.parse(req.body.key));
    if (crate.items) {
      crate.items.push(key);
    } else {
      crate.items = [key];
    }

    if (crate.order) {
      let max = crate.order.reduce((a, b) => Math.max(a, b));
      max++;
      crate.order.push(max);
    } else {
      crate.order = [1];
    }

    await crate.save();

    req.flash("successMessages", [
      `${
        req.body.name
      } added to <a href="https://chirpradio-hrd.appspot.com/djdb/crate">${crate.getCrateName()}</a>`,
    ]);
    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.send("Could not add to crate");
  }
}

module.exports = {
  getHandler,
  indexHandler,
  postHandler,
};
