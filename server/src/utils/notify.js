import { getIO } from "../socket.js";

export const sendNotification = (userId, event, data) => {
  const io = getIO();

  io.to(userId).emit(event, data);
};