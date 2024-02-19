import { EVENTS, SCENES } from "@constants";
import { DialogRef } from "@services";

/**
 * Represents a scene for displaying dialog containers in the game.
 */
export class DialogContainerScene extends Phaser.Scene {
  private dialogContainer!: Phaser.GameObjects.Container;

  /**
   * Initializes the dialog container scene.
   */
  constructor() {
    super(SCENES.DIALOG_CONTAINER);
  }

  /**
   * Creates the dialog container scene.
   */
  create() {
    this.dialogContainer = this.add.container(0, 0);

    this.events.on(EVENTS.DIALOG_ADD, this.addDialog, this);
  }

  /**
   * Adds a dialog to the container.
   * @param dialog The dialog to add to the container.
   */
  addDialog<T extends Phaser.GameObjects.Container>(
    dialog: new (...args: any[]) => T,
    ref: DialogRef,
    data: any
  ) {
    const dialogComponent = new dialog(this, 0, 0, data);
    this.dialogContainer.add(dialogComponent);

    const { width, height } = this.sys.game.canvas;
    const bounds = dialogComponent.getBounds();
    dialogComponent.setPosition(
      width / 2 - bounds.width / 2,
      height / 2 - bounds.height / 2
    );

    dialogComponent.on(EVENTS.DIALOG_CLOSE, (data: any) => {
      this.dialogContainer.remove(dialogComponent);
      ref.close(data);
    });
  }
}
