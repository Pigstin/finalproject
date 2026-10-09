import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  console.log(env.VITE_API_LINK)
  return {
    plugins: [react()],
    define: {
      VITE_API_LINK: JSON.stringify(env.VITE_API_LINK)
    },
    server : {
      port: env.PORT ? Number(env.PORT) : 5173,
      proxy : {
        '/api' : {
          target: env.VITE_API_LINK,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        } 
      } 
    },
  }
});
