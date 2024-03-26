import { ACTIONS } from "@server/constants";
import { GameState } from "@server/enums";
import { Player, Ship } from "@server/interfaces";
import { gameUtilities } from "@server/utilities";

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

  private get canStart(): boolean {
    return this.players_.length === 2 && this.players_.every((player) => !!player.ships);
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
    player.game = this;
    this.players_.push(player);
  }

  /**
   * Setup the game.
   */
  public setup() {
    // TODO: Keep ships server-side and send them to the client.
    this.state_ = GameState.SETUP;
    this.players_.forEach((player) => player.sendAction(ACTIONS.GAME_START));
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

    this.state_ = GameState.PLAY;
    // TODO: Implement game logic
  }
}
