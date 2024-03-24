import { singleton } from "tsyringe";

@singleton()
export class RemoteGameController {
  /**
   * Starts a new remote game.
   * @param context The context of the game.
   */
  public startGame(context: Phaser.Scene) {}
}
