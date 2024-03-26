import { GAME_HEIGHT, GAME_WIDTH } from "@constants";
import {
  BackgroundScene,
  DialogContainerScene,
  DifficultyScene,
  GameCreatedScene,
  GameScene,
  MenuScene,
  PreloadScene,
  RemoteSelectScene,
} from "@scenes";
import { singleton } from "tsyringe";

/**
 * Service class for managing the Phaser game.
 */
@singleton()
export class GameService extends Phaser.Game {
  /**
   * Initializes the game service.
   */
  constructor() {
    super({
      type: Phaser.AUTO,
      backgroundColor: "#062436",
      disableContextMenu: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
      },
      scene: [
        PreloadScene,
        BackgroundScene,
        MenuScene,
        DifficultyScene,
        GameScene,
        DialogContainerScene,
        RemoteSelectScene,
        GameCreatedScene,
      ],
    });
  }
}
