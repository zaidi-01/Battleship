import { GameBoardComponent } from "@components";
import { SCENES } from "@constants";
import { Difficulty, GameState, GameType } from "@enums";

export interface GameSceneData {
  difficulty: Difficulty;
  gameType: GameType;
  gameState: GameState;
}

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
  }
}
