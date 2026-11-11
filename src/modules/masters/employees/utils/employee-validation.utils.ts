export const isValidEmployeeId = (id: string): boolean => {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
};