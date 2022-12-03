import "./App.css";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "./Constants";
import Home from "./routes/Home";
import Modal, { setAppElement } from "react-modal";

const socket = io(config.url.SOCKET_URL);


const loginModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement("#root");
function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [users, setUsers] = useState([]);
  const [localUser, setLocalUser] = useState({ name: "anonymous" })
  const [msgs, setMsgs] = useState([]);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(true);


  // TODO add message list sorting by timestamp
  useEffect(() => {


    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit("login", { name: "anonymous" });
      setLocalUser({ name: "anonymous" });
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
    //console.log(event);
  };

  const sendMsg = msg => {
    if (msg.length === 0) return;
    socket.emit("message", { content: msg, timestamp: new Date().getTime() })
  }

  const loginEnterListener = event => {
    if (event.key === "Enter") {
      const btn = document.getElementById("login-btn");
      btn.click();
    }
  }

  const handleLogicBtn = event => {
    if (loginUsername.length === 0) return;
    socket.emit("login", { name: loginUsername });
    setLoginUsername("");
    setLoginModalOpen(false);
    setLocalUser({ name: loginUsername });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Chatty Chat</h3>
      </header>
      <Modal
        isOpen={loginModalOpen}
        style={loginModalStyles}
        onAfterOpen={() => {
          document.addEventListener("keydown", loginEnterListener);
        }}
        onAfterClose={() => {
          document.removeEventListener("keydown", loginEnterListener);
        }}
      >
        <div id="login-prompt">
          Enter Username:
          <input type="text" value={loginUsername} onChange={event => setLoginUsername(event.target.value)} />
          <input id="login-btn" onClick={handleLogicBtn} type="submit" value="Login" />
        </div>
      </Modal>
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
