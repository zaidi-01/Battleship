import { ACTIONS, EVENTS, SCENES } from "@constants";
import { WebSocketService } from "@services";
import { inject, singleton } from "tsyringe";

@singleton()
export class RemoteGameController {
  /**
   * Initializes the RemoteGameController.
   * @param wss The WebSocketService.
   */
  constructor(@inject(WebSocketService) private wss: WebSocketService) {}

  /**
   * Starts a new remote game.
   * @param context The context of the game.
   */
  public startGame(context: Phaser.Scene) {
    context.scene.start(SCENES.REMOTE_SELECT);
  }

  /**
   * Creates a remote game.
   * @param context The context of the game.
   */
  public createGame(context: Phaser.Scene) {
    this.wss.once(ACTIONS.CREATE_GAME, (gameId?: string) => {
      context.scene.start(SCENES.GAME_CREATED, { gameId });
    });

    this.wss.sendAction(ACTIONS.CREATE_GAME);
  }

  /**
   * Joins a remote game.
   * @param context The context of the game.
   * @param gameId The game ID.
   */
  public joinGame(context: Phaser.Scene): void;
  public joinGame(context: Phaser.Scene, gameId: string): void;
  public joinGame(context: Phaser.Scene, gameId?: string) {
    if (!gameId) {
      context.scene.start(SCENES.GAME_JOIN);
      return;
    }

    this.wss.once(
      ACTIONS.JOIN_GAME,
      () => {
        console.log("Joined game");
      },
      (error) => {
        context.events.emit(EVENTS.JOIN_GAME_ERROR, error);
      }
    );

    this.wss.sendData(ACTIONS.JOIN_GAME, gameId);
  }
}
