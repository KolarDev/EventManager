const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

require("./../db/database");

const port = process.env.PORT || 4041;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UHANDLED  REJECTION!!! 🔥");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT  EXCEPTION!!! 🔥");
  process.exit(1);
});
