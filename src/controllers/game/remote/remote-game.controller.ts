import { ACTIONS, EVENTS, SCENES, SHIPS } from "@constants";
import { Ship, TurnSuccessResult } from "@interfaces";
import { WebSocketService } from "@services";
import { inject, singleton } from "tsyringe";

@singleton()
export class RemoteGameController {
  private ships: Ship[] = [];

  /**
   * Initializes the RemoteGameController.
   * @param wss The WebSocketService.
   */
  constructor(@inject(WebSocketService) private wss: WebSocketService) {}

  /**
   * Starts a new remote game.
   * @param context The context of the game.
   */
  public startGame(context: Phaser.Scene) {
    context.scene.start(SCENES.REMOTE_SELECT);
  }

  /**
   * Creates a remote game.
   * @param context The context of the game.
   */
  public createGame(context: Phaser.Scene) {
    this.wss.once(ACTIONS.CREATE_GAME, (gameId?: string) => {
      context.scene.start(SCENES.GAME_CREATED, { gameId });
      const gameCreatedScene = context.scene.get(SCENES.GAME_CREATED);

      this.wss.once(
        ACTIONS.GAME_START,
        this.initializeGame.bind(this, gameCreatedScene)
      );
    });

    this.wss.sendAction(ACTIONS.CREATE_GAME);
  }

  /**
   * Joins a remote game.
   * @param context The context of the game.
   * @param gameId The game ID.
   */
  public joinGame(context: Phaser.Scene): void;
  public joinGame(context: Phaser.Scene, gameId: string): void;
  public joinGame(context: Phaser.Scene, gameId?: string) {
    if (!gameId) {
      context.scene.start(SCENES.GAME_JOIN);
      return;
    }

    this.wss.once(
      ACTIONS.JOIN_GAME,
      () => {
        this.wss.once(
          ACTIONS.GAME_START,
          this.initializeGame.bind(this, context)
        );
      },
      (error) => {
        context.events.emit(EVENTS.JOIN_GAME_ERROR, error);
      }
    );

    this.wss.sendData(ACTIONS.JOIN_GAME, gameId);
  }

  /**
   * Initializes the game.
   * @param context The context of the game.
   */
  private initializeGame(context: Phaser.Scene) {
    context.scene.start(SCENES.GAME);
    const gameScene = context.scene.get(SCENES.GAME);

    gameScene.events.once(Phaser.Scenes.Events.CREATE, () => {
      this.ships = JSON.parse(JSON.stringify(SHIPS));
      gameScene.events.emit(EVENTS.SHIPS_PLACE, this.ships);
    });
    gameScene.events.once(EVENTS.SHIPS_PLACE_SUCCESS, () => {
      this.wss.sendData(ACTIONS.SHIPS_PLACED, this.ships);
    });
    gameScene.events.on(EVENTS.LOCAL_TURN_END, (point: Phaser.Geom.Point) => {
      this.wss.sendData(ACTIONS.PLAYER_TURN_END, point);
    });

    this.wss.on(ACTIONS.PLAYER_TURN, () => {
      gameScene.events.emit(EVENTS.LOCAL_TURN);
    });
    this.wss.on(ACTIONS.PLAYER_TURN_SUCCESS, (result?: TurnSuccessResult) => {
      gameScene.events.emit(EVENTS.LOCAL_TURN_SUCCESS, result);
    });
    this.wss.on(ACTIONS.OPPONENT_TURN_SUCCESS, (result?: TurnSuccessResult) => {
      gameScene.events.emit(EVENTS.ENEMY_TURN_SUCCESS, result);
    });
  }
}
