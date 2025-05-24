import { ParsedUrlQuery } from "querystring";

/**
 * Extracts string values from a query object. If a value is an array, it returns the first element.
 *
 * @param query - The query object from `context.query`.
 * @returns An object with string values only.
 */
export const parseQueryToStrings = (
  query: ParsedUrlQuery
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const key in query) {
    const value = query[key];
    result[key] = (Array.isArray(value) ? value[0] : value) ?? "";
  }

  return result;
};
