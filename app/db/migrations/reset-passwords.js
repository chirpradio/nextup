/* 
  Used to keep actual passwords out of the dev database
  as part of the initial setup.
*/
if (process.env.DATASTORE_PROJECT_ID === "chirpradio-hrd") {
  console.error("This should never be run on the production datastore");
  process.exit(1);
}

const argv = require("yargs").array("ignore").argv;
require("../index");
const { User } = require("../../models");
const crypto = require("crypto");

async function resetPasswords() {
  const { entities: users } = await User.list({
    format: "ENTITY",
  });

  let successes = 0;
  let ignored = 0;
  const failed = [];
  let token;
  for (const user of users) {
    if (!argv.ignore.includes(user.email)) {
      token = crypto.randomBytes(8).toString("hex");
      user.password = token;
      try {
        console.log(`saving ${user.email}`);
        await user.save();
        successes++;
      } catch (err) {
        failed.push(user.email);
        console.log(user.email, err);
      }
    } else {
      ignored++;
    }
  }

  console.log(
    `${successes} updated, ${ignored} ignored, ${failed.length} failed`
  );
  console.log(failed);
}

resetPasswords();
