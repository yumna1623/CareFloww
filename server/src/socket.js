import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(
      "User connected:",
      socket.id
    );

    socket.on("disconnect", () => {
      console.log(
        "User disconnected:",
        socket.id
      );
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};