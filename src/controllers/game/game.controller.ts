import { inject, singleton } from "tsyringe";
import { LocalGameController } from "./local/local-game.controller";

@singleton()
export class GameController {
  /**
   * Initializes the game controller.
   * @param localGameController The local game controller.
   */
  constructor(
    @inject(LocalGameController)
    private localGameController: LocalGameController
  ) {}

  /**
   * Starts a new local game.
   * @param context The context of the game.
   */
  public startLocalGame(context: Phaser.Scene) {
    this.localGameController.startGame(context);
  }
}
