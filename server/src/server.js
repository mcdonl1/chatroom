const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  serveClient: false,
  cors: {
    origin: "http://localhost:3000"
  }
});

const port = process.env.PORT || 5000;

app.use(cors());

// This displays message that the server running and listening to specified port
httpServer.listen(port, () => console.log(`Listening on port ${port}`));

app.get("/express-server", (req, res) => {
  res.json({ test: "test string here you go" });
});

io.on("connection", (socket) => {
  console.log(socket.id);
});
