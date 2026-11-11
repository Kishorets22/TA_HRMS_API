/**
 * Checks a designation ID.
 * Must be a positive safe integer (PostgreSQL BIGINT column).
 */
export function isValidDesignationId(id: number): boolean {
  return Number.isSafeInteger(id) && id > 0;
}