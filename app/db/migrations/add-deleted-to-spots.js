const { Spot } = require("../../models");

async function up() {
  const { entities: spots } = await Spot.list({
    format: "ENTITY",
  });

  for (const spot of spots) {
    if (spot.active === false) {
      spot.deleted = true;
    }

    try {
      await spot.save();
    } catch (err) {
      console.error(err.message);
      console.log(err.errors);
      console.log(spot.plain());
      console.log("---");
    }
  }
}

up();
