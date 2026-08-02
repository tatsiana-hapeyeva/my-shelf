import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { SortOptions } from "../utils/sorting";

type ItemListSortingProps = {
  value: SortOptions;
  onChange: (option: SortOptions) => void;
};

export default function ItemListSorting({
  value,
  onChange,
}: ItemListSortingProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOptions)}
      size="small"
      sx={{
        height: 40,
        color: "var(--color-text)",
        backgroundColor: "transparent",

        border: "1px solid var(--color-extra)",
        ".MuiSelect-icon": {
          color: "var(--color-extra)",
        },
      }}
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
        slotProps: {
          paper: {
            sx: {
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-extra)",
              borderRadius: "8px",
              mt: 1,
            },
          },
        },
        sx: {
          "li.MuiMenuItem-root": {
            color: "var(--color-text)",
            "&:hover": {
              backgroundColor:
                "color-mix(in srgb, var(--color-bg) 92%, white 8%)",
            },
            "&.Mui-selected": {
              backgroundColor: "var(--color-accent)",
            },
            "&.Mui-selected:hover": {
              backgroundColor:
                "color-mix(in srgb, var(--color-accent) 90%, white 10%)",
            },
          },
        },
      }}
    >
      <MenuItem value="newest">Сначала новые</MenuItem>
      <MenuItem value="oldest">Сначала старые</MenuItem>
      <MenuItem value="az">А-Я</MenuItem>
      <MenuItem value="za">Я-А</MenuItem>
    </Select>
  );
}
