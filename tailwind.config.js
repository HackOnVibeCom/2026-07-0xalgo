/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF9FC",
        panel: "#FFFFFF",
        ink: "#241B2F",
        bubble: "#FF4FA3",
        bubbleDeep: "#D6237C",
        skyline: "#3E8EFF",
        skylineDeep: "#1E5FD9",
        mint: "#39D6B4",
        sun: "#FFC94A",
        grid: "#F0DCEB"
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "cursive"],
        mono: ["'VT323'", "monospace"],
        body: ["'JetBrains Mono'", "monospace"]
      },
      boxShadow: {
        pixel: "4px 4px 0px 0px rgba(36,27,47,1)",
        pixelSm: "2px 2px 0px 0px rgba(36,27,47,1)",
        pixelLg: "8px 8px 0px 0px rgba(36,27,47,1)"
      },
      backgroundImage: {
        scanlines:
          "repeating-linear-gradient(0deg, rgba(36,27,47,0.05) 0px, rgba(36,27,47,0.05) 1px, transparent 1px, transparent 3px)",
        dotgrid:
          "radial-gradient(rgba(36,27,47,0.12) 1px, transparent 1px)"
      },
      backgroundSize: {
        dots: "16px 16px"
      },
      keyframes: {
        blink: { "0%,49%": { opacity: 1 }, "50%,100%": { opacity: 0 } },
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        blink: "blink 1s step-start infinite",
        floaty: "floaty 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
