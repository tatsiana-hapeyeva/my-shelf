import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";

import { type ItemCardData } from "../types";

type ItemCardDetailedProps = {
  item: ItemCardData;
  isEditing: boolean;
  onSubmit: (data: ItemCardData) => void;
  onValidityChange?: (isValid: boolean) => void;
};

const textSx = {
  overflowWrap: "anywhere",
  whiteSpace: "normal",
  minWidth: 0,
  maxWidth: "100%",
};

const chipSx = {
  backgroundColor: "var(--color-accent)",
  color: "var(--color-text-add)",
  "& .MuiChip-deleteIcon": {
    color: "var(--color-text-add)",
  },
};

export default function ItemCardDetailed({
  item,
  isEditing,
  onSubmit,
  onValidityChange,
}: ItemCardDetailedProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ItemCardData>({
    defaultValues: item,
    mode: "onChange",
  });

  useEffect(() => {
    reset(item);
  }, [item, reset]);

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  const [tagInput, setTagInput] = useState("");

  if (!isEditing) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Typography sx={textSx}>{item.title}</Typography>
        <Typography sx={textSx}>{item.creator}</Typography>

        {item.tags?.length ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {item.tags.map((tag) => (
              <Chip key={tag} label={tag} sx={chipSx} />
            ))}
          </Box>
        ) : (
          <Typography>Добавьте теги</Typography>
        )}

        <Typography sx={textSx}>
          {item.impressions ? item.impressions : "Добавьте впечатления"}
        </Typography>

        <Typography>{item.isRead ? "Прочитана" : "Не прочитана"}</Typography>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      id="collection-card-form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,

        "& .MuiInputBase-input": {
          color: "var(--color-text)",
        },
        "& .MuiInputBase-input::placeholder": {
          color: "var(--color-extra)",
          opacity: 1,
        },
        "& .MuiFormControlLabel-label": {
          color: "var(--color-text)",
        },
        "& .MuiCheckbox-root": {
          color: "var(--color-extra)",
        },
        "& .MuiCheckbox-root.Mui-checked": {
          color: "var(--color-text)",
        },
      }}
    >
      <TextField
        {...register("title", {
          maxLength: {
            value: 100,
            message: "Максимум 100 символов",
          },
        })}
        label="Название"
        placeholder="Название"
        fullWidth
        size="small"
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <TextField
        {...register("creator", {
          maxLength: {
            value: 100,
            message: "Максимум 100 символов",
          },
        })}
        label="Автор"
        placeholder="Автор"
        fullWidth
        size="small"
        error={!!errors.creator}
        helperText={errors.creator?.message}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field }) => {
          const tags = field.value || [];

          return (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "center",
              }}
            >
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() =>
                    field.onChange(tags.filter((item) => item !== tag))
                  }
                  sx={chipSx}
                />
              ))}

              <TextField
                label="Теги"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Добавьте теги"
                size="small"
                variant="standard"
                sx={{
                  ml: 2,
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "var(--color-accent)",
                  },
                }}
                slotProps={{
                  htmlInput: {
                    maxLength: 30,
                    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        e.preventDefault();

                        const newTag = tagInput.trim();
                        if (!newTag) return;
                        if (tags.includes(newTag)) return;

                        field.onChange([...tags, newTag]);
                        setTagInput("");
                      }
                    },
                  },
                }}
              />
            </Box>
          );
        }}
      />

      <TextField
        {...register("impressions", {
          maxLength: {
            value: 2000,
            message: "Максимум 2000 символов",
          },
        })}
        label="Впечатления"
        placeholder="Добавьте впечатления"
        multiline
        rows={4}
        error={!!errors.impressions}
        helperText={errors.impressions?.message}
      />

      <Controller
        name="isRead"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            label="Прочитана"
            control={
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
          />
        )}
      />
    </Box>
  );
}
