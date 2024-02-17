import { GameBoardComponent } from "@components";
import { EVENTS, SCENES } from "@constants";
import { Ship } from "@interfaces";

/**
 * Represents the game scene.
 */
export class GameScene extends Phaser.Scene {
  private localBoard!: GameBoardComponent;
  private enemyBoard!: GameBoardComponent;

  /**
   * Initializes the game scene.
   */
  constructor() {
    super(SCENES.GAME);
  }

  /**
   * Creates the game scene.
   */
  create() {
    const boardsContainer = this.add.container(0, 0);

    this.localBoard = new GameBoardComponent(this, 0, 0);
    this.enemyBoard = new GameBoardComponent(this, 0, 0);

    boardsContainer.add(this.localBoard);
    boardsContainer.add(this.enemyBoard);

    const { width, height } = this.sys.game.canvas;
    const boardWidth = this.localBoard.getBounds().width;
    const boardHeight = this.localBoard.getBounds().height;
    const padding = (width - boardWidth * 2) / 3;

    Phaser.Actions.GridAlign([this.localBoard, this.enemyBoard], {
      width: 2,
      height: 1,
      cellWidth: boardWidth + padding,
      cellHeight: boardHeight,
      x: padding,
      y: height - padding - boardHeight,
    });

    this.events.on(EVENTS.SHIP_PLACEMENT, this.placeShips, this);
  }

  /**
   * Updates the game scene.
   */
  update() {
    this.localBoard.update();
  }

  /**
   * Places the ships on the local board.
   */
  placeShips(ships: Ship[]) {
    this.localBoard.placeShips(ships);
  }
}
