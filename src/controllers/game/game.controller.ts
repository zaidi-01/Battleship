import { EVENTS, SCENES } from "@constants";
import { Difficulty, GameState, GameType } from "@enums";
import { GameSceneData } from "@scenes";
import { GameService } from "@services";
import { delay, inject, singleton } from "tsyringe";

@singleton()
export class GameController {
  private difficulty!: Difficulty;

  /**
   * Initializes the game controller.
   * @param gameService The game service.
   */
  constructor(
    @inject(delay(() => GameService)) private gameService: GameService
  ) {}

  /**
   * Starts a new local game.
   * @param context The context of the game.
   */
  public startLocalGame(context: Phaser.Scene): void;
  public startLocalGame(context: Phaser.Scene, difficulty: Difficulty): void;
  public startLocalGame(context: Phaser.Scene, difficulty?: Difficulty) {
    if (!difficulty) {
      this.promptForDifficulty(context);
      return;
    }

    this.difficulty = difficulty;
    context.scene.start(SCENES.GAME, {
      difficulty,
      gameType: GameType.Local,
      gameState: GameState.ShipPlacement,
    } as GameSceneData);
  }

  /**
   * Prompts the user for the difficulty of the game.
   * @param context The context of the game.
   */
  private promptForDifficulty(context: Phaser.Scene) {
    context.scene.start(SCENES.DIFFICULTY);

    const difficultyScene = context.scene.get(SCENES.DIFFICULTY);
    difficultyScene.events.on(
      EVENTS.DIFFICULTY_SELECTED,
      (difficulty: Difficulty) => {
        this.startLocalGame(difficultyScene, difficulty);
      }
    );
  }
}
