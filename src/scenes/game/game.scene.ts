import { DialogComponent, DialogData, GameBoardComponent } from "@components";
import { EVENTS, SCENES } from "@constants";
import { HitType } from "@enums";
import { Ship, TurnSuccessResult } from "@interfaces";
import { DialogService } from "@services";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import { container } from "tsyringe";

/**
 * Represents the game scene.
 */
export class GameScene extends Phaser.Scene {
  private dialogService: DialogService;

  private localBoard!: GameBoardComponent;
  private enemyBoard!: GameBoardComponent;

  private hits$ = new BehaviorSubject<number>(0);
  private misses$ = new BehaviorSubject<number>(0);

  private destroy$ = new Subject<void>();

  /**
   * Initializes the game scene.
   */
  constructor() {
    super(SCENES.GAME);

    this.dialogService = container.resolve(DialogService);
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
    this.events.on(EVENTS.LOCAL_WIN, this.localWin, this);
    this.events.on(EVENTS.ENEMY_WIN, this.enemyWin, this);
    this.events.on(Phaser.Scenes.Events.DESTROY, this.destroy, this);

    const hitsText = this.add.text(32, 32, "Hits: 0", {
      fontSize: "32px",
      color: "#ffffff",
    });
    const missesText = this.add.text(32, 64, "Misses: 0", {
      fontSize: "32px",
      color: "#ffffff",
    });

    this.hits$
      .pipe(takeUntil(this.destroy$))
      .subscribe((hits) => hitsText.setText(`Hits: ${hits}`));
    this.misses$
      .pipe(takeUntil(this.destroy$))
      .subscribe((misses) => missesText.setText(`Misses: ${misses}`));
  }

  /**
   * Handles destroying the game scene.
   */
  private destroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.events.removeAllListeners();
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

    switch (result.hitType) {
      case HitType.Hit:
      case HitType.Sunk:
        this.hits$.next(this.hits$.value + 1);
        break;
      case HitType.Miss:
        this.misses$.next(this.misses$.value + 1);
        break;
    }
  }

  /**
   * Handles the enemy turn success.
   */
  private EnemyTurnSuccess(result: TurnSuccessResult) {
    this.localBoard.processTurnResult(result);
  }

  /**
   * Handles the local win.
   */
  private localWin() {
    this.displayGameOverScreen("You win!");
  }

  /**
   * Handles the enemy win.
   */
  private enemyWin() {
    this.displayGameOverScreen("You lose!");
  }

  /**
   * Displays the game over dialog.
   */
  private displayGameOverScreen(message: string) {
    const dialogData = new DialogData();
    dialogData.message = message;
    dialogData.messageStyle.fontSize = "64px";
    dialogData.confirmText = "Play again";

    const dialogRef = this.dialogService.open(DialogComponent, {
      data: dialogData,
    });
    dialogRef.afterClosed$.subscribe(this.reset.bind(this));
  }

  /**
   * Resets the game scene.
   */
  private reset() {
    this.hits$.next(0);
    this.misses$.next(0);

    this.localBoard.reset();
    this.enemyBoard.reset();

    this.events.emit(EVENTS.RESET_GAME);
  }
}
