import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { type ItemCardData } from "../types";

import { api } from "../api";

import { useFilteredItems } from "../hooks/useFilteredItems";
import { useTagFilter } from "../hooks/useTagFilter";

import { Header } from "../components/Header";
import AddCardForm from "../components/AddCardForm";
import ItemList from "../components/ItemList";
import FilterPanel from "../components/FilterPanel";
import { ItemPagination } from "../components/ItemPagination";

const ITEMS_PER_PAGE = 10;

export function Finished() {
  const { data: items = [] } = useQuery<ItemCardData[]>({
    queryKey: ["items"],
    queryFn: () => api.get("/book/all").then((res) => res.data),
  });
  // Тут будет другой запрос

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const goToFirstPage = () => setCurrentPage(1);

  const searchedItems = useFilteredItems(items, searchValue);

  const {
    filteredItems: itemsFilteredByTags,
    selectedTags,
    handleTagsChange,
  } = useTagFilter(searchedItems, goToFirstPage);

  const finalFilteredItems = itemsFilteredByTags.filter((item) => item.isRead);
  // Временное

  const paginatedItems = finalFilteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    goToFirstPage();
  };

  const handleAddItem = (data: {
    title: string;
    creator: string;
    format?: string;
  }) => {
    console.log("Книга для прочитанного:", data);
  };

  return (
    <>
      <Header
        searchValue={searchValue}
        setSearchValue={handleSearchChange}
        searchPlaceholder="Найти прочитанную книгу по названию, автору или тегу"
      />
      <main className="counter__container">
        <AddCardForm onAddCard={handleAddItem} withFormat />

        <FilterPanel
          items={items}
          selectedTags={selectedTags}
          onSelectedTagsChange={handleTagsChange}
        />

        <ItemList items={paginatedItems} onOpenCard={() => {}} />

        <ItemPagination
          totalItems={finalFilteredItems.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </main>
    </>
  );
}
