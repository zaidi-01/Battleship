import { WebSocketMessage } from "@interfaces";
import { singleton } from "tsyringe";

@singleton()
export class WebSocketService extends WebSocket {
  /**
   * Initializes the WebSocketService.
   */
  constructor() {
    super("ws://localhost:5000");
  }

  /**
   * Sends a message
   * @param message The message to send
   * @param cb Callback
   */
  public sendMessage<T>(message: WebSocketMessage<T>) {
    this.send(JSON.stringify(message));
  }
}
