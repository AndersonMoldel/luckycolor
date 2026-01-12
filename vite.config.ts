import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  base: "./",   // 👈 沒有這行，Static Web Apps 常白頁
})
