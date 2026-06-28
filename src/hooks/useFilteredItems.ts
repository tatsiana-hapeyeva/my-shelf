import { useMemo } from "react";
import Fuse from "fuse.js";
import type { ItemCardData } from "../types";

export function useFilteredItems(items: ItemCardData[], searchValue: string) {
  const itemSearcher = useMemo(() => {
    return new Fuse(items, {
      keys: ["title", "creator", "tags"],
    });
  }, [items]);

  return useMemo(() => {
    if (searchValue.trim() === "") return items;

    return itemSearcher.search(searchValue).map((res) => res.item);
    // Поиск книги по тексту запроса.
    // Библиотека добавляет свой внутренний рейтинг совпадения,
    // поэтому .map вынимает оттуда только сами найденные книги, отбрасывая лишнее.
  }, [items, searchValue, itemSearcher]);
}
