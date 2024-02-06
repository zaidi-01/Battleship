import { GAME_HEIGHT, GAME_WIDTH } from "@constants";
import {
  BackgroundScene,
  DifficultyScene,
  GameScene,
  MenuScene,
  PreloadScene,
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
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
      },
      backgroundColor: "#062436",
      scene: [
        PreloadScene,
        BackgroundScene,
        MenuScene,
        DifficultyScene,
        GameScene,
      ],
    });
  }
}
