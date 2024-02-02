import "phaser";
import { MenuScene } from "./scenes";
import { GAME_HEIGHT, GAME_WIDTH } from "./constants";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [MenuScene],
};

const game = new Phaser.Game(config);
