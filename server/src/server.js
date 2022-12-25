const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { readFileSync, writeFileSync } = require("fs");

let SERVER_DATA = readFileSync("./.config.json").toString();
let newContents = readFileSync("./public/index.html")
  .toString()
  .replace("__SERVER_DATA__", SERVER_DATA);

try {
  writeFileSync("./public/index.html", newContents);
} catch (error) {
  console.log("Cannot serve contents of public:", error);
}

const corsOrigins = ["http://localhost:3000", "https://chatty-chat.fly.dev"];
var corsOptions = {
  origins: corsOrigins,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  serveClient: false,
  cors: {
    origins: corsOrigins,
  },
});

const port = process.env.PORT || 5000;

// Use middlewares
app.use(cors()); // Handle cors for dev
app.use(express.static("./public")); // Serve client on GET /

// This displays message that the server running and listening to specified port
httpServer.listen(port, () => console.log(`Listening on port ${port}`));

const users = {};

msgs = [];

// Socket setup
io.on("connection", socket => {
  socket.on("message", data => {
    const new_msg = {
      content: data.content,
      timestamp: data.timestamp,
      sender: users[socket.id],
    };
    msgs.push(new_msg);
    io.emit("new_message", new_msg);
  });

  socket.on("login", data => {
    if (data.name && data.name.length > 0) {
      users[socket.id] = data.name;
    }
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    if (Object.keys(users).length == -0) {
      msgs = [];
    }
  });
  io.emit("users", users);
  io.emit("message_history", msgs);
});
