import { useState, useRef } from "react";
import type { ItemCardData } from "../types";

export function useItemInteraction(items: ItemCardData[]) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

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

    formRef.current?.requestSubmit();
  };

  return {
    selectedItem,
    isEditing,
    openItem,
    closeItem,
    handleEditAction,
    formRef,
  };
}
