import { ACTIONS } from "@server/constants";
import { ExtWebSocket, Player, WebSocketMessage } from "@server/interfaces";
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
        createGame(client);
        break;
      case ACTIONS.JOIN_GAME:
        joinGame(client, message.data);
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

  game.start();
}

/**
 * Start a game.
 * @game The game.
 */
export function startGame(game: Game) {
  game.start();
}
