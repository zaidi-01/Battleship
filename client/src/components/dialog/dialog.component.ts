import { EVENTS } from "@constants";
import { TextButton } from "@shared";

export class DialogData {
  /**
   * The message to display in the dialog.
   */
  message!: string;
  messageStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontSize: "24px",
    color: "#fff",
  };
  /**
   * The text for the confirm button.
   */
  confirmText: string = "OK";
  /**
   * The text for the cancel button.
   */
  cancelText: string = "Cancel";
}

export class DialogComponent extends Phaser.GameObjects.Container {
  private _data: DialogData;

  private padding = 20;

  /**
   * Initializes the dialog component.
   * @param scene The scene to which the dialog belongs.
   * @param x     The x-coordinate of the dialog.
   * @param y     The y-coordinate of the dialog.
   * @param data  The data to display in the dialog.
   */
  constructor(scene: Phaser.Scene, x: number, y: number, data: DialogData) {
    super(scene, x, y);

    this._data = data;
    this.create();
  }

  create() {
    const messageText = this.scene.add.text(
      this.padding,
      this.padding,
      this._data.message,
      this._data.messageStyle
    );

    const confirmBtn = new TextButton(
      this.scene,
      0,
      0,
      this._data.confirmText,
      {
        fontSize: "24px",
        color: "#fff",
        backgroundColor: "#52321b",
        padding: {
          x: 10,
          y: 5,
        },
      },
      this.close.bind(this, true)
    );
    confirmBtn.setPosition(
      messageText.x + messageText.width - confirmBtn.width - this.padding,
      messageText.y + messageText.height + this.padding
    );

    this.add(messageText);
    this.add(confirmBtn);

    const background = this.scene.add.graphics();
    background.fillStyle(0x062436, 1);

    const { width, height } = this.getBounds();
    background.fillRoundedRect(
      0,
      0,
      width + this.padding * 2,
      height + this.padding * 2,
      10
    );

    this.addAt(background, 0);
  }

  /**
   * Close the dialog.
   * @param data The data to return when the dialog is closed.
   */
  close(data: any) {
    this.emit(EVENTS.DIALOG_CLOSE, data);
    this.destroy();
  }
}
