export type MaybeArray<T> = T | T[] | null | undefined;

export function firstOf<T>(value: MaybeArray<T>): T | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}
