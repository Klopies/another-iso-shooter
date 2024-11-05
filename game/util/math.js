/**
 *
 * @param {Object} line the coordinates of the line to extend
 * @param {number} line.x1
 * @param {number} line.y1
 * @param {number} line.x2
 * @param {number} line.y2
 * @param {number} extendBy @default 1 // i don't know, but it works kinda fine
 * @example extendLine({ x1: 0, y1: 0, x2: 10, y2: 10 }, 5)
 * @returns
 */
export function extendLine(line, extendBy = 1) {
  const { x1, y1, x2, y2 } = line;
  const length = Math.sqrt(x1 - x2 ** 2 + y1 - y2 ** 2);
  const x3 = x2 + ((x2 - x1) / length) * extendBy;
  const y3 = y2 + ((y2 - y1) / length) * extendBy;
  return {
    x: x3,
    y: y3,
  };
}
