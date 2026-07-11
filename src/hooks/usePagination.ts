import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // useMemo нужен, чтобы не делать нарезку массива при каждом лишнем клике или вводе буквы
  const paginatedItems = useMemo(() => {
    return items.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [items, currentPage, itemsPerPage]);

  // Удобная функция, которую будем вызывать при смене фильтров
  const goToFirstPage = () => setCurrentPage(1);

  return {
    paginatedItems, // То, что отдаем в <ItemList>
    totalPages, // То, что отдаем в <ItemPagination>
    currentPage,
    setCurrentPage,
    goToFirstPage,
  };
}
