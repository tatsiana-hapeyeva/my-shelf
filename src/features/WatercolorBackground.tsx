import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const BRUSH_COLORS = ["#7942DB", "#DB7542", "#DBC242", "#42DBC2"];

export type WatercolorHandle = {
  clear: () => void;
};

type WatercolorBackgroundProps = {
  enabled: boolean;
};

function hexToRgba(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const WatercolorBackground = forwardRef<
  WatercolorHandle,
  WatercolorBackgroundProps
>(({ enabled }, ref) => {
  const brushCanvasRef = useRef<HTMLCanvasElement>(null);
  const wetCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dryCanvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!wetCanvasRef.current && typeof document !== "undefined") {
    wetCanvasRef.current = document.createElement("canvas");
  }
  if (!dryCanvasRef.current && typeof document !== "undefined") {
    dryCanvasRef.current = document.createElement("canvas");
  }

  useImperativeHandle(
    ref,
    () => ({
      clear: () => {
        const canvas = brushCanvasRef.current;
        const wet = wetCanvasRef.current;
        const dry = dryCanvasRef.current;
        if (canvas && wet && dry) {
          const ctx = canvas.getContext("2d");
          const wetCtx = wet.getContext("2d");
          const dryCtx = dry.getContext("2d");

          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          wetCtx?.clearRect(0, 0, wet.width, wet.height);
          dryCtx?.clearRect(0, 0, dry.width, dry.height);
        }
      },
    }),
    [],
  );

  useEffect(() => {
    const canvas = brushCanvasRef.current;
    const wetCanvas = wetCanvasRef.current;
    const dryCanvas = dryCanvasRef.current;
    if (!canvas || !wetCanvas || !dryCanvas) return;

    function resizeAll() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      wetCanvas.width = width;
      wetCanvas.height = height;
      dryCanvas.width = width;
      dryCanvas.height = height;
    }

    resizeAll();
    window.addEventListener("resize", resizeAll);

    return () => {
      window.removeEventListener("resize", resizeAll);
    };
  }, []);

  useEffect(() => {
    const canUseFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!canUseFinePointer) return;

    const canvas = brushCanvasRef.current;
    const wetCanvas = wetCanvasRef.current;
    const dryCanvas = dryCanvasRef.current;
    if (!canvas || !wetCanvas || !dryCanvas) return;

    const ctx = canvas.getContext("2d");
    const wetCtx = wetCanvas.getContext("2d");
    const dryCtx = dryCanvas.getContext("2d");
    if (!ctx || !wetCtx || !dryCtx) return;

    let colorIndex = 0;
    let moveCount = 0;
    let lastX = 0;
    let lastY = 0;
    let animationId = 0;

    function drawBlot(
      x: number,
      y: number,
      radius: number,
      color: string,
      opacity: number,
    ) {
      const gradient = wetCtx!.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, hexToRgba(color, opacity));
      gradient.addColorStop(0.4, hexToRgba(color, opacity * 0.5));
      gradient.addColorStop(1, hexToRgba(color, 0));

      wetCtx!.fillStyle = gradient;
      wetCtx!.beginPath();
      wetCtx!.arc(x, y, radius, 0, Math.PI * 2);
      wetCtx!.fill();
    }

    function handlePointerMove(event: PointerEvent) {
      const x = event.clientX;
      const y = event.clientY;
      const distance = Math.hypot(x - lastX, y - lastY);
      if (distance < 2) return;

      lastX = x;
      lastY = y;
      moveCount++;

      if (moveCount % 30 === 0) {
        colorIndex = (colorIndex + 1) % BRUSH_COLORS.length;
      }

      const color = BRUSH_COLORS[colorIndex];
      const randomSkewed = Math.pow(Math.random(), 2);
      const mainRadius = 25 + randomSkewed * 100;

      drawBlot(x, y, mainRadius, color, 0.05);

      const bloomCount = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < bloomCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const offset = mainRadius * (0.2 + Math.random() * 0.5);
        const bloomX = x + Math.cos(angle) * offset;
        const bloomY = y + Math.sin(angle) * offset;
        const bloomRadius = mainRadius * (0.4 + Math.random() * 0.5);

        drawBlot(
          bloomX,
          bloomY,
          bloomRadius,
          color,
          0.025 + Math.random() * 0.02,
        );
      }
    }

    function fadeLoop() {
      dryCtx.globalCompositeOperation = "source-over";
      dryCtx.globalAlpha = 0.004;
      dryCtx.drawImage(wetCanvas, 0, 0);

      wetCtx.globalCompositeOperation = "destination-out";
      wetCtx.fillStyle = "rgba(0, 0, 0, 0.003)";
      wetCtx.fillRect(0, 0, wetCanvas.width, wetCanvas.height);
      wetCtx.globalCompositeOperation = "source-over";

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(dryCanvas, 0, 0);
      ctx.drawImage(wetCanvas, 0, 0);

      animationId = requestAnimationFrame(fadeLoop);
    }

    if (enabled) {
      window.addEventListener("pointermove", handlePointerMove);
      fadeLoop();
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationId);
    };
  }, [enabled]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={brushCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
});

WatercolorBackground.displayName = "WatercolorBackground";

export default WatercolorBackground;
