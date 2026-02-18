export interface GridConfig {
  canvasWidth: number;
  canvasHeight: number;
  iconSize: number;
  spacing: number;
  padding: number;
}

export interface GridResult {
  cols: number;
  rows: number;
  offsetX: number;
  offsetY: number;
  total: number;
  valid: boolean;
}

export function calculateGrid(config: GridConfig): GridResult {
  const { canvasWidth, canvasHeight, iconSize, spacing, padding } = config;

  const usableWidth = canvasWidth - 2 * padding;
  const usableHeight = canvasHeight - 2 * padding;

  const cols = Math.floor(usableWidth / (iconSize + spacing));
  const rows = Math.floor(usableHeight / (iconSize + spacing));

  const offsetX = padding + (usableWidth - cols * (iconSize + spacing) + spacing) / 2;
  const offsetY = padding + (usableHeight - rows * (iconSize + spacing) + spacing) / 2;

  return {
    cols,
    rows,
    offsetX,
    offsetY,
    total: cols * rows,
    valid: cols > 0 && rows > 0,
  };
}

export interface CellPosition {
  x: number;
  y: number;
  iconIndex: number;
}

export function getCellPositions(
  grid: GridResult,
  iconCount: number,
  iconSize: number,
  spacing: number
): CellPosition[] {
  const positions: CellPosition[] = [];
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const index = (row * grid.cols + col) % iconCount;
      const x = grid.offsetX + col * (iconSize + spacing);
      const y = grid.offsetY + row * (iconSize + spacing);
      positions.push({ x, y, iconIndex: index });
    }
  }
  return positions;
}
