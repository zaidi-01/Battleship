/**
 * Represents a ship in the game.
 */
export interface Ship {
  /* The x-coordinate of the ship. */
  x: number;
  /* The y-coordinate of the ship. */
  y: number;
  /* The length of the ship. */
  length: number;
  /* The direction of the ship. */
  direction: "horizontal" | "vertical";
  /* The hits on the ship. */
  hits: number;
  /* Whether the ship is sunk. */
  sunk: boolean;
}
