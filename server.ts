import http from "http";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

app.listen(process.env.PORT, () => {
  console.log("server running on port " + process.env.PORT);
});
