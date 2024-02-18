import { BOARD_CELL_SIZE, BOARD_SIZE, EVENTS } from "@constants";
import { Ship } from "@interfaces";
import { isShipOverlapping } from "@utilities";

/**
 * Represents the game board.
 */
export class GameBoardComponent extends Phaser.GameObjects.Container {
  private ships: Ship[] = [];
  private cellsClicked: Phaser.Geom.Point[] = [];

  private gridCursor!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.create();
  }

  /**
   * Creates the game board.
   */
  create() {
    const grid = this.scene.add
      .grid(0, 0, BOARD_SIZE, BOARD_SIZE, BOARD_CELL_SIZE, BOARD_CELL_SIZE)
      .setOrigin(0)
      .setFillStyle(0xffffff, 0.5)
      .setOutlineStyle(0x000000, 1);
    this.add(grid);

    this.gridCursor = this.scene.add
      .rectangle(0, 0, BOARD_CELL_SIZE, BOARD_CELL_SIZE)
      .setOrigin(0)
      .setFillStyle(0x000000, 0.5)
      .setStrokeStyle(1, 0x0000ff)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, BOARD_SIZE, BOARD_SIZE),
        Phaser.Geom.Rectangle.Contains
      )
      .setActive(false)
      .setVisible(false)
      .on(
        Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
        (pointer: Phaser.Input.Pointer) => {
          if (pointer.leftButtonDown()) {
            const cell = this.objectCell(this.gridCursor);
            if (!this.hasCellBeenClicked(cell)) {
              this.cellsClicked.push(cell);
              this.emit(EVENTS.GRID_CLICK, cell);
            }
          }
        }
      );
    this.add(this.gridCursor);
    this.on(EVENTS.UPDATE_BOARD, () => {
      this.moveWithCursor(this.gridCursor);

      if (this.hasCellBeenClicked(this.objectCell(this.gridCursor))) {
        this.gridCursor.setFillStyle(0xff0000, 0.5);
        this.gridCursor.setStrokeStyle(1, 0xff0000);
      } else {
        this.gridCursor.setFillStyle(0x000000, 0.5);
        this.gridCursor.setStrokeStyle(1, 0x0000ff);
      }
    });
  }

  /**
   * Updates the game board.
   */
  preUpdate() {
    this.emit(EVENTS.UPDATE_BOARD);
  }

  /**
   * Enables the game board.
   */
  enable() {
    this.bringToTop(this.gridCursor);
    this.gridCursor.setActive(true).setVisible(true);
  }

  /**
   * Disables the game board.
   */
  disable() {
    this.gridCursor.setActive(false).setVisible(false);
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
            } else if (!isShipOverlapping(ship, this.ships)) {
              rect.disableInteractive();
              this.removeListener(EVENTS.UPDATE_BOARD, moveFunc);

              resolve();
            }
          }
        );
      this.add(rect);

      const moveFunc = () => {
        this.moveWithCursor(
          rect,
          ship.direction === "horizontal" ? size : BOARD_CELL_SIZE,
          ship.direction === "vertical" ? size : BOARD_CELL_SIZE
        );

        ship.x = Math.floor(rect.x / BOARD_CELL_SIZE);
        ship.y = Math.floor(rect.y / BOARD_CELL_SIZE);

        if (isShipOverlapping(ship, this.ships)) {
          rect.setFillStyle(0xff0000, 1);
        } else {
          rect.setFillStyle(0x000000, 1);
        }
      };
      this.addListener(EVENTS.UPDATE_BOARD, moveFunc);
    });
  }

  private moveWithCursor(
    object: Phaser.GameObjects.Rectangle,
    objectSizeX?: number,
    objectSizeY?: number
  ) {
    const pointer = this.scene.input.activePointer;
    const originX = this.x;
    const originY = this.y;
    const pointerX = pointer.x;
    const pointerY = pointer.y;
    const newX = Math.max(
      0,
      Math.min(
        BOARD_SIZE - (objectSizeX || BOARD_CELL_SIZE),
        Math.floor((pointerX - originX) / BOARD_CELL_SIZE) * BOARD_CELL_SIZE
      )
    );
    const newY = Math.max(
      0,
      Math.min(
        BOARD_SIZE - (objectSizeY || BOARD_CELL_SIZE),
        Math.floor((pointerY - originY) / BOARD_CELL_SIZE) * BOARD_CELL_SIZE
      )
    );

    object.x = newX;
    object.y = newY;
  }

  /**
   * Gets the cell of an object.
   * @param object The object to get the cell from.
   * @returns The cell of the object.
   */
  private objectCell(object: Phaser.GameObjects.Rectangle) {
    return new Phaser.Geom.Point(
      Math.floor(object.x / BOARD_CELL_SIZE),
      Math.floor(object.y / BOARD_CELL_SIZE)
    );
  }

  /**
   * Checks if a cell has been clicked.
   * @param cell The cell to check.
   * @returns True if the cell has been clicked, false otherwise.
   */
  private hasCellBeenClicked(cell: Phaser.Geom.Point) {
    return this.cellsClicked.some(
      (point) => point.x === cell.x && point.y === cell.y
    );
  }
}
