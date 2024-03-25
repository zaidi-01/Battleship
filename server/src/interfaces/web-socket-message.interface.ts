/**
 * The web socket message.
 */
export interface WebSocketMessage<T = any> {
  /**
   * The action.
   */
  action: string;
  /**
   * The data.
   */
  data?: T;
}
