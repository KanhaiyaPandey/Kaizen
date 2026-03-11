import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        sand: "#f4efe6",
        ember: "#ef6f3c",
        moss: "#1f6f50"
      }
    }
  },
  plugins: []
};

export default config;
