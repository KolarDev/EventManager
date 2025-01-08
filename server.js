const dotenv = require("dotenv");

// process.on("uncaughtException", err => {
//     console.log(err.name, err.message);
//     console.log("UCAUGHT  EXCEPTION!!! 🔥");

//     process.exit(1);
// });

dotenv.config({ path: "./config.env" });

const app = require("./src/app");

require("./db/database");

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
