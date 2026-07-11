import axios from "axios";
import type { ItemCardData, BookResponse } from "./types";

export const api = axios.create({
  baseURL: "/api/v1",
});

export const formatBook = (book: BookResponse): ItemCardData => {
  return {
    id: book.id || "",
    title: book.title,
    creator: book.creator,
    tags: book.tags ? book.tags.split(",").map((tag) => tag.trim()) : [],
    isRead: book.isRead,
    impressions: book.impressions || "",
  };
};
