import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f0fdf4" },
          100: { value: "#dcfce7" },
          200: { value: "#bbf7d0" },
          300: { value: "#86efac" },
          400: { value: "#4ade80" },
          500: { value: "#22c55e" },
          600: { value: "#16a34a" },
          700: { value: "#15803d" },
          800: { value: "#166534" },
          900: { value: "#14532d" },
          950: { value: "#052e16" },
        },
        slate: {
          50: { value: "#f8fafc" },
          100: { value: "#f1f5f9" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e1" },
          400: { value: "#94a3b8" },
          500: { value: "#64748b" },
          600: { value: "#475569" },
          700: { value: "#334155" },
          800: { value: "#1e293b" },
          900: { value: "#0f172a" },
          950: { value: "#020617" },
        },
      },
      fonts: {
        heading: { value: "'Outfit', sans-serif" },
        body: { value: "'DM Sans', sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "{colors.brand.50}" },
          fg: { value: { _light: "{colors.brand.700}", _dark: "{colors.brand.400}" } },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: { _light: "{colors.brand.100}", _dark: "{colors.brand.900}" } },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.500}" },
        },
        sidebar: {
          bg: { value: { _light: "{colors.slate.900}", _dark: "{colors.slate.950}" } },
          text: { value: { _light: "{colors.slate.300}", _dark: "{colors.slate.400}" } },
          textActive: { value: { _light: "white", _dark: "white" } },
          hover: { value: { _light: "{colors.slate.800}", _dark: "{colors.slate.900}" } },
          activeBg: { value: { _light: "{colors.brand.600}", _dark: "{colors.brand.600}" } },
          border: { value: { _light: "{colors.slate.700}", _dark: "{colors.slate.800}" } },
        },
        navbar: {
          bg: { value: { _light: "white", _dark: "{colors.slate.900}" } },
          border: { value: { _light: "{colors.slate.200}", _dark: "{colors.slate.800}" } },
        },
      },
    },
  },
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
      minHeight: "100vh",
      fontFamily: "body",
    },
    "*": {
      boxSizing: "border-box",
    },
  },
});

export const system = createSystem(defaultConfig, config);

