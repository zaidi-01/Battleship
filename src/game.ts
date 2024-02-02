import "phaser";
import { BackgroundScene, MenuScene } from "./scenes";
import { GAME_HEIGHT, GAME_WIDTH, SCENES } from "./constants";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [BackgroundScene, MenuScene],
};

const game = new Phaser.Game(config);

game.scene.start(SCENES.MENU);
game.scene.bringToTop(SCENES.MENU);
