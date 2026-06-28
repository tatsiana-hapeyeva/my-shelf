import Box from "@mui/material/Box";
import ItemCard from "./ItemCard";
import { type ItemCardData } from "../types";

type ItemListProps = {
  items: ItemCardData[];
  onOpenCard: (itemId: string) => void;
};

export default function ItemList({ items, onOpenCard }: ItemListProps) {
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
          <ItemCard item={item} onOpenCard={onOpenCard} />
        </Box>
      ))}
    </Box>
  );
}
