import { WebSocketMessage } from "@interfaces";
import { Subject, filter, take } from "rxjs";
import { singleton } from "tsyringe";

@singleton()
export class WebSocketService extends WebSocket {
  private message$: Subject<WebSocketMessage> = new Subject();

  /**
   * Initializes the WebSocketService.
   */
  constructor() {
    super(
      `${window.location.protocol === "https:" ? "wss" : "ws"}://${
        window.location.host
      }`
    );

    this.addEventListener("message", (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.message$.next(message);
    });
  }

  /**
   * Sends a message.
   * @param message The message to send.
   */
  public sendMessage<T>(message: WebSocketMessage<T>) {
    this.send(JSON.stringify(message));
  }

  /**
   * Sends a message with data.
   * @param action The action.
   * @param data The data.
   */
  public sendData<T>(action: string, data: T) {
    this.sendMessage({ action, data } as WebSocketMessage<T>);
  }

  /**
   * Sends an empty message.
   * @param action The action.
   */
  public sendAction(action: string) {
    this.sendMessage({ action } as WebSocketMessage<undefined>);
  }

  /**
   * Runs a callback once on a specific action.
   * @param action The action to run once on.
   * @param cb Callback.
   * @param cbError Callback on error.
   */
  public once<T>(
    action: string,
    cb: (data?: T) => void,
    cbError?: (error?: string) => void
  ) {
    this.message$
      .pipe(
        filter((message) => message.action === action),
        take(1)
      )
      .subscribe((message) => {
        if (message.type === "error") {
          cbError?.(message.data);
        } else {
          cb(message.data);
        }
      });
  }

  /**
   * Runs a callback on a specific action.
   * @param action The action to run on.
   * @param cb Callback.
   * @param cbError Callback on error.
   */
  public on<T>(
    action: string,
    cb: (data?: T) => void,
    cbError?: (error?: string) => void
  ) {
    this.message$
      .pipe(filter((message) => message.action === action))
      .subscribe((message) => {
        if (message.type === "error") {
          cbError?.(message.data);
        } else {
          cb(message.data);
        }
      });
  }
}
