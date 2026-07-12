export type ItemCardData = {
  id: string;
  title: string;
  creator: string;
  tags?: string[] | null;
  isRead?: boolean;
  impressions?: string | null;
  format?: string;
};

export type ItemFilters = {
  selectedTags: string[];
};

export const INITIAL_FILTERS: ItemFilters = {
  selectedTags: [],
};

export type BookResponse = {
  id: string | null;
  title: string;
  creator: string;
  tags: string | null;
  isRead: boolean;
  impressions: string | null;
};
