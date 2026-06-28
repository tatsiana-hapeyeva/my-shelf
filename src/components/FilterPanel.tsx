import { useState, useMemo } from "react";
import { type ItemCardData } from "../types";

import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

type FilterPanelProps = {
  items: ItemCardData[];
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
};

export default function FilterPanel({
  items,
  selectedTags,
  onSelectedTagsChange,
}: FilterPanelProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>(); // Хранит только уникальные данные
    items.forEach((item) => item.tags?.forEach((tag) => tagsSet.add(tag))); // Перебираем все книги, внутри каждой перебираем теги и добавляем в Set
    return Array.from(tagsSet).sort((a, b) => a.localeCompare(b, "ru")); // Сортировка с учетом русского алфавита
  }, [items]);

  const toggleTag = (clickedTag: string) => {
    const isTagSelected = selectedTags.includes(clickedTag);

    if (isTagSelected) {
      return selectedTags.filter((currentTag) => currentTag !== clickedTag);
    }

    return [...selectedTags, clickedTag];
  }; // Переключение выбранных/невыбранных тегов

  const handleClickTag = (tag: string) => {
    const updatedTags = toggleTag(tag);
    onSelectedTagsChange(updatedTags);
  }; // Теги отдаются наверх

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ color: "var(--color-text)" }}
      >
        <FilterListIcon />
      </IconButton>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableAutoFocus
        disableEnforceFocus
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-extra)",
              borderRadius: "8px",
            },
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            color: "var(--color-text)",
            fontFamily: "var(--sans)",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>Теги</Typography>

          <Box>
            {allTags.length === 0 ? (
              <Typography>Нет добавленных тегов</Typography>
            ) : (
              allTags.map((tag) => (
                <Box
                  key={tag}
                  component="label"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleClickTag(tag)}
                    sx={{
                      padding: 0,
                      color: "var(--color-extra)",
                      "&.Mui-checked": {
                        color: "var(--color-accent)",
                      },
                    }}
                  />
                  <Typography>{tag}</Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Popover>
    </>
  );
}
