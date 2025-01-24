const { SpotConstraint } = require("../../models");
const { gstore } = require("../../db");

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const hours = Array.from({ length: 24 }, (e, i) => i);
const slots = [54, 55];

async function up() {
  try {
    const transaction = gstore.transaction();
    await transaction.run();

    for (const [i, day] of days.entries()) {
      for (const hour of hours) {
        for (const slot of slots) {
          const id = `${day}:${hour}:${slot}`;
          const constraint = new SpotConstraint(
            {
              dow: i + 1,
              hour,
              slot,
            },
            id
          );
          await constraint.save(transaction);
        }
      }
    }

    await transaction.commit();
  } catch (err) {
    console.error(err.message);
    console.log(err.errors);
  }
}

up();
