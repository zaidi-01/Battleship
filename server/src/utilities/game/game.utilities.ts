/**
 * Generate a random game id
 * @returns The game id
 */
export function generateGameId() {
  return Date.now().toString(36).toUpperCase().slice(-6);
}
