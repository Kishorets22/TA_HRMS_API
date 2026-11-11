
/**
 * Checks an employment type ID.
 * Must be a positive safe integer (PostgreSQL BIGINT column).
 */
export function isValidEmploymentTypeId(id: number): boolean {
  return Number.isSafeInteger(id) && id > 0;
}
