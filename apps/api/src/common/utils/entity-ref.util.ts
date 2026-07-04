const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuidRef(value: string): boolean {
  return UUID_REGEX.test(value);
}

/** Prisma where clause — avoids casting slugs against UUID columns. */
export function slugOrUuidWhere(
  ref: string,
): { id: string } | { slug: string } {
  return isUuidRef(ref) ? { id: ref } : { slug: ref };
}
