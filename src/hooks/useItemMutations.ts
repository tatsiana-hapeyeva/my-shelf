import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosResponse } from "axios";
import { api } from "../api";
import type { ItemCardData, BookResponse } from "../types";

export function useItemMutations() {
  const queryClient = useQueryClient();

  const addMutation = useMutation<
    AxiosResponse<BookResponse>,
    Error,
    ItemCardData
  >({
    mutationFn: (newItem) => api.post("/book", newItem),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });

  const editMutation = useMutation<
    AxiosResponse<BookResponse>,
    Error,
    ItemCardData
  >({
    // Конвертируем массив в строку прямо перед отправкой
    mutationFn: (updatedItem) => {
      const payload = {
        ...updatedItem,
        tags: Array.isArray(updatedItem.tags)
          ? updatedItem.tags.join(", ")
          : updatedItem.tags,
      };
      return api.patch(`/book`, payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/book/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });

  return {
    addMutation,
    editMutation,
    deleteMutation,
  };
}
