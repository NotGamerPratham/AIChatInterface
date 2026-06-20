import { create } from "zustand"
import { Theme, AppSettings } from "@/types"

interface SettingsState extends AppSettings {
  setTheme: (theme: Theme) => void
  setDefaultModel: (model: string) => void
  setFontSize: (size: "sm" | "base" | "lg") => void
  setEnterToSend: (value: boolean) => void
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === "system") {
    const system = getSystemTheme()
    root.classList.toggle("dark", system === "dark")
  } else {
    root.classList.toggle("dark", theme === "dark")
  }
}

const savedTheme = (typeof localStorage !== "undefined"
  ? (localStorage.getItem("theme") as Theme | null)
  : null) || getSystemTheme()

applyTheme(savedTheme)

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: savedTheme,
  defaultModel: "gpt-4o",
  fontSize: "base",
  enterToSend: true,

  setTheme: (theme: Theme) => {
    localStorage.setItem("theme", theme)
    applyTheme(theme)
    set({ theme })
  },

  setDefaultModel: (model: string) => set({ defaultModel: model }),
  setFontSize: (size) => set({ fontSize: size }),
  setEnterToSend: (value) => set({ enterToSend: value }),
}))
