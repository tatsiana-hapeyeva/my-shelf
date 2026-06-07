import MuiButton from "@mui/material/Button";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type ButtonProps = MuiButtonProps & {
  buttonVariant?: "filled" | "outlined";
};

export default function Button({
  buttonVariant = "filled",
  sx,
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      variant="contained"
      sx={{
        backgroundColor:
          buttonVariant === "outlined" ? "transparent" : "var(--color-accent)",
        border:
          buttonVariant === "outlined"
            ? "1px solid var(--color-extra)"
            : "none",
        "&.Mui-disabled": {
          backgroundColor:
            buttonVariant === "outlined"
              ? "transparent"
              : "color-mix(in srgb, var(--color-accent) 80%, black 20%)",
          color: "color-mix(in srgb, var(--color-text) 80%, black 10%)",
          border:
            buttonVariant === "outlined"
              ? "1px solid var(--color-extra)"
              : "none",
        },
        ...sx,
      }}
      {...props}
    />
  );
}
