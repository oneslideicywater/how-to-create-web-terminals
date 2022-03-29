// TerminalUI.js

import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';


import "xterm/css/xterm.css";

export class TerminalUI {
  constructor(socket) {
    this.terminal = new Terminal({
      theme: {
        background: "black",
        foreground: "#F5F8FA"
      },

    });


    this.socket = socket;
  }

  /**
   * Attach event listeners for terminal UI and socket.io client
   */
  startListening() {

    this.terminal.onData(data =>{
      this.sendInput(data)
    });

    this.socket.on("output", data => {
      // When there is data from PTY on server, print that on Terminal.
      this.write(data);
    });

  }

  /**
   * Print something to terminal UI.
   */
  write(text) {

    this.terminal.write(text);
  }

  /**
   * Utility function to print new line on terminal.
   */
  prompt() {
    this.terminal.write(`\r\n$ `);

  }

  /**
   * Send whatever you type in Terminal UI to PTY process in server.
   * @param {*} input Input to send to server
   */
  sendInput(input) {
    console.log("input:"+encodeURI(input))
    this.socket.emit("input", input);
  }

  /**
   *
   * @param {HTMLElement} container HTMLElement where xterm can attach terminal ui instance.
   */
  attachTo(container) {
    let fitAddon = new FitAddon();
    this.terminal.loadAddon(fitAddon);
    this.terminal.open(container);
    fitAddon.fit()
    // Default text to display on terminal.
    this.terminal.write("Terminal Connected");
    this.terminal.write("");

    this.prompt();

  }

  clear() {
    this.terminal.clear();
  }
}
