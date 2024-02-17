import { BOARD_CELL_SIZE, BOARD_SIZE, EVENTS } from "@constants";
import { Ship } from "@interfaces";

/**
 * Represents the game board.
 */
export class GameBoardComponent extends Phaser.GameObjects.Container {
  private ships: Ship[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.create();
  }

  /**
   * Creates the game board.
   */
  create() {
    const size = BOARD_SIZE * BOARD_CELL_SIZE;
    const grid = this.scene.add
      .grid(0, 0, size, size, BOARD_CELL_SIZE, BOARD_CELL_SIZE)
      .setOrigin(0)
      .setFillStyle(0xffffff, 0.5)
      .setOutlineStyle(0x000000, 1);
    this.add(grid);
  }

  /**
   * Updates the game board.
   */
  update() {
    this.emit(EVENTS.UPDATE_BOARD);
  }

  /**
   * Places the ships on the board.
   * @param ships The ships to place.
   */
  async placeShips(ships: Ship[]) {
    for (const ship of ships) {
      await this.placeShip(ship);
      this.ships.push(ship);
    }
  }

  /**
   * Places a ship on the board.
   * @param ship The ship to place.
   */
  private async placeShip(ship: Ship) {
    return new Promise<void>((resolve) => {
      const size = ship.length * BOARD_CELL_SIZE;
      const x = ship.x * BOARD_CELL_SIZE;
      const y = ship.y * BOARD_CELL_SIZE;
      const rect = this.scene.add
        .rectangle(
          x,
          y,
          ship.direction === "horizontal" ? size : BOARD_CELL_SIZE,
          ship.direction === "vertical" ? size : BOARD_CELL_SIZE
        )
        .setOrigin(0)
        .setInteractive(
          new Phaser.Geom.Rectangle(0, 0, size, size),
          Phaser.Geom.Rectangle.Contains
        )
        .setFillStyle(0x000000, 1)
        .on(
          Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
          (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
              ship.direction =
                ship.direction === "horizontal" ? "vertical" : "horizontal";
              rect.width =
                ship.direction === "horizontal" ? size : BOARD_CELL_SIZE;
              rect.height =
                ship.direction === "vertical" ? size : BOARD_CELL_SIZE;
            } else if (!this.isShipOverlapping(ship)) {
              rect.disableInteractive();
              this.removeListener(EVENTS.UPDATE_BOARD);

              resolve();
            }
          }
        );
      this.add(rect);

      this.addListener(EVENTS.UPDATE_BOARD, () => {
        const pointer = this.scene.input.activePointer;
        const originX = this.x;
        const originY = this.y;
        const pointerX = pointer.x;
        const pointerY = pointer.y;
        const rectX = Math.max(
          0,
          Math.min(
            BOARD_SIZE * BOARD_CELL_SIZE -
              (ship.direction === "horizontal" ? size : BOARD_CELL_SIZE),
            Math.floor((pointerX - originX) / BOARD_CELL_SIZE) * BOARD_CELL_SIZE
          )
        );
        const rectY = Math.max(
          0,
          Math.min(
            BOARD_SIZE * BOARD_CELL_SIZE -
              (ship.direction === "vertical" ? size : BOARD_CELL_SIZE),
            Math.floor((pointerY - originY) / BOARD_CELL_SIZE) * BOARD_CELL_SIZE
          )
        );

        rect.x = rectX;
        rect.y = rectY;

        ship.x = Math.floor(rectX / BOARD_CELL_SIZE);
        ship.y = Math.floor(rectY / BOARD_CELL_SIZE);

        if (this.isShipOverlapping(ship)) {
          rect.setFillStyle(0xff0000, 1);
        } else {
          rect.setFillStyle(0x000000, 1);
        }
      });
    });
  }

  /**
   * Checks if a ship is overlapping with another ship.
   * @param ship The ship to check.
   */
  private isShipOverlapping(ship: Ship) {
    const shipBounds = new Phaser.Geom.Rectangle(
      ship.x,
      ship.y,
      (ship.direction === "horizontal" ? ship.length : 1) - 0.1,
      (ship.direction === "vertical" ? ship.length : 1) - 0.1
    );
    return this.ships.some((placedShip) => {
      const placedShipBounds = new Phaser.Geom.Rectangle(
        placedShip.x,
        placedShip.y,
        (placedShip.direction === "horizontal" ? placedShip.length : 1) - 0.1,
        (placedShip.direction === "vertical" ? placedShip.length : 1) - 0.1
      );
      return Phaser.Geom.Intersects.RectangleToRectangle(
        shipBounds,
        placedShipBounds
      );
    });
  }
}