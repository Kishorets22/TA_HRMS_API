
/**
 * Checks a holiday date.
 * Expected format: YYYY-MM-DD and a real calendar date.
 */
export function isValidHolidayDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

/**
 * Checks a holiday ID.
 * Must be a positive safe integer (PostgreSQL BIGINT column).
 */
export function isValidHolidayId(id: number): boolean {
  return Number.isSafeInteger(id) && id > 0;
}
