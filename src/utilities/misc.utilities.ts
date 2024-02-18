/**
 * Checks if a cell has been clicked.
 * @param cell The cell to check.
 * @param cellsClicked The cells that have been clicked.
 * @returns True if the cell has been clicked, false otherwise.
 */
export function hasCellBeenClicked(
  cell: Phaser.Geom.Point,
  cellsClicked: Phaser.Geom.Point[]
): boolean {
  return cellsClicked.some((point) => point.x === cell.x && point.y === cell.y);
}
