import { BOARD_LENGTH, EVENTS, SCENES, SHIPS } from "@constants";
import { Difficulty, HitType } from "@enums";
import { Ship, TurnSuccessResult } from "@interfaces";
import { GameService } from "@services";
import { hasCellBeenClicked, isShipOverlapping } from "@utilities";
import { delay, inject, singleton } from "tsyringe";

@singleton()
export class GameController {
  private difficulty!: Difficulty;
  private gameScene!: Phaser.Scene;

  private localShips: Ship[] = [];
  private enemyShips: Ship[] = [];

  private enemyCellsClicked: Phaser.Geom.Point[] = [];

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
    this.gameScene.events.on(
      EVENTS.LOCAL_TURN_END,
      this.processLocalTurn.bind(this)
    );
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

  /**
   * Processes the local turn.
   * @param point The point of the turn.
   */
  private processLocalTurn(point: Phaser.Geom.Point) {
    const result = this.getTurnResult(point, true);
    this.gameScene.events.emit(EVENTS.LOCAL_TURN_SUCCESS, result);
    this.playEnemyTurn();
  }

  /**
   * Play a turn for the enemy.
   */
  private playEnemyTurn() {
    const point = new Phaser.Geom.Point(0, 0);
    do {
      point.x = Phaser.Math.RND.between(0, BOARD_LENGTH - 1);
      point.y = Phaser.Math.RND.between(0, BOARD_LENGTH - 1);
    } while (hasCellBeenClicked(point, this.enemyCellsClicked));

    this.enemyCellsClicked.push(point);
    const result = this.getTurnResult(point, false);
    this.gameScene.events.emit(EVENTS.ENEMY_TURN_SUCCESS, result);
    this.gameScene.events.emit(EVENTS.LOCAL_TURN);
  }

  /**
   * Gets the result of a turn.
   * @param point The point of the turn.
   * @param local Whether the turn is local.
   * @returns The result of the turn.
   */
  private getTurnResult(
    point: Phaser.Geom.Point,
    local: boolean
  ): TurnSuccessResult {
    const ship = this.getShipAtPoint(
      point,
      local ? this.enemyShips : this.localShips
    );
    const result: TurnSuccessResult = { point, hitType: HitType.Miss };

    if (ship) {
      ship.hits++;
      ship.sunk = ship.hits === ship.length;
      result.hitType = ship.sunk ? HitType.Sunk : HitType.Hit;
      result.ship = ship.sunk ? ship : undefined;
    }

    return result;
  }

  /**
   * Gets the ship at the specified point.
   * @param point The point to check.
   * @param ships The ships to check.
   * @returns The ship at the point, if any.
   */
  private getShipAtPoint(
    point: Phaser.Geom.Point,
    ships: Ship[]
  ): Ship | undefined {
    return ships.find((ship) => {
      const line = new Phaser.Geom.Line(
        ship.x,
        ship.y,
        ship.direction === "horizontal" ? ship.x + ship.length - 1 : ship.x,
        ship.direction === "vertical" ? ship.y + ship.length - 1 : ship.y
      );
      return Phaser.Geom.Intersects.PointToLineSegment(point, line);
    });
  }
}
