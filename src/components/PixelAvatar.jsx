import React, { useMemo } from "react";

// Deterministic seeded pixel-avatar generator: hashes the persona's name into
// a symmetric 5x5 grid, identicon-style, colored with the app's retro palette.
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const PALETTE = ["#FF4FA3", "#3E8EFF", "#39D6B4", "#FFC94A", "#D6237C"];

export default function PixelAvatar({ seed = "persona", size = 96 }) {
  const { cells, color } = useMemo(() => {
    const hash = hashString(seed);
    const color = PALETTE[hash % PALETTE.length];
    const cells = [];
    // 5 columns x 5 rows, mirror left half onto right half for a face-like symmetry
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        const bit = (hash >> (row * 3 + col)) & 1;
        cells.push({ row, col, on: !!bit });
        if (col < 2) cells.push({ row, col: 4 - col, on: !!bit });
      }
    }
    return { cells, color };
  }, [seed]);

  const cellSize = size / 5;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="border-[3px] border-ink shadow-pixelSm bg-white"
    >
      {cells.map((c, i) =>
        c.on ? (
          <rect
            key={i}
            x={c.col * cellSize}
            y={c.row * cellSize}
            width={cellSize}
            height={cellSize}
            fill={color}
          />
        ) : null
      )}
    </svg>
  );
}
