import { WebSocket } from "ws";
import { WebSocketMessage } from "./web-socket-message.interface";

/**
 * Extended WebSocket class.
 */
export interface ExtWebSocket extends WebSocket {
  /**
   * Whether the client is alive.
   */
  isAlive: boolean;

  /**
   * Sends a message.
   * @param message The message to send.
   * @param cb Callback.
   */
  sendMessage<T>(
    message: WebSocketMessage<T>,
    cb?: (err?: Error) => void
  ): void;

  /**
   * Sends an empty message.
   * @param action The action.
   * @param cb Callback.
   */
  sendAction(action: string, cb?: (err?: Error) => void): void;

  /**
   * Sends a message with data.
   * @param action The action.
   * @param data The data.
   * @param cb Callback.
   */
  sendData<T>(action: string, data: T, cb?: (err?: Error) => void): void;

  /**
   * Sends an error message.
   * @param message The message that caused the error.
   * @param error The error.
   * @param cb Callback.
   */
  sendError(
    error: string,
    message?: WebSocketMessage,
    cb?: (err?: Error) => void
  ): void;
}
