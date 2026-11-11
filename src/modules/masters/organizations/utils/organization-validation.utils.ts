
/**
 * Checks an organization ID.
 * Must be a positive safe integer (PostgreSQL BIGINT column).
 */
export function isValidOrganizationId(id: number): boolean {
  return Number.isSafeInteger(id) && id > 0;
}
