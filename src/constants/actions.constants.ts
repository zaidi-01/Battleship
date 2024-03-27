/**
 * The actions that can be sent over the WebSocket.
 */
export const ACTIONS = {
  CREATE_GAME: "create-game",
  GAME_STATE_CHANGE: "game-state-change",
  JOIN_GAME: "join-game",
  OPPONENT_TURN: "opponent-turn",
  OPPONENT_TURN_SUCCESS: "opponent-turn-success",
  OPPONENT_WIN: "opponent-win",
  PLAYER_TURN: "player-turn",
  PLAYER_TURN_END: "player-turn-end",
  PLAYER_TURN_SUCCESS: "player-turn-success",
  PLAYER_WIN: "player-win",
  SHIPS_PLACED: "ships-placed",
};
