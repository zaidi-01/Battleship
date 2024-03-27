import { EVENTS, SCENES } from "@constants";
import { Difficulty } from "@enums";
import { TextButton } from "@shared";

/**
 * Represents the difficulty selection scene of the game.
 */
export class DifficultyScene extends Phaser.Scene {
  /**
   * Initializes the difficulty selection scene.
   */
  constructor() {
    super(SCENES.DIFFICULTY);
  }

  /**
   * Creates the difficulty selection scene.
   */
  create() {
    const easyButton = new TextButton(
      this,
      100,
      100,
      "Easy",
      { color: "#0f0" },
      this.startGame.bind(this, Difficulty.Easy)
    );
    const mediumButton = new TextButton(
      this,
      100,
      200,
      "Medium",
      { color: "#0f0" },
      this.startGame.bind(this, Difficulty.Medium)
    );
    const hardButton = new TextButton(
      this,
      100,
      300,
      "Hard",
      { color: "#0f0" },
      this.startGame.bind(this, Difficulty.Hard)
    );
  }

  /**
   * Starts a new game.
   * @param difficulty The difficulty of the game.
   */
  startGame(difficulty: Difficulty) {
    this.events.emit(EVENTS.DIFFICULTY_SELECT_SUCCESS, difficulty);
  }
}
