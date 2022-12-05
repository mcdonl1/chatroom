import React, { useState } from "react";
import { useEffect } from "react";

export default function Home({ sendMsg, user, messages }) {
  const [msg, setMsg] = useState("");

  const enterListener = event => {
    if (event.key === "Enter") {
      const btn = document.getElementById("msg-send-btn");
      btn.click();
    }
  }
  useEffect(() => {
    document.addEventListener("keydown", enterListener, false);
    return () => {
      document.removeEventListener("keydown", enterListener, false);
    }
  }, []);

  return (
    <div className="home">
      <div className="chat-window">
        <div id="chat-list">
          {messages.map((msg, index) => {
            return (
              <div
                key={index}
                className={
                  msg.sender === user.name
                    ? "sent-msg-container"
                    : "recvd-msg-container"
                }
              >
                <div className="msg">
                  <strong>{msg.sender === user.name ? "Me" : msg.sender}:</strong>&nbsp;{msg.content}
                </div>
              </div>
            );
          })}
        </div>
        <div className="msg-entry">
          <input
            value={msg}
            className="msg-input"
            onChange={event => {
              setMsg(event.target.value)
            }}
          />
          <button id="msg-send-btn" onClick={event => {
            sendMsg(msg);
            setMsg("");
          }}>Send</button>
        </div>
      </div>
    </div>
  );
}
