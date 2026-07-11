import { useState } from "react";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { type ItemCardData } from "../types";
import type { StatusFilter } from "../components/ReadUnreadFilter";

import { api } from "../api";

import { useDeleteItem } from "../hooks/useDeleteItem";
import { useFilteredItems } from "../hooks/useFilteredItems";
import { useItemInteraction } from "../hooks/useItemInteraction";
import { useItemMutations } from "../hooks/useItemMutations";
import { usePagination } from "../hooks/usePagination";
import { useTagFilter } from "../hooks/useTagFilter";

import AddCardForm from "../components/AddCardForm";
import ConfirmPopup from "../components/ConfirmPopup";
import FilterPanel from "../components/FilterPanel";
import { Header } from "../components/Header";
import ItemCardDetails from "../components/ItemCardDetailed";
import { ItemPagination } from "../components/ItemPagination";
import ItemList from "../components/ItemList";
import Popup from "../components/Popup";
import ReadUnreadFilter from "../components/ReadUnreadFilter";

const ITEMS_PER_PAGE = 10;

export function Library() {
  const { data: items = [] } = useQuery<ItemCardData[]>({
    queryKey: ["items"],
    queryFn: () => api.get("/book/all").then((res) => res.data),
  });

  const { addMutation, editMutation, deleteMutation } = useItemMutations();
  // Вызываем хук, внутри которого настройка axios-запросов и обновление списка

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [isCardFormValid, setIsCardFormValid] = useState(true);

  const [hasDuplicate, setHasDuplicate] = useState(false);

  const searchedItems = useFilteredItems(items, searchValue);

  const { goToFirstPage } = usePagination([], ITEMS_PER_PAGE);

  const {
    filteredItems: itemsFilteredByTags,
    selectedTags,
    handleTagsChange,
  } = useTagFilter(searchedItems, goToFirstPage);

  const finalFilteredItems = itemsFilteredByTags.filter((item) => {
    if (statusFilter === "read" && !item.isRead) return false;
    if (statusFilter === "unread" && item.isRead) return false;
    return true;
  });

  const { paginatedItems, currentPage, setCurrentPage } = usePagination(
    finalFilteredItems,
    ITEMS_PER_PAGE,
  );

  const {
    selectedItem,
    isEditing,
    openItem,
    closeItem,
    handleEditAction: hookEditAction,
  } = useItemInteraction(items);

  const { deleteTargetId, openDelete, closeDelete, confirmDelete } =
    useDeleteItem();

  const handleAddItem = ({
    title,
    creator,
  }: {
    title: string;
    creator: string;
  }) => {
    const normalizedTitle = title.trim().toLowerCase();
    const normalizedCreator = creator.trim().toLowerCase();

    const isDuplicate = items.some(
      (item) =>
        item.title.trim().toLowerCase() === normalizedTitle &&
        item.creator.trim().toLowerCase() === normalizedCreator,
    );

    if (isDuplicate) {
      setHasDuplicate(true);
      return;
    }

    setHasDuplicate(null);
    addMutation.mutate({
      id: crypto.randomUUID(),
      title,
      creator,
      tags: null,
      isRead: false,
      impressions: null,
    });
  };

  const handleSubmitItem = (data: ItemCardData) => {
    const normalizedTags = (data.tags ?? []).flatMap((tag) =>
      tag
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean),
    );

    editMutation.mutate({ ...data, tags: normalizedTags });
    // data - объект, который пришел из формы, с id, title, creator и старыми tags
    // ...data разбирает объект и достает все его свойства
    // tags: normalizedTags создает свойство tags с новым значением
    closeItem();
  };

  const handleConfirmDelete = () => {
    const idToDelete = confirmDelete();
    if (idToDelete) {
      deleteMutation.mutate(idToDelete);
      closeItem();
    }
  };

  const handleEditAction = () => {
    if (isEditing && !isCardFormValid) return;
    hookEditAction();
  };

  return (
    <>
      <Header
        searchValue={searchValue}
        setSearchValue={(val) => {
          setSearchValue(val);
          goToFirstPage();
        }}
        searchPlaceholder="Найти книгу по названию, автору или тегу"
      />

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
            onSelectedTagsChange={handleTagsChange}
          />

          <ReadUnreadFilter
            statusFilter={statusFilter}
            onStatusFilterChange={(status) => {
              setStatusFilter(status);
              goToFirstPage();
            }}
          />
        </Box>

        <ItemList items={paginatedItems} onOpenCard={openItem} />

        <ItemPagination
          totalItems={finalFilteredItems.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />

        <Popup
          open={Boolean(selectedItem)}
          onClose={closeItem}
          onEdit={handleEditAction}
          onDelete={() => {
            if (!selectedItem) return;
            openDelete(selectedItem.id);
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

        <ConfirmPopup
          open={Boolean(deleteTargetId)}
          message="Это действие нельзя отменить."
          onClose={closeDelete}
          onConfirm={handleConfirmDelete}
          confirmButtonText="Удалить"
          cancelButtonText="Отмена"
        />

        <ConfirmPopup
          open={hasDuplicate}
          message="Эта книга уже есть в вашей библиотеке."
          onClose={() => setHasDuplicate(false)}
          cancelButtonText="Отменить"
        />
      </main>
    </>
  );
}
