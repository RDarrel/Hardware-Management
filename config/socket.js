const { green, blue } = require("colorette");

const socket = io =>
  io.on("connection", stream => {
    console.log(green("[Socket.IO] connection established successfully."));
    console.log(blue(`[${stream.id}] connected to socket.`));

    stream.on("join_room", room => stream.join(room));

    stream.on("logout", roomId => stream.to(roomId).emit("logout"));

    stream.emit("me", stream.id);
  });

module.exports = socket;
