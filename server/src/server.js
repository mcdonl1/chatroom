const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { SocketAddress } = require("net");

const corsOrigins = ["http://localhost:3000"];
var corsOptions = {
  origins: corsOrigins,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  serveClient: true,
  cors: {
    origins: corsOrigins,
  },
});

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("./public"));

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
      console.log(users);
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
