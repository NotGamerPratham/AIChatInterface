import { create } from "zustand"
import { Folder } from "@/types"
import { folders as defaultFolders } from "@/data/conversations"

interface UIState {
  sidebarOpen: boolean
  searchQuery: string
  selectedFolderId: string | null
  folders: Folder[]
  isMobileMenuOpen: boolean

  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setSelectedFolderId: (id: string | null) => void
  addFolder: (folder: Folder) => void
  removeFolder: (id: string) => void
  setMobileMenuOpen: (open: boolean) => void
  filteredConversations: () => { id: string; title: string; updatedAt: Date; folderId?: string; model: string }[]
  conversationsByFolder: () => Map<string, { id: string; title: string; updatedAt: Date; model: string }[]>
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  searchQuery: "",
  selectedFolderId: null,
  folders: defaultFolders,
  isMobileMenuOpen: false,

  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),
  addFolder: (folder) => set(state => ({ folders: [...state.folders, folder] })),
  removeFolder: (id) => set(state => ({ folders: state.folders.filter(f => f.id !== id) })),

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  filteredConversations: () => {
    const { searchQuery, selectedFolderId } = get()
    const convs = useConversationStore.getState().conversations
    let filtered = convs
    if (selectedFolderId) {
      filtered = filtered.filter(c => c.folderId === selectedFolderId)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.messages.some(m => m.content.toLowerCase().includes(q))
      )
    }
    return filtered.map(c => ({
      id: c.id,
      title: c.title,
      updatedAt: c.updatedAt,
      folderId: c.folderId,
      model: c.model,
    }))
  },

  conversationsByFolder: () => {
    const convs = get().filteredConversations()
    const map = new Map<string, { id: string; title: string; updatedAt: Date; model: string }[]>()
    const noFolder: { id: string; title: string; updatedAt: Date; model: string }[] = []
    for (const c of convs) {
      if (c.folderId) {
        const existing = map.get(c.folderId) || []
        existing.push(c)
        map.set(c.folderId, existing)
      } else {
        noFolder.push(c)
      }
    }
    map.set("__none__", noFolder)
    return map
  },
}))

import { useConversationStore } from "./conversationStore"
