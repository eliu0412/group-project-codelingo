import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // Binds the server to all network interfaces
    port: 5173, // Make sure the port is set to 3000 or whichever port you want to use
    open: false, // Optionally open the app automatically in the browser when running
  },
});
