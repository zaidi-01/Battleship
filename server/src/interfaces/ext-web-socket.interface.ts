import { Game } from "@server/models";
import { WebSocket } from "ws";
import { WebSocketMessage } from "./web-socket-message.interface";

/**
 * Extended WebSocket class.
 */
export interface ExtWebSocket extends WebSocket {
  /**
   * The game.
   */
  game?: Game;

  /**
   * Sends a message
   * @param message The message to send
   * @param cb Callback
   */
  sendMessage<T>(
    message: WebSocketMessage<T>,
    cb?: (err?: Error) => void
  ): void;

  /**
   * Sends data
   * @param action The action
   * @param data The data
   * @param cb Callback
   */
  sendData<T>(action: string, data: T, cb?: (err?: Error) => void): void;

  /**
   * Sends an error message
   * @param message The message that caused the error
   * @param error The error
   * @param cb Callback
   */
  sendError(
    error: string,
    message?: WebSocketMessage,
    cb?: (err?: Error) => void
  ): void;
}