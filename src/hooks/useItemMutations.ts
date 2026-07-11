import { useMutation, useQueryClient } from "@tanstack/react-query";
// useMutation отправляет данные на сервер
// useQueryClient управляет всей базой данных/кешем в приложении
import { type AxiosResponse } from "axios";
import { api } from "../api";
import type { ItemCardData } from "../types";

export function useItemMutations() {
  // Тут нет аргументов, потому что хук умеет находить queryClient внутри React

  const queryClient = useQueryClient();
  // Получаем доступ к хуку
  // Через него даём команду на обновление списка после успешных действий

  const addMutation = useMutation<
    AxiosResponse<ItemCardData>, // Что вернет сервер (обернутый ответ axios с книгой).
    Error,
    ItemCardData // Какого типа данные мы передаем внутрь функции
  >({
    mutationFn: (newItem) => api.post("/book/add", newItem), // Делаем запрос
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
    // Если запрос mutationFn успешен, иди в диспетчер queryClient и скажи,
    // что данные с ключом ["items"] устарели (invalidateQueries)"
    // React сделает GET-запрос в useQuery, список обновится
  });

  const editMutation = useMutation<
    AxiosResponse<ItemCardData>,
    Error,
    ItemCardData
  >({
    mutationFn: (updatedItem) =>
      api.put(`/book/${updatedItem.id}`, updatedItem),
    //  Берем измененную книгу updatedItem, берем её ID и отправляем PUT-запрос
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
    // Если сервер сохранил изменения, заставляем список на экране обновиться
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
