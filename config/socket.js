const { green, blue } = require("colorette");

const socket = (io) =>
  io.on("connection", (stream) => {
    console.log(green("[Socket.IO] connection established successfully."));
    console.log(blue(`[${stream.id}] connected to socket.`));

    stream.on("join_room", (room) => stream.join(room));

    stream.on("send_quotation", (data) => {
      stream.broadcast.emit("receive_quotation", data);
    });

    stream.on("send_notification", (data) => {
      stream.broadcast.emit("receive_notification", data);
    });

    stream.on("send_purchases", (data) => {
      stream.broadcast.emit("receive_purchases", data);
    });

    stream.on("logout", (roomId) => stream.to(roomId).emit("logout"));

    stream.emit("me", stream.id);
  });

module.exports = socket;
