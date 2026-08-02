import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";

import { type ItemCardData } from "../types";

import { api } from "../api";

import { useFilteredItems } from "../hooks/useFilteredItems";
import { useTagFilter } from "../hooks/useTagFilter";
import { useItemMutations } from "../hooks/useItemMutations";
import { useItemInteraction } from "../hooks/useItemInteraction";
import { useDeleteItem } from "../hooks/useDeleteItem";

import { sortItems, type SortOptions } from "../utils/sorting";

import { Header } from "../components/Header";
import AddCardForm from "../components/AddCardForm";
import ItemList from "../components/ItemList";
import ItemListSorting from "../components/ItemListSorting";
import FilterPanel from "../components/FilterPanel";
import { ItemPagination } from "../components/ItemPagination";
import Popup from "../components/Popup";
import ItemCardDetails from "../components/ItemCardDetailed";
import ConfirmPopup from "../components/ConfirmPopup";

const ITEMS_PER_PAGE = 10;

export function Finished() {
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
  // Тут будет другой запрос

  const { addMutation, editMutation, deleteMutation } = useItemMutations();

  const [searchValue, setSearchValue] = useState("");
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

  const finalFilteredItems = itemsFilteredByTags.filter((item) => item.isRead);

  const sortedItems = sortItems(finalFilteredItems, activeSortOption);

  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    goToFirstPage();
  };

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
      isRead: true,
      impressions: null,
      format,
    });
  };

  const [resetFormTrigger, setResetFormTrigger] = useState(0);

  const handleSortChange = (option: SortOptions) => {
    setActiveSortOption(option);
    goToFirstPage();
  };

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

  const handleEditAction = () => {
    hookEditAction();
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

  return (
    <>
      <Header
        searchValue={searchValue}
        setSearchValue={handleSearchChange}
        searchPlaceholder="Найти прочитанную книгу по названию, автору или тегу"
      />
      <main className="counter__container">
        <AddCardForm
          key={resetFormTrigger}
          onAddCard={handleAddItem}
          withFormat
        />

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
          onClose={() => {
            setHasDuplicate(false);
            setResetFormTrigger((prev) => prev + 1);
          }}
          cancelButtonText="Отменить"
        />
      </main>
    </>
  );
}
