import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        },
      },
    },

    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          minWidth: 0,
        },
      },
    },

    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
    },

    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
      },
    },

    MuiRadio: {
      defaultProps: {
        disableRipple: true,
      },
    },

    MuiSwitch: {
      defaultProps: {
        disableRipple: true,
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundImage: "none",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundImage: "none",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          backgroundImage: "none",
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          backgroundImage: "none",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          border: "1px solid var(--color-extra)",
          borderRadius: "8px",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundImage: "none",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "var(--color-extra)",
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2b2b2e",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2b2b2e",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2b2b2e",
          },
        },
      },
    },
  },
});

export default theme;
