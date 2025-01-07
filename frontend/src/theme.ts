import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brand: {
      50: "#e6f6ff",
      100: "#b3e0ff",
      200: "#80caff",
      300: "#4db4ff",
      400: "#1a9eff",
      500: "#0088ff",
      600: "#006dcc",
      700: "#005299",
      800: "#003666",
      900: "#001a33",
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});
