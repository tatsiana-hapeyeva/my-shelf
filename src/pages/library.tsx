import { useState } from "react";
import { Header } from "../components/Header";
import AddCardForm from "../components/AddCardForm ";
import ItemList from "../components/ItemList";
import Popup from "../components/Popup";
import ItemCardDetails, {
  type ItemCardData,
} from "../components/ItemCardDetailed";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ConfirmDeletePopup from "../components/DeleteConfirmationPopup";
import { useSearchByList } from "../hooks/useSearchByList";

export function Library() {
  const [items, setItems] = useLocalStorage<ItemCardData[]>("items", []);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;
  const filteredItems = useSearchByList(items, searchValue);

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

  const handleSubmitItem = (data: ItemCardData) => {
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

    if (!isCardFormValid) {
      return;
    }

    const form = document.getElementById(
      "collection-card-form",
    ) as HTMLFormElement | null;

    form?.requestSubmit();
  };

  const [isCardFormValid, setIsCardFormValid] = useState(true);

  return (
    <>
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <main className="counter__container">
        <AddCardForm onAddCard={handleAddItem} />
        <ItemList items={filteredItems} onOpenCard={handleOpenItemPopup} />
        <Popup
          open={Boolean(selectedItem)}
          onClose={handleCloseItemPopup}
          onEdit={handleEditAction}
          onDelete={() => {
            if (!selectedItem) return;
            handleOpenDeletePopup(selectedItem.id);
          }}
          editButtonText={isEditing ? "Сохранить" : "Редактировать"}
          ariaLabel={isEditing ? "Редактирование книги" : "Просмотр книги"}
        >
          {selectedItem && (
            <ItemCardDetails
              item={selectedItem}
              isEditing={isEditing}
              onSubmit={handleSubmitItem}
              onValidityChange={setIsCardFormValid}
            />
          )}
        </Popup>
        <ConfirmDeletePopup
          open={Boolean(deleteTargetId)}
          onClose={handleCloseDeletePopup}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </>
  );
}
