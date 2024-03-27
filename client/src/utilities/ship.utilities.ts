import { Ship } from "@interfaces";

/**
 * Checks if a ship is overlapping with another ship.
 * @param ship The ship to check.
 */
export function isShipOverlapping(ship: Ship, ships: Ship[]) {
  const shipBounds = new Phaser.Geom.Rectangle(
    ship.x,
    ship.y,
    (ship.direction === "horizontal" ? ship.length : 1) - 0.1,
    (ship.direction === "vertical" ? ship.length : 1) - 0.1
  );
  return ships.some((placedShip) => {
    const placedShipBounds = new Phaser.Geom.Rectangle(
      placedShip.x,
      placedShip.y,
      (placedShip.direction === "horizontal" ? placedShip.length : 1) - 0.1,
      (placedShip.direction === "vertical" ? placedShip.length : 1) - 0.1
    );
    return Phaser.Geom.Intersects.RectangleToRectangle(
      shipBounds,
      placedShipBounds
    );
  });
}
