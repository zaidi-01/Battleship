import { ACTIONS } from "@server/constants";
import { ExtWebSocket, WebSocketMessage } from "@server/interfaces";
import { Game } from "@server/models";

const games = new Map<Game, ExtWebSocket[]>();

/**
 * Handle web socket message.
 * @param client The web socket client
 * @param message The message
 */
export function handleMessage(client: ExtWebSocket, message: WebSocketMessage) {
  try {
    switch (message.action) {
      case ACTIONS.CREATE_GAME:
        createGame(client);
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
 * @param client The web socket client
 * @param message The message
 */
function createGame(client: ExtWebSocket) {
  const game = new Game();

  games.set(game, [client]);

  client.sendData(ACTIONS.CREATE_GAME, game.id);
}
