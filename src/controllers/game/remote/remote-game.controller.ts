import { SCENES } from "@constants";
import { singleton } from "tsyringe";

@singleton()
export class RemoteGameController {
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
  public createGame(context: Phaser.Scene) {}

  /**
   * Joins a remote game.
   * @param context The context of the game.
   */
  public joinGame(context: Phaser.Scene) {}
}
