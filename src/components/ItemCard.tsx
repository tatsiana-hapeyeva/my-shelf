import type { ItemCardData } from "../types";

import Box from "@mui/material/Box";

type ItemCardProps = {
  item: ItemCardData;
  onOpenCard?: (itemId: string) => void;
};

export default function ItemCard({ item, onOpenCard }: ItemCardProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onOpenCard?.(item.id)}
      sx={{
        display: "block",
        width: "100%",
        p: 2,
        border: "1px solid var(--color-extra)",
        borderRadius: "8px",
        background: "none",
        textAlign: "left",
        cursor: "pointer",
        whiteSpace: "normal",
        overflowWrap: "anywhere",
        wordBreak: "break-all",
        transition: "background-color 0.2s, border-color 0.2s",
        "&:hover": {
          borderColor: "var(--color-text)",
          backgroundColor: "color-mix(in srgb, var(--color-bg) 92%, white 8%)",
        },
        "&:focus-visible": {
          outline: "2px solid var(--color-text)",
          outlineOffset: "2px",
        },
      }}
    >
      <Box
        component="span"
        sx={{
          display: "block",
          fontSize: "24px",
          lineHeight: 1.2,
          color: "var(--color-text)",
        }}
      >
        {item.title}
      </Box>

      <Box
        component="span"
        sx={{
          display: "block",
          mt: 1,
          color: "var(--color-extra)",
        }}
      >
        {item.creator}
      </Box>
    </Box>
  );
}
