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
      onClick={() => onOpenCard(item.id)}
      sx={{
        p: 2,
        border: "1px solid var(--color-extra)",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      <Box
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
