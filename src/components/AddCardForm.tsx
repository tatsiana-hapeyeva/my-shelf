import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "./Button";

type AddCardFormData = {
  title: string;
  creator: string;
  format?: string;
};

type AddCardFormProps = {
  onAddCard: (card: AddCardFormData) => void;
  withFormat?: boolean;
};

const MOBILE_WIDTH = "900px";

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

const removeQuotes = (value: string) => {
  return value.replace(/["'«»„“”‘’]/g, "");
};

export default function AddCardForm({
  onAddCard,
  withFormat,
}: AddCardFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<AddCardFormData>({
    defaultValues: {
      title: "",
      creator: "",
      format: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: AddCardFormData) => {
    const cleanCreator = data.creator.trim();
    const cleanTitle = removeQuotes(data.title).trim();

    if (!cleanCreator || !cleanTitle) return;

    onAddCard({
      creator: cleanCreator,
      title: cleanTitle,
      format: data.format || "physical",
    });

    reset();
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
          maxLength: { value: 100, message: "Максимум 100 символов" },
          validate: (value) =>
            value.trim() !== "" || "Поле не должно быть пустым",
        })}
        slotProps={{ htmlInput: { "aria-label": "Автор" } }}
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
          maxLength: { value: 100, message: "Максимум 100 символов" },
          validate: (value) =>
            removeQuotes(value).trim() !== "" || "Поле не должно быть пустым",
        })}
        slotProps={{ htmlInput: { "aria-label": "Название" } }}
        size="small"
        placeholder="Введите название"
        sx={fieldStyles}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      {withFormat && (
        <TextField
          select
          fullWidth
          defaultValue=""
          {...register("format", {
            required: "Выберите тип книги",
          })}
          slotProps={{
            htmlInput: { "aria-label": "Тип книги" },
            select: { displayEmpty: true },
          }}
          size="small"
          sx={{
            ...fieldStyles,
          }}
          error={isSubmitted && !!errors.format}
          helperText={isSubmitted && errors.format?.message}
        >
          <MenuItem value="" disabled>
            Тип книги
          </MenuItem>

          <MenuItem value="physical">Печатная (своя)</MenuItem>
          <MenuItem value="borrowed">Заимствованная</MenuItem>
          <MenuItem value="ebook">Электронная</MenuItem>
          <MenuItem value="audio">Аудио</MenuItem>
        </TextField>
      )}

      <Button type="submit" sx={{ alignSelf: "flex-start" }}>
        Добавить книгу
      </Button>
    </Box>
  );
}
