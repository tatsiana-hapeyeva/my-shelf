export type ItemCardData = {
  id: string;
  title: string;
  creator: string;
  tags?: string[];
  isRead?: boolean;
  impressions?: string;
};

export type ItemFilters = {
  selectedTags: string[];
};

export const INITIAL_FILTERS: ItemFilters = {
  selectedTags: [],
};
