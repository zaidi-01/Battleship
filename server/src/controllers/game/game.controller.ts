import { ACTIONS } from "@server/constants";
import { GameState } from "@server/enums";
import {
  ExtWebSocket,
  Player,
  PlayerTurnEnd,
  Ship,
  WebSocketMessage,
} from "@server/interfaces";
import { Game } from "@server/models";

const games = new Map<string, Game>();

/**
 * Handle web socket message.
 * @param client The web socket client.
 * @param message The message.
 */
export function handleMessage(client: ExtWebSocket, message: WebSocketMessage) {
  try {
    switch (message.action) {
      case ACTIONS.CREATE_GAME:
        createGame(client as Player);
        break;
      case ACTIONS.JOIN_GAME:
        joinGame(client as Player, message.data);
        break;
      case ACTIONS.SHIPS_PLACED:
        playerShipsPlaced(client as Player, message.data);
        break;
      case ACTIONS.PLAYER_TURN_END:
        playerTurnEnd(client as Player, message.data);
        break;
      case ACTIONS.PLAY_AGAIN:
        playerPlayAgain(client as Player);
        break;
      default:
        throw new SyntaxError("Invalid action");
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      client.sendError(error.message);
    } else {
      client.sendError((error as Error).message, message);
    }
  }
}

/**
 * Create a game.
 * @param player The player.
 * @param message The message.
 */
function createGame(player: Player) {
  if (player.game) {
    throw new Error("Already in a game");
  }

  const game = new Game();
  games.set(game.id, game);

  game.addPlayer(player);

  player.sendData(ACTIONS.CREATE_GAME, game.id);
}

/**
 * Join a game.
 * @param player The player.
 * @param gameId The game id.
 */
function joinGame(player: Player, gameId: string) {
  if (player.game) {
    throw new Error("Already in a game");
  }

  const game = games.get(gameId);

  if (!game) {
    throw new Error("Invalid game ID");
  }

  const players = game.players;

  if (players.length >= 2) {
    throw new Error("Invalid game ID");
  }

  game.addPlayer(player);

  player.sendAction(ACTIONS.JOIN_GAME);

  game.setup();
}

/**
 * Handle player ships placed.
 * @param player The player.
 * @param ships The ships.
 */
function playerShipsPlaced(player: Player, ships: Ship[]) {
  // TODO: Add server-side valid placement check
  const game = player.game;

  if (!game) {
    throw new Error("Not in a game");
  }

  if (game.state !== GameState.SETUP) {
    throw new Error("Invalid game state");
  }

  if (player.ships) {
    throw new Error("Ships already placed");
  }

  game.addShips(player, ships);

  player.sendAction(ACTIONS.SHIPS_PLACED);

  game.start();
}

/**
 * Handle player turn end.
 * @param player The player.
 * @param turn The turn.
 */
function playerTurnEnd(player: Player, turn: PlayerTurnEnd) {
  const game = player.game;

  if (!game) {
    throw new Error("Not in a game");
  }

  if (game.state !== GameState.PLAY) {
    throw new Error("Invalid game state");
  }

  game.processTurn(player, turn);
}

/**
 * Handle player play again.
 */
function playerPlayAgain(player: Player) {
  const game = player.game;

  if (!game) {
    throw new Error("Not in a game");
  }

  if (game.state !== GameState.END) {
    throw new Error("Invalid game state");
  }

  player.playAgain = true;
  player.sendAction(ACTIONS.PLAY_AGAIN);

  game.reset();
}
