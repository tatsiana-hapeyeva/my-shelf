import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Button from "./button";

type ConfirmDeletePopupProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeletePopup({
  open,
  onClose,
  onConfirm,
}: ConfirmDeletePopupProps) {
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
            maxWidth: "320px",
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
        <Box>Это действие нельзя отменить.</Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
          }}
        >
          <Button type="button" buttonVariant="outlined" onClick={onClose}>
            Отмена
          </Button>

          <Button type="button" onClick={onConfirm}>
            Удалить
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
