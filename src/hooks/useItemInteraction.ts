import { useState } from "react";
import type { ItemCardData } from "../types";

export function useItemInteraction(items: ItemCardData[]) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;
  //Находим в массиве книг ту, чей ID совпал с selectedItemId, и отдаём информацию о ней

  const openItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsEditing(false);
  };

  const closeItem = () => {
    setSelectedItemId(null);
    setIsEditing(false);
  };

  const handleEditAction = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const form = document.getElementById(
      "collection-card-form",
    ) as HTMLFormElement | null;

    form?.requestSubmit();
  };
  // Сохранение книги, вызывается отправка формы

  return {
    selectedItem,
    isEditing,
    openItem,
    closeItem,
    handleEditAction,
  };
}
