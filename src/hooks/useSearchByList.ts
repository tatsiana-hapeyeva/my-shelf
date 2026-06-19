import type { ItemCardData } from "../components/ItemCardDetailed";

export const useSearchByList = (items: ItemCardData[], searchValue: string) => {
  const normalized = searchValue.trim().toLowerCase();

  if (!normalized) return items;

  return items.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(normalized);
    const matchesCreator = item.creator.toLowerCase().includes(normalized);
    const matchesTags =
      item.tags?.some((tag) => tag.toLowerCase().includes(normalized)) ?? false;

    return matchesTitle || matchesCreator || matchesTags;
  });
};
