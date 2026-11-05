import { useRef, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Hero } from "./pages/hero";
import { Library } from "./pages/library";
import { Finished } from "./pages/finished";
import WatercolorBackground, {
  type WatercolorHandle,
} from "./features/WatercolorBackground";
import Button from "./components/Button";

import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const BUTTON_SX = {
  minWidth: "40px",
  width: "40px",
  p: 0,
} as const;

export default function App() {
  const [isEffectEnabled, setIsEffectEnabled] = useState(true);
  const watercolorRef = useRef<WatercolorHandle>(null);
  const isDesktop = useMediaQuery("(min-width:600px)");

  const handleClear = () => {
    watercolorRef.current?.clear();
  };

  const handleToggle = () => {
    setIsEffectEnabled((prev) => !prev);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <WatercolorBackground
        ref={watercolorRef}
        enabled={isEffectEnabled && isDesktop}
      />

      <Box component="main" sx={{ position: "relative", zIndex: 10 }}>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/library" element={<Library />} />
          <Route path="/finished" element={<Finished />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>

      {isDesktop && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 20,
            display: "flex",
            gap: "12px",
          }}
        >
          <Button
            onClick={handleToggle}
            variant={isEffectEnabled ? "contained" : "outlined"}
            sx={BUTTON_SX}
            aria-label="Toggle watercolor effect"
          >
            <BlurOnIcon />
          </Button>
          <Button
            onClick={handleClear}
            variant="outlined"
            sx={BUTTON_SX}
            aria-label="Clear canvas"
          >
            <RestartAltIcon />
          </Button>
        </Box>
      )}
    </Box>
  );
}
