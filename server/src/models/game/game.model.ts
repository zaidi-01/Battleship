import { ACTIONS } from "@constants";
import { GameState, HitType } from "@enums";
import {
  Player,
  PlayerTurnEnd,
  PlayerTurnSuccessResult,
  Ship,
} from "@interfaces";
import { gameUtilities } from "@utilities";

/**
 * Represents a game.
 */
export class Game {
  /**
   * The game id.
   */
  private id_: string;
  /**
   * The game state.
   */
  private state_: GameState = GameState.WAITING;
  /**
   * The players.
   */
  private players_: Player[] = [];
  /**
   * The current player.
   */
  private currentPlayer?: Player;

  /**
   * Gets the game id.
   */
  public get id(): string {
    return this.id_;
  }

  /**
   * Gets the game state.
   */
  public get state(): GameState {
    return this.state_;
  }

  /**
   * Gets the players.
   */
  public get players(): Player[] {
    return [...this.players_];
  }

  /**
   * Gets a value indicating whether the game can start.
   */
  private get canStart(): boolean {
    return (
      this.state === GameState.SETUP &&
      this.players_.length === 2 &&
      this.players_.every((player) => !!player.ships)
    );
  }

  /**
   * Gets a value indicating whether the game can reset.
   */
  private get canReset(): boolean {
    return (
      this.state === GameState.END &&
      this.players.every((player) => player.playAgain)
    );
  }

  /**
   * Sets the game state and sends the action to the players.
   * @param value The value to set.
   */
  private set state(value: GameState) {
    this.state_ = value;
    this.players_.forEach((player) =>
      player.sendData(ACTIONS.GAME_STATE_CHANGE, value)
    );
  }

  /**
   * Initializes a new instance of the Game class.
   */
  constructor() {
    this.id_ = gameUtilities.generateGameId();
  }

  /**
   * Adds a player to the game.
   * @param player The player.
   */
  public addPlayer(player: Player) {
    if (this.players_.length >= 2) {
      throw new Error("Game is full");
    }

    if (this.players_.includes(player)) {
      throw new Error("Player is already in the game");
    }

    player.game = this;

    const opponent = this.players_[0];
    if (opponent) {
      player.opponent = opponent;
      opponent.opponent = player;
    }

    player.once("close", this.playerDisconnect.bind(this, player));

    this.players_.push(player);
  }

  /**
   * Setup the game.
   */
  public setup() {
    // TODO: Keep ships server-side and send them to the client.
    this.state = GameState.SETUP;
  }

  /**
   * Adds a player's ships.
   * @param player The player.
   * @param ships The ships.
   */
  public addShips(player: Player, ships: Ship[]) {
    player.ships = ships;
  }

  /**
   * Starts the game.
   */
  public start() {
    if (!this.canStart) {
      return;
    }

    this.state = GameState.PLAY;

    const player = this.players_[Math.floor(Math.random() * 2)];
    this.startPlayerTurn(player);
  }

  /**
   * Resets the game.
   */
  public reset() {
    if (!this.canReset) {
      return;
    }

    this.state = GameState.WAITING;

    this.players_.forEach((player) => {
      this.resetPlayer(player);
      player.sendAction(ACTIONS.RESET_GAME);
    });

    this.setup();
  }

  /**
   * Processes a player's turn.
   * @param player The player.
   * @param turn The turn.
   */
  public processTurn(player: Player, turn: PlayerTurnEnd) {
    if (player !== this.currentPlayer) {
      throw new Error("Not the player's turn");
    }

    const result = this.getTurnResult(player, turn);
    player.sendData(ACTIONS.PLAYER_TURN_SUCCESS, result);
    player.opponent!.sendData(ACTIONS.OPPONENT_TURN_SUCCESS, result);

    if (this.checkWinCondition(player)) {
      this.state = GameState.END;

      player.sendAction(ACTIONS.PLAYER_WIN);
      player.opponent!.sendAction(ACTIONS.OPPONENT_WIN);

      return;
    }

    this.startPlayerTurn(player.opponent!);
  }

  /**
   * Starts the player's turn.
   * @param player The player.
   */
  private startPlayerTurn(player: Player) {
    this.currentPlayer = player;

    player.sendAction(ACTIONS.PLAYER_TURN);
    player.opponent!.sendAction(ACTIONS.OPPONENT_TURN);
  }

  /**
   * Gets the result of a turn.
   * @param player The player.
   * @param point The turn point.
   * @returns The result of the turn.
   */
  private getTurnResult(
    player: Player,
    point: { x: number; y: number }
  ): PlayerTurnSuccessResult {
    const ship = this.getShipAtPoint(point, player.opponent!.ships!);
    const result: PlayerTurnSuccessResult = { point, hitType: HitType.Miss };

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
    point: { x: number; y: number },
    ships: Ship[]
  ): Ship | undefined {
    return ships.find((ship) => {
      const p1 = { x: ship.x, y: ship.y };
      const p2 = {
        x: ship.direction === "horizontal" ? ship.x + ship.length - 1 : ship.x,
        y: ship.direction === "vertical" ? ship.y + ship.length - 1 : ship.y,
      };

      return this.distance(point, p1) + this.distance(point, p2) ===
        this.distance(p1, p2)
        ? ship
        : undefined;
    });
  }

  /**
   * Calculates the distance between two points.
   * @param point1 The first point.
   * @param point2 The second point.
   * @returns The distance between the points.
   */
  private distance(
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ): number {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }

  /**
   * Checks the win condition.
   * @param player The player.
   */
  private checkWinCondition(player: Player): boolean {
    return player.opponent!.ships!.every((ship) => ship.sunk);
  }

  /**
   * Handles a player disconnecting.
   */
  private playerDisconnect(player: Player) {
    const opponent = player.opponent;
    
    if (opponent) {
      opponent.sendAction(ACTIONS.OPPONENT_DISCONNECT);
      opponent.game = undefined;
      this.resetPlayer(opponent);
    }
  }

  /**
   * Resets a player.
   * @param player The player.
   */
  public resetPlayer(player: Player) {
    player.ships = undefined;
    player.playAgain = false;
  }
}
