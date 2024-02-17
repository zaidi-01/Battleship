import { EVENTS, SCENES, SHIPS } from "@constants";
import { Difficulty } from "@enums";
import { GameService } from "@services";
import { delay, inject, singleton } from "tsyringe";

@singleton()
export class GameController {
  private difficulty!: Difficulty;
  private gameScene!: Phaser.Scene;

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
    context.scene.start(SCENES.GAME);

    this.gameScene = context.scene.get(SCENES.GAME);
    this.gameScene.events.on(Phaser.Scenes.Events.CREATE, () => {
      this.gameScene.events.emit(EVENTS.SHIP_PLACEMENT, [...SHIPS]);
    });
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
