import { BOARD_LENGTH, EVENTS, SCENES, SHIPS } from "@constants";
import { Difficulty } from "@enums";
import { Ship } from "@interfaces";
import { GameService } from "@services";
import { isShipOverlapping } from "@utilities";
import { delay, inject, singleton } from "tsyringe";

@singleton()
export class GameController {
  private difficulty!: Difficulty;
  private gameScene!: Phaser.Scene;

  private localShips: Ship[] = [];
  private enemyShips: Ship[] = [];

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
      this.localShips = [...SHIPS];
      this.gameScene.events.emit(EVENTS.SHIPS_PLACE, this.localShips);

      this.enemyShips = this.randomizeShips();
    });
    this.gameScene.events.on(EVENTS.SHIPS_PLACE_SUCCESS, () => {
      this.gameScene.events.emit(EVENTS.LOCAL_TURN);
    });
    this.gameScene.events.on(EVENTS.LOCAL_TURN_END, (point: Phaser.Geom.Point) => {
      console.log(point);
      this.gameScene.events.emit(EVENTS.LOCAL_TURN);
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
      EVENTS.DIFFICULTY_SELECT_SUCCESS,
      (difficulty: Difficulty) => {
        this.startLocalGame(difficultyScene, difficulty);
      }
    );
  }

  /**
   * Generates a random set of ships.
   */
  private randomizeShips(): Ship[] {
    const ships: Ship[] = [];

    for (const ship of SHIPS) {
      let tryCount = 0;
      let placed = false;

      const newShip: Ship = { ...ship };
      do {
        newShip.direction = Phaser.Math.RND.pick(["horizontal", "vertical"]);
        newShip.x = Phaser.Math.RND.between(
          0,
          BOARD_LENGTH -
            1 -
            (newShip.direction === "horizontal" ? newShip.length : 0)
        );
        newShip.y = Phaser.Math.RND.between(
          0,
          BOARD_LENGTH -
            1 -
            (newShip.direction === "vertical" ? newShip.length : 0)
        );

        tryCount++;
        placed = true;

        if (tryCount > 9) {
          placed = false;
          break;
        }
      } while (isShipOverlapping(newShip, ships));

      if (placed) {
        ships.push(newShip);
      }
    }

    return ships;
  }
}
