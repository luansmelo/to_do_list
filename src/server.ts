import app from "./app";
import "reflect-metadata";
import connection from "./database";

connection
  .then(() => {
    app.listen(3006, () => {
      console.log("🏃 Running Server");
    });
  })
  .catch(() => {
    console.log("error connection.");
  });
