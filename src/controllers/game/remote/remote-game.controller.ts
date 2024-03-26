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

      this.wss.once(ACTIONS.GAME_START, this.initializeGame.bind(this, context));
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
        this.wss.once(ACTIONS.GAME_START, this.initializeGame.bind(this, context));
      },
      (error) => {
        context.events.emit(EVENTS.JOIN_GAME_ERROR, error);
      }
    );

    this.wss.sendData(ACTIONS.JOIN_GAME, gameId);
  }

  /**
   * Initializes the game.
   * @param context The context of the game.
   */
  private initializeGame(context: Phaser.Scene) {
    context.scene.start(SCENES.GAME);
    const gameScene = context.scene.get(SCENES.GAME);
  }
}
