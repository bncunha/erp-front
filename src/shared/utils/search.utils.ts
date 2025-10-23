export function applySearchFilter<T>(
  items: T[],
  text: string,
  valueExtractor?: (item: T) => unknown[]
): T[] {
  const normalized = text?.trim().toLowerCase();

  if (!normalized) {
    return items;
  }

  const words = normalized.split(/\s+/).filter(Boolean);

  if (!words.length) {
    return items;
  }

  return items.filter((item) => {
    const rawValues = valueExtractor ? valueExtractor(item) : Object.values(item as Record<string, unknown>);
    const comparableValues = rawValues
      .map((value) => (value ?? '').toString().toLowerCase());

    return words.every((word) =>
      comparableValues.some((value) => value.includes(word))
    );
  });
}
