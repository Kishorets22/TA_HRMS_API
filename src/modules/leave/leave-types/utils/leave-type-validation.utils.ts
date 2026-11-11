export const isValidLeaveTypeId = (id: number): boolean =>
  Number.isInteger(id) && id > 0;

export const isValidLeaveTypeUnit = (unit: string): boolean =>
  ['DAYS', 'HOURS'].includes(unit);

// An empty value (not sent) is valid; 0 is a real value and is checked.
export const isValidCarryForwardDays = (value?: number | string): boolean => {
  if (!value && value !== 0) {
    return true;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return false;
  }

  if (numericValue < 0 || numericValue > 9999.99) {
    return false;
  }

  return Number.isInteger(Math.round(numericValue * 100 * 1e6) / 1e6);
};

export const isEmptyLeaveTypeUpdate = (data: object): boolean =>
  Object.values(data).every((value) => value === undefined);

// An empty value returns nothing, so the column stays unset.
export const formatCarryForwardDays = (value?: number | string): string | undefined => {
  if (!value && value !== 0) {
    return;
  }

  return Number(value).toFixed(2);
};