const app = require("./app");
const port = process.env.PORT || 1071;

app.listen(port, () => {
  console.log(`CHIRP DJs app listening on ${port}`);
});
