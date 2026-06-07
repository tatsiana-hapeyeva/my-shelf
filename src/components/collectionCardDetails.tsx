import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { Checkbox } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import Chip from "@mui/material/Chip";

export type CollectionCardData = {
  id: string;
  title: string;
  creator: string;
  tags?: string[];
  isRead: boolean;
  impressions?: string;
};

type CollectionCardDetailsProps = {
  item: CollectionCardData;
  isEditing: boolean;
  onSubmit: (data: CollectionCardData) => void;
};

export default function CollectionCardDetails({
  item,
  isEditing,
  onSubmit,
}: CollectionCardDetailsProps) {
  const { register, control, handleSubmit, reset } =
    useForm<CollectionCardData>({
      defaultValues: item,
    });

  useEffect(() => {
    reset(item);
  }, [item, reset]);

  const [tagInput, setTagInput] = useState("");

  if (!isEditing) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography>{item.title}</Typography>
        <Typography>{item.creator}</Typography>
        {item.tags?.length ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {item.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                sx={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-text-add)",
                  "& .MuiChip-deleteIcon": {
                    color: "var(--color-text-add)",
                  },
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography>Добавьте теги</Typography>
        )}
        <Typography>
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
        {...register("title")}
        placeholder="Название"
        fullWidth
        size="small"
      />
      <TextField
        {...register("creator")}
        placeholder="Автор"
        fullWidth
        size="small"
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
                  sx={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-text-add)",
                    "& .MuiChip-deleteIcon": {
                      color: "var(--color-text-add)",
                    },
                  }}
                />
              ))}

              <TextField
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
        {...register("impressions")}
        placeholder="Добавьте впечатления"
        multiline
        rows={4}
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
