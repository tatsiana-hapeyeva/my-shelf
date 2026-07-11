import { useState } from "react";
import type { ItemCardData } from "../types";

export function useTagFilter(items: ItemCardData[], goToFirstPage: () => void) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredItems = items.filter((item) => {
    if (selectedTags.length === 0) return true;
    if (!item.tags || item.tags.length === 0) return false;
    const hasMatch = item.tags.some((tag) => selectedTags.includes(tag));
    return hasMatch;
  });

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    goToFirstPage();
  };

  return {
    filteredItems,
    selectedTags,
    handleTagsChange,
  };
}
