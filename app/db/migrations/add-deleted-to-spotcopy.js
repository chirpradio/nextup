const { SpotCopy } = require("../../models");

async function up() {
  const { entities: spotCopy } = await SpotCopy.list({
    format: "ENTITY",
  });

  const now = Date.now();
  for (const copy of spotCopy) {    
    if(copy.expire_on && copy.expire_on < now) {      
      copy.deleted = true;
    }
    
    try {
      await copy.save();
    } catch (err) {
      console.error(err.message);
      console.log(err.errors);
      console.log(copy.plain());
    } finally {
      console.log(copy.id, copy.expire_on, copy.deleted);
    }
  }
}

up();
