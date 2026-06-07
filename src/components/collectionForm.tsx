import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "./button";

type CollectionFormProps = {
  onAddCollection: (collection: { title: string; creator: string }) => void;
};

const removeQuotes = (value: string) => {
  return value.replace(/["'«»„“”‘’]/g, "");
};

export default function CollectionForm({
  onAddCollection,
}: CollectionFormProps) {
  const [creator, setCreator] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanCreator = creator.trim();
    const cleanTitle = removeQuotes(title).trim();

    if (!cleanCreator || !cleanTitle) return;

    onAddCollection({
      creator: cleanCreator,
      title: cleanTitle,
    });

    setCreator("");
    setTitle("");
  };

  const isDisabled = !creator.trim() || !title.trim();

  const fieldStyles = {
    flex: 1,
    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--color-bg)",
      color: "var(--color-text)",
    },
    "& .MuiInputBase-input": {
      color: "var(--color-text)",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "var(--color-text)",
      opacity: 0.6,
    },
  };

  return (
    <form
      className="collection-form"
      onSubmit={handleSubmit}
      style={{ marginBottom: "24px" }}
    >
      <TextField
        value={creator}
        onChange={(e) => setCreator(e.target.value)}
        size="small"
        placeholder="Введите автора"
        sx={fieldStyles}
      />

      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        size="small"
        placeholder="Введите название"
        sx={fieldStyles}
      />

      <Button type="submit" disabled={isDisabled}>
        Добавить книгу
      </Button>
    </form>
  );
}
