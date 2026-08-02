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
import { useTagFilter } from "../hooks/useTagFilter";
import { sortItems, type SortOptions } from "../utils/sorting";

import AddCardForm from "../components/AddCardForm";
import ConfirmPopup from "../components/ConfirmPopup";
import FilterPanel from "../components/FilterPanel";
import { Header } from "../components/Header";
import ItemCardDetails from "../components/ItemCardDetailed";
import { ItemPagination } from "../components/ItemPagination";
import ItemList from "../components/ItemList";
import ItemListSorting from "../components/ItemListSorting";
import Popup from "../components/Popup";
import ReadUnreadFilter from "../components/ReadUnreadFilter";

const ITEMS_PER_PAGE = 10;

export function Library() {
  const { data: items = [] } = useQuery<ItemCardData[]>({
    queryKey: ["items"],
    queryFn: () =>
      api.get("/book/all").then((res) =>
        res.data.map(
          (item: Omit<ItemCardData, "tags"> & { tags: string | null }) => ({
            ...item,
            tags: item.tags
              ? item.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              : null,
          }),
        ),
      ),
  });

  console.log("items[0]", items[0]);

  const { addMutation, editMutation, deleteMutation } = useItemMutations();
  // Вызываем хук, внутри которого настройка axios-запросов и обновление списка

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [activeSortOption, setActiveSortOption] =
    useState<SortOptions>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [hasDuplicate, setHasDuplicate] = useState(false);

  const goToFirstPage = () => setCurrentPage(1);

  const searchedItems = useFilteredItems(items, searchValue);

  const {
    filteredItems: itemsFilteredByTags,
    selectedTags,
    handleTagsChange,
  } = useTagFilter(searchedItems, goToFirstPage);

  const finalFilteredItems = itemsFilteredByTags.filter((item) => {
    const isLibraryFormat =
      item.format === undefined ||
      item.format === null ||
      item.format === "" ||
      item.format === "physical";

    if (!isLibraryFormat) return false;

    if (statusFilter === "read" && !item.isRead) return false;
    if (statusFilter === "unread" && item.isRead) return false;

    return true;
  });

  // 1. Сортируем массив перед тем, как отдать его в пагинацию
  const sortedItems = sortItems(finalFilteredItems, activeSortOption);

  // 2. Нарезаем отсортированный массив для пагинации
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const {
    selectedItem,
    isEditing,
    openItem,
    closeItem,
    handleEditAction: hookEditAction,
    formRef,
  } = useItemInteraction(items);

  const { deleteTargetId, openDelete, closeDelete, confirmDelete } =
    useDeleteItem();

  const handleAddItem = ({
    title,
    creator,
    format,
  }: {
    title: string;
    creator: string;
    format?: string;
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

    setHasDuplicate(false);
    addMutation.mutate({
      id: crypto.randomUUID(),
      title,
      creator,
      tags: null,
      isRead: false,
      impressions: null,
      format,
    });
  };

  const handleSubmitItem = (data: ItemCardData) => {
    const normalizedTags = data.tags?.length
      ? data.tags.flatMap((tag) =>
          tag
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean),
        )
      : null;

    editMutation.mutate({ ...data, tags: normalizedTags });
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
    hookEditAction();
  };

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    goToFirstPage();
  };

  const handleStatusFilterChange = (status: StatusFilter) => {
    setStatusFilter(status);
    goToFirstPage();
  };

  const handleSortChange = (option: SortOptions) => {
    setActiveSortOption(option);
    goToFirstPage();
  };

  return (
    <>
      <Header
        searchValue={searchValue}
        setSearchValue={handleSearchChange}
        searchPlaceholder="Найти книгу по названию, автору или тегу"
      />

      <main className="counter__container">
        <AddCardForm onAddCard={handleAddItem} />

        <Box
          sx={{
            display: "flex",
            gap: "16px",
            marginBottom: "24px",
            alignItems: "flex-start",
          }}
        >
          <FilterPanel
            items={items}
            selectedTags={selectedTags}
            onSelectedTagsChange={handleTagsChange}
          />

          <ReadUnreadFilter
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />

          <ItemListSorting
            value={activeSortOption}
            onChange={handleSortChange}
          />
        </Box>

        <ItemList items={paginatedItems} onOpenCard={openItem} />

        <ItemPagination
          totalItems={sortedItems.length}
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
              formRef={formRef}
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
