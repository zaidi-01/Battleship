import { WebSocketMessage } from "@server/interfaces";
import { IncomingMessage } from "http";
import { Duplex } from "stream";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  ws.on("message", (rawMessage) => {
    try {
      const message: WebSocketMessage = JSON.parse(rawMessage.toString());

      if (!message.action) {
        throw new Error("Action is required");
      }

      // TODO: Handle the message
    } catch (error) {
      if (error instanceof SyntaxError) {
        ws.send(
          JSON.stringify({
            action: "error",
            data: "Invalid message format",
          } as WebSocketMessage)
        );
      } else {
        ws.send(
          JSON.stringify({
            action: "error",
            data: (error as Error).message,
          } as WebSocketMessage)
        );
      }
    }
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
