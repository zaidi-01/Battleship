import { GAME_HEIGHT, GAME_WIDTH } from "@constants";
import "phaser";
import { BackgroundScene, MenuScene, PreloadScene } from "./scenes";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  backgroundColor: "#062436",
  scene: [PreloadScene, BackgroundScene, MenuScene],
};

const game = new Phaser.Game(config);
