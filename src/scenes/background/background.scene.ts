import { ASSETS, SCENES } from "@constants";
import Phaser from "phaser";

export class BackgroundScene extends Phaser.Scene {
  private waterSprite!: Phaser.GameObjects.Sprite;
  private waterTileSprite!: Phaser.GameObjects.TileSprite;

  constructor() {
    super(SCENES.BACKGROUND);
  }

  create() {
    const { width, height } = this.scale;

    this.waterSprite = this.add
      .sprite(0, 0, ASSETS.SPRITESHEETS.WATER)
      .setVisible(false);
    this.waterSprite.anims.create({
      key: ASSETS.SPRITESHEETS.WATER,
      frames: this.waterSprite.anims.generateFrameNumbers("water"),
      frameRate: 7,
      repeat: -1,
    });
    this.waterSprite.play(ASSETS.SPRITESHEETS.WATER);

    this.waterTileSprite = this.add
      .tileSprite(0, 0, width, height, ASSETS.SPRITESHEETS.WATER)
      .setOrigin(0, 0);
  }

  update() {
    this.waterTileSprite.setFrame(this.waterSprite.frame.name);
  }
}
