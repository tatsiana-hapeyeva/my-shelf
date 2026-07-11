import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Button from "./Button";

type ConfirmPopupProps = {
  open: boolean;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
};

export default function ConfirmPopup({
  open,
  message,
  onClose,
  onConfirm,
  confirmButtonText = "Удалить",
  cancelButtonText = "Отмена",
}: ConfirmPopupProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-label="Подтверждение действия"
      aria-describedby="confirm-delete-description"
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
        <Box>{message}</Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
          }}
        >
          <Button type="button" variant="outlined" onClick={onClose}>
            {cancelButtonText}
          </Button>

          {onConfirm && (
            <Button type="button" onClick={onConfirm}>
              {confirmButtonText}
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
