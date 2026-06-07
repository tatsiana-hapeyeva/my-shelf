import Box from "@mui/material/Box";
import CollectionCard, { type CollectionCardData } from "./collectionCard";

type CollectionListProps = {
  items: CollectionCardData[];
  onOpenCard: (itemId: string) => void;
};

export default function CollectionList({
  items,
  onOpenCard,
}: CollectionListProps) {
  if (items.length === 0) {
    return <Box>Здесь пока пусто. Добавь первый элемент коллекции.</Box>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {items.map((item) => (
        <CollectionCard key={item.id} item={item} onOpenCard={onOpenCard} />
      ))}
    </Box>
  );
}
