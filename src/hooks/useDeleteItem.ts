import { useState } from "react";

export function useDeleteItem() {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const openDelete = (itemId: string) => {
    setDeleteTargetId(itemId);
  };

  const closeDelete = () => {
    setDeleteTargetId(null);
  };

  // Функция возвращает ID для удаления и сразу закрывает попап
  const confirmDelete = () => {
    const idToDelete = deleteTargetId;
    setDeleteTargetId(null);
    return idToDelete;
  };

  return {
    deleteTargetId,
    openDelete,
    closeDelete,
    confirmDelete,
  };
}
