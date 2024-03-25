import { IncomingMessage } from "http";
import { Duplex } from "stream";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  // TODO: Handle the connection
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
    ws.send("Hello from the server!");
  });
});

/**
 * Handle the upgrade event
 * @param req The request
 * @param socket The socket
 * @param head The head
 */
export function handleUpgrade(
  req: IncomingMessage,
  socket: Duplex,
  head: Buffer
) {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
}
