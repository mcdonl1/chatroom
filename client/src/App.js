import logo from "./logo.svg";
import "./App.css";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

function App() {

  const socket = useRef(null);

  useEffect(() => {
    console.log("fetching..");
    fetch("http://localhost:5000/express-server")
      .then(res => res.json().then(msg => console.log(msg)))
      .catch(err => console.log(err));
  });

  

  useEffect(() => {
    // set up socket
    socket.current = io("ws://localhost:5000");
    socket.current.on("connect", (stream) => {
      console.log("Connected");
    });
    return () => {
      // tear down
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
