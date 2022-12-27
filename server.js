// Dependencies
const express = require("express");
const { createServer } = require("http");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth/authRoute");
const homeRoute = require("./routes/home/homeRoute");
const postRoute = require("./routes/APIs/postRoute");
const { redisClient } = require("./utilities/cacheManager");
const profileRoute = require("./routes/profile/profileRoute");
const fs = require("fs");
const usersRoute = require("./routes/users/usersRoute");
const searchRoute = require("./routes/search/searchRoute");
const messagesRoute = require("./routes/messages/messagesRoute");
const chatRoute = require("./routes/chat/chatRoute");
const { httpSocketServer } = require("./utilities/socket");

// App Initialization and Config
const app = express();
const httpServer = createServer(app);
dotenv.config();

// Express Settings
app.set("view engine", "pug");
app.set("views", "views");

// Middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routes
app.use(authRouter); // authentication route

app.use("/posts", postRoute); // Post router
app.use("/profile", profileRoute); // Profile router
app.use("/search", searchRoute); // search router
app.use("/users", usersRoute); // users router
app.use("/messages", messagesRoute); // messages router
app.use("/chat", chatRoute); // messages router
app.use("/", homeRoute); // home router

// Not Found Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

// Mongodb Connection
async function twitter() {
  try {
    await redisClient.connect();
    await mongoose.connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("DB connected Successfully!!");
  } catch (error) {
    console.log(error);
  }
}

// Server Listen
httpServer.listen(process.env.PORT || 3001, () => {
  twitter();
  console.log("Server is running on port" + " " + process.env.PORT || 3001);
});

httpSocketServer.listen(
  3002,
  console.log("Socket server is running on port 3002")
);
