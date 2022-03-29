// SocketService.js

// Manage Socket.IO server
const socketIO = require("socket.io");
const PTYService = require("./PTYService");

class SocketService {
  constructor() {
      this.SocketBook=new Map()
  }

  attachServer(server) {
    if (!server) {
      throw new Error("Server not found...");
    }

    const io = socketIO(server);
    console.log("Created socket server. Waiting for client connection.");
    // "connection" event happens when any client connects to this io instance.
    io.on("connection", socket => {
      console.log("Client connect to socket.", socket.id);

      // Just logging when socket disconnects.
      socket.on("disconnect", () => {
        console.log("Disconnected Socket: ", socket.id);
        this.SocketBook.delete(socket.id)
      });

      // Create a new pty service when client connects.
      let pty = new PTYService(socket);
      pty.write("kubectl exec -it cicd-dev-metric-service-b85cc4cdd-zpcrm /bin/bash \r")

      // add <socket.id,pty> to map
      this.SocketBook.set(socket.id,pty)

      // Attach any event listeners which runs if any event is triggered from socket.io client
      // For now, we are only adding "input" event, where client sends the strings you type on terminal UI.
      socket.on("input", input => {
        //Runs this event function socket receives "input" events from socket.io client
        let pty= this.SocketBook.get(socket.id)
        pty.write(input);
      });
    });
  }
}

module.exports = SocketService;
