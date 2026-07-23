export const MAX_ROWS = 50;

export function applyPagination(query: string, limit?: number): string {
  const safeLimit = limit !== undefined ? Math.min(limit, MAX_ROWS) : MAX_ROWS;
  return `SELECT * FROM (${query}) AS _paginated LIMIT ${safeLimit}`;
}

export function getEffectiveLimit(requestedLimit?: number): number {
  if (requestedLimit === undefined || requestedLimit === null) return MAX_ROWS;
  return Math.min(requestedLimit, MAX_ROWS);
}
