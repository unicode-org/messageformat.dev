import plugin from "npm:tailwindcss@3.4.4/plugin.js";
import type { Config } from "npm:tailwindcss@3.4.4";

export default {
  content: ["**/*.html", "**/*.md", "**/*.vto"],

  theme: {
    extend: {
      fontFamily: {
        mono: "'Fira Code', monospace",
        handwritten: ["'Kalam'", "cursive"],
      },
      animation: {
        "pulse-bg-blue": "pulse-bg-blue 2s infinite ease",
      },
    },
  },

  plugins: [
    plugin((p) => {
      p.addUtilities({
        '.font-mono': {
          fontVariantLigatures: 'none',
        },
      })
    }),
  ],
} satisfies Config;
