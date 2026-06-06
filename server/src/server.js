import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { initSocket } from "./socket.js";
import http from "http";

const PORT =
  process.env.PORT || 5000;

const server =
  http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
