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
      component="ul"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {items.map((item) => (
        <Box component="li" key={item.id}>
          <CollectionCard item={item} onOpenCard={onOpenCard} />
        </Box>
      ))}
    </Box>
  );
}
