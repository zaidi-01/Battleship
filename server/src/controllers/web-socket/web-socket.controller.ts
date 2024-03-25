import { ExtWebSocket, WebSocketMessage } from "@server/interfaces";
import { IncomingMessage } from "http";
import { Duplex } from "stream";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (client: ExtWebSocket) => {
  client.sendMessage = (message: WebSocketMessage) =>
    client.send(JSON.stringify(message));
  client.sendData = (action: string, data: any, cb?: (err?: Error) => void) =>
    client.sendMessage(
      {
        action,
        data,
        type: "success",
      },
      cb
    );
  client.sendError = (
    error: string,
    message?: WebSocketMessage,
    cb?: (err?: Error) => void
  ) =>
    client.sendMessage(
      {
        action: message?.action || "error",
        data: error,
        type: "error",
      },
      cb
    );

  client.on("message", (rawMessage) => {
    try {
      const message: WebSocketMessage = JSON.parse(rawMessage.toString());

      if (!message.action) {
        throw new Error("Action is required");
      }

      // TODO: Handle the message
    } catch (error) {
      if (error instanceof SyntaxError) {
        client.sendError("Invalid message format");
      } else {
        client.sendError((error as Error).message);
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
  wss.handleUpgrade(req, socket, head, (client) => {
    wss.emit("connection", client);
  });
}
