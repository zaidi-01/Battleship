import { GameBoardComponent } from "@components";
import { EVENTS, SCENES } from "@constants";
import { Ship, TurnSuccessResult } from "@interfaces";

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

    this.localBoard = new GameBoardComponent(this, 0, 0).addToUpdateList();
    this.enemyBoard = new GameBoardComponent(this, 0, 0).addToUpdateList();

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

    this.events.on(EVENTS.SHIPS_PLACE, this.placeShips, this);
    this.events.on(EVENTS.LOCAL_TURN, this.localTurn, this);
    this.events.on(EVENTS.LOCAL_TURN_SUCCESS, this.localTurnSuccess, this);
    this.events.on(EVENTS.ENEMY_TURN_SUCCESS, this.EnemyTurnSuccess, this);
  }

  /**
   * Places the ships on the local board.
   * @param ships The ships to place.
   */
  private async placeShips(ships: Ship[]) {
    await this.localBoard.placeShips(ships);
    this.events.emit(EVENTS.SHIPS_PLACE_SUCCESS);
  }

  /**
   * Handles the local turn.
   */
  private localTurn() {
    this.enemyBoard.enable();
    this.enemyBoard.once(EVENTS.GRID_CLICK, (point: Phaser.Geom.Point) => {
      this.enemyBoard.disable();
      this.events.emit(EVENTS.LOCAL_TURN_END, point);
    });
  }

  /**
   * Handles the local turn success.
   */
  private localTurnSuccess(result: TurnSuccessResult) {
    this.enemyBoard.processTurnResult(result);
  }

  /**
   * Handles the enemy turn success.
   */
  private EnemyTurnSuccess(result: TurnSuccessResult) {
    this.localBoard.processTurnResult(result);
  }
}
