import Box from "@mui/material/Box";

export type ItemCardData = {
  id: string;
  title: string;
  creator: string;
};

type ItemCardProps = {
  item: ItemCardData;
  onOpenCard: (itemId: string) => void;
};

export default function ItemCard({ item, onOpenCard }: ItemCardProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onOpenCard(item.id)}
      sx={{
        display: "block",
        width: "100%",
        p: 2,
        border: "1px solid var(--color-extra)",
        borderRadius: "8px",
        background: "none",
        textAlign: "left",
        whiteSpace: "normal",
        overflowWrap: "anywhere",
        wordBreak: "break-all",
      }}
    >
      <Box
        component="span"
        sx={{
          display: "block",
          fontSize: "24px",
          lineHeight: 1.2,
          color: "var(--color-text)",
          whiteSpace: "normal",
          overflowWrap: "anywhere",
          wordBreak: "break-all",
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
          whiteSpace: "normal",
          overflowWrap: "anywhere",
          wordBreak: "break-all",
        }}
      >
        {item.creator}
      </Box>
    </Box>
  );
}
