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
  /**
   * The type.
   */
  type?: "error" | "success";
}
