import { delay, inject, singleton } from "tsyringe";
import { GameService } from "../game/game.service";
import { EVENTS, SCENES } from "@constants";
import { DialogRef } from "./dialog-ref";

/**
 * Represents the data for the dialog container.
 */
export class DialogConfig<T> {
  /**
   * The data to display in the dialog.
   */
  data: T | undefined;
}

/**
 * Service for handling dialog related operations.
 */
@singleton()
export class DialogService {
  /**
   * Initializes the dialog service.
   */
  constructor(
    @inject(delay(() => GameService)) private gameService: GameService
  ) {}

  /**
   * Opens a dialog with the specified data.
   * @param data The data to display in the dialog.
   */
  open<T extends Phaser.GameObjects.Container, D>(
    component: new (...args: any[]) => T,
    config: DialogConfig<D>
  ): DialogRef {
    const container = this.gameService.scene.getScene(SCENES.DIALOG_CONTAINER);
    const dialogRef = new DialogRef();

    container.events.emit(EVENTS.DIALOG_ADD, component, dialogRef, config.data);

    return dialogRef;
  }
}
