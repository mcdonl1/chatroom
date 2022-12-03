let config = {
  url: {
    SOCKET_URL: "",
  },
};

if (process.env.NODE_ENV === "production") {
  const SERVER_DATA = window.SERVER_DATA;
  config.url.SOCKET_URL = `ws://${SERVER_DATA.SERVER_URL}`;
} else {
  config.url.SOCKET_URL = "ws://localhost:5000";
}

export { config };
