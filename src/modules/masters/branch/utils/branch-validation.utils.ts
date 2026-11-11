
/**
 * Checks a branch ID.
 * Must be a positive safe integer (PostgreSQL BIGINT column).
 */
export function isValidBranchId(id: number): boolean {
  return Number.isSafeInteger(id) && id > 0;
}
