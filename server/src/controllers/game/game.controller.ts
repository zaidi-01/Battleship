import { ACTIONS } from "@server/constants";
import { ExtWebSocket, WebSocketMessage } from "@server/interfaces";
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
 * @param client The web socket client.
 * @param message The message.
 */
function createGame(client: ExtWebSocket) {
  if (client.game) {
    throw new Error("Already in a game");
  }

  const game = new Game();
  games.set(game.id, game);

  game.addPlayer(client);

  client.sendData(ACTIONS.CREATE_GAME, game.id);
}

/**
 * Join a game.
 * @param client The web socket client.
 * @param gameId The game id.
 */
function joinGame(client: ExtWebSocket, gameId: string) {
  if (client.game) {
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

  game.addPlayer(client);

  client.sendData(ACTIONS.JOIN_GAME, game.id);
}
