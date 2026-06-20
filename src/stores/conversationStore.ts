import { create } from "zustand"
import { Conversation, Message, FileAttachment } from "@/types"
import { generateId } from "@/lib/utils"

interface ConversationState {
  conversations: Conversation[]
  activeConversationId: string | null
  streamingMessageId: string | null
  streamingContent: string

  createConversation: (model: string) => string
  deleteConversation: (id: string) => void
  setActiveConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: Message) => void
  updateMessageContent: (messageId: string, content: string) => void
  startStreaming: (messageId: string) => void
  appendStreamContent: (content: string) => void
  stopStreaming: () => void
  setConversations: (conversations: Conversation[]) => void
  updateConversationTitle: (id: string, title: string) => void
  addFileToMessage: (conversationId: string, messageId: string, file: FileAttachment) => void
  activeConversation: () => Conversation | undefined
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  streamingMessageId: null,
  streamingContent: "",

  createConversation: (model: string) => {
    const id = generateId()
    const conversation: Conversation = {
      id,
      title: "New conversation",
      messages: [],
      model,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set(state => ({
      conversations: [conversation, ...state.conversations],
      activeConversationId: id,
    }))
    return id
  },

  deleteConversation: (id: string) => {
    set(state => ({
      conversations: state.conversations.filter(c => c.id !== id),
      activeConversationId:
        state.activeConversationId === id ? null : state.activeConversationId,
    }))
  },

  setActiveConversation: (id: string | null) => {
    set({ activeConversationId: id })
  },

  addMessage: (conversationId: string, message: Message) => {
    set(state => ({
      conversations: state.conversations.map(c =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message], updatedAt: new Date() }
          : c
      ),
    }))
  },

  updateMessageContent: (messageId: string, content: string) => {
    set(state => ({
      conversations: state.conversations.map(c => ({
        ...c,
        messages: c.messages.map(m =>
          m.id === messageId ? { ...m, content } : m
        ),
      })),
    }))
  },

  startStreaming: (messageId: string) => {
    set({ streamingMessageId: messageId, streamingContent: "" })
  },

  appendStreamContent: (content: string) => {
    set(state => {
      const newContent = state.streamingContent + content
      if (!state.streamingMessageId) return { streamingContent: newContent }
      return {
        streamingContent: newContent,
        conversations: state.conversations.map(c => ({
          ...c,
          messages: c.messages.map(m =>
            m.id === state.streamingMessageId
              ? { ...m, content: newContent }
              : m
          ),
        })),
      }
    })
  },

  stopStreaming: () => {
    set({ streamingMessageId: null, streamingContent: "" })
  },

  setConversations: (conversations: Conversation[]) => {
    set({ conversations })
  },

  updateConversationTitle: (id: string, title: string) => {
    set(state => ({
      conversations: state.conversations.map(c =>
        c.id === id ? { ...c, title, updatedAt: new Date() } : c
      ),
    }))
  },

  addFileToMessage: (conversationId: string, messageId: string, file: FileAttachment) => {
    set(state => ({
      conversations: state.conversations.map(c =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map(m =>
                m.id === messageId
                  ? { ...m, files: [...(m.files || []), file] }
                  : m
              ),
            }
          : c
      ),
    }))
  },

  activeConversation: () => {
    const { conversations, activeConversationId } = get()
    return conversations.find(c => c.id === activeConversationId)
  },
}))
