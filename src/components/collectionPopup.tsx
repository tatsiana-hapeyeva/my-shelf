import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import Button from "./button";

type CollectionPopupProps = {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  editButtonText: string;
};

export default function CollectionPopup({
  open,
  children,
  onClose,
  onEdit,
  onDelete,
  editButtonText,
}: CollectionPopupProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
            border: "1px solid var(--color-extra)",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "560px",
            p: 2,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Box>{children}</Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
          }}
        >
          <Button type="button" onClick={onEdit}>
            {editButtonText}
          </Button>

          <Button type="button" buttonVariant="outlined" onClick={onDelete}>
            Удалить
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
