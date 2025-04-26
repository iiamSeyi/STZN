import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// vite.config.js
// import { defineConfig } from 'vite';
// import { vitePlugin as remix } from "@remix-run/dev";

// export default defineConfig({
//   plugins: [
//     react(),
//     remix({
//       future: {
//         v7_startTransition: true,
//         v7_relativeSplatPath: true
//       }
//     })
//   ]
// });
