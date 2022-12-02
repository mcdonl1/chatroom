 const prod = {
    url: {
        SOCKET_URL: "ws://192.168.2.13:5000"
    }
 }
 const dev = {
    url: {
        SOCKET_URL: "ws://localhost:5000"
    }
 }

export const config = process.env.NODE_ENV === "development" ? dev : prod;