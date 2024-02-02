/**
 * Represents a text button in a Phaser scene.
 */
export class TextButton extends Phaser.GameObjects.Text {
  /**
   * Initializes a new text button.
   * @param scene The Phaser scene to which the button belongs.
   * @param x The x-coordinate of the button.
   * @param y The y-coordinate of the button.
   * @param text The text to display on the button.
   * @param style The style of the text.
   * @param callback The callback function to be called when the button is clicked.
   */
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
