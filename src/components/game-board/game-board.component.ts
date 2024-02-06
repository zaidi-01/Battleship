import { BOARD_CELL_SIZE, BOARD_WIDTH } from "@constants";

/**
 * Represents the game board.
 */
export class GameBoardComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.create();
  }

  /**
   * Creates the game board.
   */
  create() {
    const size = BOARD_WIDTH * BOARD_CELL_SIZE;
    const grid = this.scene.add
      .grid(0, 0, size, size, BOARD_CELL_SIZE, BOARD_CELL_SIZE)
      .setOrigin(0)
      .setFillStyle(0xffffff, 0.5)
      .setOutlineStyle(0x000000, 1);
    this.add(grid);
  }
}
