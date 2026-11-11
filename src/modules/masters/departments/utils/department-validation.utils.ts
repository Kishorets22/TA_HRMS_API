
/**
 * Checks a department ID.
 * Must be a positive safe integer (PostgreSQL BIGINT column).
 */
export function isValidDepartmentId(id: number): boolean {
  return Number.isSafeInteger(id) && id > 0;
}
