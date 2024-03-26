import { ACTIONS } from "@server/constants";
import { Player } from "@server/interfaces";
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
   * Gets the players.
   */
  public get players(): Player[] {
    return [...this.players_];
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
   * Starts the game.
   */
  public start() {
    this.players_.forEach((player) => player.sendAction(ACTIONS.GAME_START));
  }
}
