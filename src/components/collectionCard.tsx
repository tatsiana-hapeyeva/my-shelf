import Box from "@mui/material/Box";

export type CollectionCardData = {
  id: string;
  title: string;
  creator: string;
};

type CollectionCardProps = {
  item: CollectionCardData;
  onOpenCard: (itemId: string) => void;
};

export default function CollectionCard({
  item,
  onOpenCard,
}: CollectionCardProps) {
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
