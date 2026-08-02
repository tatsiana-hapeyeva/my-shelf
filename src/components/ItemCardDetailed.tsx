import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import HeadphonesIcon from "@mui/icons-material/Headphones";

import { type ItemCardData } from "../types";

type ItemCardDetailedProps = {
  item: ItemCardData;
  isEditing: boolean;
  onSubmit: (data: ItemCardData) => void;
  onValidityChange?: (isValid: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
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

const hiddenLabelFieldSx = {
  "& .MuiInputBase-input::placeholder": {
    color: "var(--color-extra)",
    opacity: 1,
  },
  "& .MuiInputLabel-root": {
    opacity: 0,
    pointerEvents: "none",
  },
};

const hiddenLabelSlotProps = {
  inputLabel: { shrink: true },
};

export default function ItemCardDetailed({
  item,
  isEditing,
  onSubmit,
  onValidityChange,
  formRef,
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

  const formatIcons: Record<string, React.ElementType> = {
    physical: MenuBookIcon,
    borrowed: SwapHorizIcon,
    ebook: TabletMacIcon,
    audio: HeadphonesIcon,
  };

  if (!isEditing) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,

          overflow: "hidden",
          position: "relative",
          pr: 4,
        }}
      >
        {(() => {
          const Icon = item.format ? formatIcons[item.format] : null;
          return Icon ? (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
              }}
            >
              <Icon fontSize="small" sx={{ color: "var(--color-text)" }} />
            </Box>
          ) : null;
        })()}

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
      ref={formRef}
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
        sx={hiddenLabelFieldSx}
        slotProps={hiddenLabelSlotProps}
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
        sx={hiddenLabelFieldSx}
        slotProps={hiddenLabelSlotProps}
        error={!!errors.creator}
        helperText={errors.creator?.message}
      />

      <Controller
        name="format"
        control={control}
        rules={{ required: "Выберите тип книги" }}
        render={({ field, fieldState }) => (
          <TextField
            select
            fullWidth
            label="Тип книги"
            size="small"
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            sx={hiddenLabelFieldSx}
            slotProps={hiddenLabelSlotProps}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          >
            <MenuItem value="" disabled>
              Выберите тип книги
            </MenuItem>
            <MenuItem value="physical">Печатная (своя)</MenuItem>
            <MenuItem value="borrowed">Заимствованная</MenuItem>
            <MenuItem value="ebook">Электронная</MenuItem>
            <MenuItem value="audio">Аудио</MenuItem>
          </TextField>
        )}
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
                  ...hiddenLabelFieldSx,
                  ml: 2,
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "var(--color-accent)",
                  },
                }}
                slotProps={{
                  ...hiddenLabelSlotProps,
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
        sx={hiddenLabelFieldSx}
        slotProps={hiddenLabelSlotProps}
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
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
          />
        )}
      />
    </Box>
  );
}
