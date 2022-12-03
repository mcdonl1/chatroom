const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { SocketAddress } = require("net");
const { readFile, writeFile } = require("fs");

readFile("./.config.json", (err, res) => {
  let SERVER_DATA = res.toString();
  readFile("./public/index.html", (err, res) => {
    let newContents = res.toString().replace("__SERVER_DATA__", SERVER_DATA);
    writeFile("./public/index.html", newContents, (err, data) => {
      if (err) console.log(err);
    });
    app.use(express.static("./public"));
  });
});

const corsOrigins = ["http://localhost:3000"];
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
let SERVER_DATA = {};
app.use(cors());

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
