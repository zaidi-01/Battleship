import Phaser from "phaser";

export class TextButton extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
    callback: () => void
  ) {
    super(scene, x, y, text, style);

    this.setInteractive({ useHandCursor: true })
      .on("pointerover", () => this.setTint(0xcccccc))
      .on("pointerout", () => this.clearTint())
      .on("pointerdown", () => this.setTint(0x999999))
      .on("pointerup", () => {
        this.clearTint();
        callback();
      });

    scene.add.existing(this);
  }
}
