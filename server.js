const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./src/app");

require("./db/database");

const port = process.env.PORT || 4041;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
