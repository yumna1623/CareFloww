import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join user room
    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
};


// DATABASE_URL="postgresql://postgres:yumna1623@localhost:5432/hospitaldb"
// PORT=5000
// JWT_SECRET=yumna
// CLOUDINARY_CLOUD_NAME=dxs0jkahv
// CLOUDINARY_API_KEY=518392825738139
// CLOUDINARY_API_SECRET=-3zShwg54xwu_7mh9uqa2tojyqg
// EMAIL_USER=yumnanasir1623@gmail.com
// EMAIL_PASS=mdcc jadt deql wubi