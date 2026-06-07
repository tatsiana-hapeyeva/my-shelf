import { useState } from "react";
import { Header } from "../components/header";
import CollectionForm from "../components/collectionForm";
import CollectionList from "../components/collectionList";
import CollectionPopup from "../components/collectionPopup";
import CollectionCardDetails, {
  type CollectionCardData,
} from "../components/collectionCardDetails";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ConfirmDeletePopup from "../components/confirmDeletePopup";

export function Library() {
  const [items, setItems] = useLocalStorage<CollectionCardData[]>("items", []);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  const handleAddItem = ({
    title,
    creator,
  }: {
    title: string;
    creator: string;
  }) => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        creator,
        tags: [],
        isRead: false,
        impressions: "",
      },
    ]);
  };

  const handleOpenItemPopup = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsEditing(false);
  };

  const handleCloseItemPopup = () => {
    setSelectedItemId(null);
    setIsEditing(false);
  };

  const handleSubmitItem = (data: CollectionCardData) => {
    const normalizedTags = (data.tags ?? []).flatMap((tag) =>
      tag
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean),
    );

    setItems((prev) =>
      prev.map((item) =>
        item.id === data.id ? { ...data, tags: normalizedTags } : item,
      ),
    );

    setIsEditing(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    handleCloseItemPopup();
  };

  const handleOpenDeletePopup = (itemId: string) => {
    setDeleteTargetId(itemId);
  };

  const handleCloseDeletePopup = () => {
    setDeleteTargetId(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;

    handleDeleteItem(deleteTargetId);
    setDeleteTargetId(null);
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

  return (
    <>
      <Header />
      <div className="counter__container">
        <CollectionForm onAddCollection={handleAddItem} />

        <CollectionList items={items} onOpenCard={handleOpenItemPopup} />

        <CollectionPopup
          open={Boolean(selectedItem)}
          onClose={handleCloseItemPopup}
          onEdit={handleEditAction}
          onDelete={() => {
            if (!selectedItem) return;
            handleOpenDeletePopup(selectedItem.id);
          }}
          editButtonText={isEditing ? "Сохранить" : "Редактировать"}
        >
          {selectedItem && (
            <CollectionCardDetails
              item={selectedItem}
              isEditing={isEditing}
              onSubmit={handleSubmitItem}
            />
          )}
        </CollectionPopup>

        <ConfirmDeletePopup
          open={Boolean(deleteTargetId)}
          onClose={handleCloseDeletePopup}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
}
