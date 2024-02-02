import { SCENES } from "@constants";
import Phaser from "phaser";

export class BackgroundScene extends Phaser.Scene {
  private waterSprite!: Phaser.GameObjects.Sprite;
  private waterTileSprite!: Phaser.GameObjects.TileSprite;

  constructor() {
    super(SCENES.BACKGROUND);

    window.addEventListener("resize", this.resize.bind(this));
  }

  preload() {
    this.load.spritesheet("water", "assets/spritesheets/water.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.waterSprite = this.add.sprite(0, 0, "water").setVisible(false);
    this.waterSprite.anims.create({
      key: "water",
      frames: this.waterSprite.anims.generateFrameNumbers("water"),
      frameRate: 7,
      repeat: -1,
    });
    this.waterSprite.play("water");

    this.waterTileSprite = this.add
      .tileSprite(0, 0, window.innerWidth, window.innerHeight, "water")
      .setOrigin(0, 0)
      .setAlpha(0.5);
  }

  update() {
    this.waterTileSprite.setFrame(this.waterSprite.frame.name);
  }

  private resize() {
    this.waterTileSprite.setSize(window.innerWidth, window.innerHeight);
  }
}
