// socket.io

const User = require("../models/User");
const http = require("http");
const mongoose = require("mongoose");
const httpSocketServer = http.createServer();
const { Server } = require("socket.io");
const { deleteCache, updateCache } = require("./cacheManager");
const { instrument } = require("@socket.io/admin-ui");

const io = new Server(httpSocketServer, {
  cors: {
    origin: [
      "http://localhost:3001",
      "http://127.0.0.1:3001",
      "https://admin.socket.io",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

io.on("connection", (socket) => {
  // new socket setup
  socket.on("setup", async (user) => {
    // join the user to a room
    socket.join(user._id);
    // emit connected event
    io.to(user._id).emit("connected");
    console.log("New user connected");

    // disconnect user

    socket.on("disconnect", async () => {
      setTimeout(async () => {
        const isActive = [...(await io.sockets.adapter.rooms.keys())].includes(
          user._id
        );

        if (isActive) return;

        User.findByIdAndUpdate(
          user._id,
          {
            activeStatus: false,
            lastSeen: new Date(),
          },
          { new: true }
        ).then((result) => {
          if (result) {
            console.log("user updated");
          }
        });
      }, 10000);
    });
  });
});

let roomAndIds = [];

setInterval(async () => {
  roomAndIds = [...(await io.sockets.adapter.rooms.keys())];
  roomAndIds.filter((id) => {
    if (mongoose.isValidObjectId(id)) {
      User.findByIdAndUpdate(
        id,
        {
          $set: {
            activeStatus: true,
          },
        },
        { new: true }
      ).then((result) => {
        if (result) {
          updateCache(`users:${result._id}`, result);
          //   console.log(result);
        }
      });
      return true;
    } else {
      return false;
    }
  });
}, 10000);

module.exports = { httpSocketServer };
