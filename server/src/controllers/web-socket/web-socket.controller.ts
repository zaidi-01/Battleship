import { gameController } from "@controllers";
import { ExtWebSocket, WebSocketMessage } from "@interfaces";
import { IncomingMessage } from "http";
import { Duplex } from "stream";
import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

const cleanupInterval = setInterval(() => {
  wss.clients.forEach((client: WebSocket) => {
    const extClient = client as ExtWebSocket;

    if (extClient.isAlive === false) {
      extClient.terminate();
    }

    extClient.isAlive = false;
    extClient.ping();
  });
}, 1 * 1000);

wss.on("connection", (client: ExtWebSocket) => {
  client.isAlive = true;

  client.sendMessage = (message: WebSocketMessage) =>
    client.send(JSON.stringify(message));
  client.sendAction = (action: string, cb?: (err?: Error) => void) =>
    client.sendMessage({ action, type: "success" }, cb);
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

  client.on("error", console.error);
  client.on("pong", heartbeat.bind(null, client));
  client.on("message", (rawMessage) => {
    try {
      const message: WebSocketMessage = JSON.parse(rawMessage.toString());

      if (!message.action) {
        throw new Error("Action is required");
      }

      gameController.handleMessage(client, message);
    } catch (error) {
      if (error instanceof SyntaxError) {
        client.sendError("Invalid message format");
      } else {
        client.sendError((error as Error).message);
      }
    }
  });
});
wss.on("close", clearInterval.bind(null, cleanupInterval));

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

/**
 * Sets client as alive
 * @param client The client
 */
function heartbeat(client: ExtWebSocket) {
  client.isAlive = true;
}
