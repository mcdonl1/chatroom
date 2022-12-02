import "./App.css";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "./Constants";
import Home from "./routes/Home";

const socket = io(config.url.SOCKET_URL);

function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [users, setUsers] = useState([]);
  const [localUser, setLocalUser] = useState({ name: "anonymous" })
  const [msgs, setMsgs] = useState([]);


  const names = ["Lucas", "Anni", "Lucifer", "Beaver"];
  // TODO add message list sorting by timestamp
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      const name = names[Math.floor(Math.random() * names.length)];
      socket.emit("login", { name: name });
      setLocalUser({ name: name });
    });

    socket.on('users', users => setUsers(users));
    socket.on("message_history", msgs => setMsgs(msgs));
    socket.on("new_message", msg => {
      setMsgs(current => {
        let newMsgs = [...current];
        newMsgs.push(msg);
        return newMsgs;
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });
  }, [setMsgs]);

  const showUsers = event => {
    // set the user list to display
    console.log(event);
  };

  const sendMsg = msg => {
    if (msg.length === 0) return;
    socket.emit("message", { content: msg, timestamp: new Date().getTime() })
    // TODO - add locally to list, send in background
    // setMsgs(current => {
    //   let newMsgs = [...current];
    //   newMsgs.push({ content: msg, sender: localUser.name });
    //   return newMsgs;
    // });
  }
  return (
    <div className="App">
      <header className="App-header">
        <h3>Chatty Chat</h3>
      </header>
      <div className="App-body">
        <Home sendMsg={sendMsg} user={localUser} messages={msgs} />
      </div>
      <footer className="App-footer" style={{ color: isConnected ? "green" : "red" }}>
        {isConnected ? "Connected" : "Disconnected"}
        <button
          onClick={showUsers}
          className="button-6">
          Users
        </button>
      </footer>
    </div>
  );
}

export default App;
