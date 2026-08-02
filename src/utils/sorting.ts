export type SortOptions = "newest" | "oldest" | "az" | "za";

export function sortItems<T extends { title: string }>(
  items: T[],
  activeSortOption: SortOptions,
): T[] {
  const itemsToSort = [...items];

  switch (activeSortOption) {
    case "az":
      return itemsToSort.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    case "za":
      return itemsToSort.sort((a, b) => b.title.localeCompare(a.title, "ru"));
    case "newest":
      return itemsToSort.reverse();
    case "oldest":
    default:
      return itemsToSort;
  }
}
