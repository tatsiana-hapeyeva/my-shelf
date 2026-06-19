import MuiButton from "@mui/material/Button";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type ButtonProps = MuiButtonProps & {
  variant?: "contained" | "outlined";
};

export default function Button({
  variant = "contained",
  sx,
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      variant="contained"
      sx={{
        backgroundColor:
          variant === "outlined" ? "transparent" : "var(--color-accent)",
        border:
          variant === "outlined" ? "1px solid var(--color-extra)" : "none",
        "&.Mui-disabled": {
          backgroundColor:
            variant === "outlined"
              ? "transparent"
              : "color-mix(in srgb, var(--color-accent) 80%, black 20%)",
          color: "color-mix(in srgb, var(--color-text) 80%, black 10%)",
          border:
            variant === "outlined" ? "1px solid var(--color-extra)" : "none",
        },
        ...sx,
      }}
      {...props}
    />
  );
}
