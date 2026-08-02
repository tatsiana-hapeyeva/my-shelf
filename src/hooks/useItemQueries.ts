import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import type { ItemCardData } from "../types";

export function useBookById(id: string | undefined) {
  return useQuery<ItemCardData>({
    queryKey: ["book", id],
    queryFn: () => api.get(`/book/${id}`).then((res) => res.data),
    enabled: !!id,
  });
}

export function useSoftSearch(searchString: string) {
  return useQuery<ItemCardData[]>({
    queryKey: ["items", "softFilter", searchString],
    queryFn: () =>
      api
        .get(`/book/filter`, { params: { request: searchString } })
        .then((res) => res.data),
    enabled: !!searchString,
  });
}
