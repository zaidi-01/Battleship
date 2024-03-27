import { ACTIONS, EVENTS, SCENES, SHIPS } from "@constants";
import { GameState } from "@enums";
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
        ACTIONS.GAME_STATE_CHANGE,
        this.handleGameStateChange.bind(this, gameCreatedScene)
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
          ACTIONS.GAME_STATE_CHANGE,
          this.handleGameStateChange.bind(this, context)
        );
      },
      (error) => {
        context.events.emit(EVENTS.JOIN_GAME_ERROR, error);
      }
    );

    this.wss.sendData(ACTIONS.JOIN_GAME, gameId);
  }

  /**
   * Handles the game state change.
   * @param context The context of the game.
   * @param state The game state.
   */
  private handleGameStateChange(context: Phaser.Scene, state?: GameState) {
    if (state === GameState.SETUP) {
      this.initializeGame(context);
    }
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
    gameScene.events.on(EVENTS.SHIPS_PLACE_END, () => {
      this.wss.sendData(ACTIONS.SHIPS_PLACED, this.ships);
    });
    gameScene.events.on(EVENTS.LOCAL_TURN_END, (point: Phaser.Geom.Point) => {
      this.wss.sendData(ACTIONS.PLAYER_TURN_END, point);
    });
    gameScene.events.on(EVENTS.PLAY_AGAIN, () => {
      this.wss.sendAction(ACTIONS.PLAY_AGAIN);
    });

    this.wss.on(ACTIONS.SHIPS_PLACED, () => {
      gameScene.events.emit(EVENTS.SHIPS_PLACE_SUCCESS);
    });
    this.wss.on(ACTIONS.GAME_STATE_CHANGE, (state?: GameState) => {
      gameScene.events.emit(EVENTS.GAME_STATE_CHANGE, state);

      if (state === GameState.SETUP) {
        this.ships = JSON.parse(JSON.stringify(SHIPS));
        gameScene.events.emit(EVENTS.SHIPS_PLACE, this.ships);
      }
    });
    this.wss.on(ACTIONS.PLAYER_TURN, () => {
      gameScene.events.emit(EVENTS.LOCAL_TURN);
    });
    this.wss.on(ACTIONS.PLAYER_TURN_SUCCESS, (result?: TurnSuccessResult) => {
      gameScene.events.emit(EVENTS.LOCAL_TURN_SUCCESS, result);
    });
    this.wss.on(ACTIONS.PLAYER_WIN, () => {
      gameScene.events.emit(EVENTS.LOCAL_WIN);
    });
    this.wss.on(ACTIONS.OPPONENT_TURN, () => {
      gameScene.events.emit(EVENTS.ENEMY_TURN);
    });
    this.wss.on(ACTIONS.OPPONENT_TURN_SUCCESS, (result?: TurnSuccessResult) => {
      gameScene.events.emit(EVENTS.ENEMY_TURN_SUCCESS, result);
    });
    this.wss.on(ACTIONS.OPPONENT_WIN, () => {
      gameScene.events.emit(EVENTS.ENEMY_WIN);
    });
    this.wss.on(ACTIONS.PLAY_AGAIN, () => {
      gameScene.events.emit(EVENTS.PLAY_AGAIN_SUCCESS);
    });
    this.wss.on(ACTIONS.RESET_GAME, () => {
      gameScene.events.emit(EVENTS.RESET_GAME);
    });
  }
}
