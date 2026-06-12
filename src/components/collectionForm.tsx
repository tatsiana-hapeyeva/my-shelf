import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "./button";

type CollectionFormValues = {
  title: string;
  creator: string;
};

type CollectionFormProps = {
  onAddCollection: (collection: { title: string; creator: string }) => void;
};

const MOBILE_WIDTH = "900px";

const removeQuotes = (value: string) => {
  return value.replace(/["'«»„“”‘’]/g, "");
};

export default function CollectionForm({
  onAddCollection,
}: CollectionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<CollectionFormValues>({
    defaultValues: {
      title: "",
      creator: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: CollectionFormValues) => {
    const cleanCreator = data.creator.trim();
    const cleanTitle = removeQuotes(data.title).trim();

    if (!cleanCreator || !cleanTitle) return;

    onAddCollection({
      creator: cleanCreator,
      title: cleanTitle,
    });

    reset();
  };

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

    [`@media (max-width:${MOBILE_WIDTH})`]: {
      flex: "none",
      width: "100%",
    },
  };

  return (
    <Box
      component="form"
      className="collection-form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        marginBottom: "24px",
        [`@media (max-width:${MOBILE_WIDTH})`]: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        },
      }}
    >
      <TextField
        fullWidth
        {...register("creator", {
          required: "Автор обязателен",

          maxLength: {
            value: 100,
            message: "Максимум 100 символов",
          },
          validate: (value) =>
            value.trim() !== "" || "Поле не должно быть пустым",
        })}
        slotProps={{
          htmlInput: {
            "aria-label": "Автор",
          },
        }}
        size="small"
        placeholder="Введите автора"
        sx={fieldStyles}
        error={!!errors.creator}
        helperText={errors.creator?.message}
      />

      <TextField
        fullWidth
        {...register("title", {
          required: "Название обязательно",
          maxLength: {
            value: 100,
            message: "Максимум 100 символов",
          },
          validate: (value) =>
            removeQuotes(value).trim() !== "" || "Поле не должно быть пустым",
        })}
        slotProps={{
          htmlInput: {
            "aria-label": "Название",
          },
        }}
        size="small"
        placeholder="Введите название"
        sx={fieldStyles}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <Button type="submit" disabled={!isDirty || !isValid}>
        Добавить книгу
      </Button>
    </Box>
  );
}
