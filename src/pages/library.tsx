import { useState } from "react";
import { Header } from "../components/Header";
import AddCardForm from "../components/AddCardForm ";
import ItemList from "../components/ItemList";
import Popup from "../components/Popup";
import ItemCardDetails from "../components/ItemCardDetailed";
import { type ItemCardData } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ConfirmDeletePopup from "../components/DeleteConfirmationPopup";
import { useFilteredItems } from "../hooks/useFilteredItems";
import ReadUnreadFilter from "../components/ReadUnreadFilter";
import type { StatusFilter } from "../components/ReadUnreadFilter";
import FilterPanel from "../components/FilterPanel";
import { Box } from "@mui/material";

export function Library() {
  const [items, setItems] = useLocalStorage<ItemCardData[]>("items", []);

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [isCardFormValid, setIsCardFormValid] = useState(true);

  const searchedItems = useFilteredItems(items, searchValue);

  const finalFilteredItems = searchedItems.filter((item) => {
    if (statusFilter === "read" && !item.isRead) return false;
    if (statusFilter === "unread" && item.isRead) return false;
    if (selectedTags.length > 0) {
      if (!item.tags || item.tags.length === 0) return false;
      const hasMatch = item.tags.some((tag) => selectedTags.includes(tag));
      if (!hasMatch) return false;
    }
    return true;
  });

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

  const handleOpenItemPopup = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsEditing(false);
  };

  const handleCloseItemPopup = () => {
    setSelectedItemId(null);
    setIsEditing(false);
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

    if (!isCardFormValid) return;

    const form = document.getElementById(
      "collection-card-form",
    ) as HTMLFormElement | null;

    form?.requestSubmit();
  };

  return (
    <>
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />

      <main className="counter__container">
        <AddCardForm onAddCard={handleAddItem} />

        <Box
          sx={{
            display: "flex",
            gap: "16px",
            marginBottom: "24px",
            alignItems: "center",
          }}
        >
          <FilterPanel
            items={items}
            selectedTags={selectedTags}
            onSelectedTagsChange={setSelectedTags}
          />

          <ReadUnreadFilter
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </Box>

        <ItemList items={finalFilteredItems} onOpenCard={handleOpenItemPopup} />

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
