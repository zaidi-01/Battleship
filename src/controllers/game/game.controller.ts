import { inject, singleton } from "tsyringe";
import { LocalGameController } from "./local/local-game.controller";
import { RemoteGameController } from "./remote/remote-game.controller";

@singleton()
export class GameController {
  /**
   * Initializes the game controller.
   * @param localGameController The local game controller.
   */
  constructor(
    @inject(LocalGameController)
    private localGameController: LocalGameController,
    @inject(RemoteGameController)
    private remoteGameController: RemoteGameController
  ) {}

  /**
   * Starts a new local game.
   * @param context The context of the game.
   */
  public startLocalGame(context: Phaser.Scene) {
    this.localGameController.startGame(context);
  }

  /**
   * Starts a new remote game.
   * @param context The context of the game.
   */
  public startRemoteGame(context: Phaser.Scene) {
    this.remoteGameController.startGame(context);
  }

  /**
   * Creates a remote game.
   * @param context The context of the game.
   */
  public createRemoteGame(context: Phaser.Scene) {
    this.remoteGameController.createGame(context);
  }

  /**
   * Joins a remote game.
   * @param context The context of the game.
   */
  public joinRemoteGame(context: Phaser.Scene) {
    this.remoteGameController.joinGame(context);
  }
}
