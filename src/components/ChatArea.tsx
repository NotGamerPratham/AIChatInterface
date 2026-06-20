import { useRef, useEffect, useCallback } from "react"

import { MessageBubble } from "./MessageBubble"
import { EmptyState } from "./EmptyState"
import { ChatInput } from "./ChatInput"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useConversationStore } from "@/stores/conversationStore"
import { useSettingsStore } from "@/stores/settingsStore"
import { useUIStore } from "@/stores/uiStore"
import { FileAttachment, Message } from "@/types"
import { generateId } from "@/lib/utils"

function simulateStreaming(messageId: string, content: string) {
  const store = useConversationStore.getState()
  const words = content.split(" ")
  let i = 0
  store.startStreaming(messageId)

  const interval = setInterval(() => {
    if (i >= words.length) {
      clearInterval(interval)
      store.stopStreaming()
      const msg = store.conversations
        .flatMap(c => c.messages)
        .find(m => m.id === messageId)
      if (msg) {
        const firstUserMsg = store.conversations
          .flatMap(c => c.messages)
          .find(m => m.role === "user")
        if (firstUserMsg) {
          const title = firstUserMsg.content.slice(0, 60)
          store.updateConversationTitle(store.activeConversationId!, title)
        }
      }
      return
    }
    store.appendStreamContent(words[i] + (i < words.length - 1 ? " " : ""))
    i++
  }, 30)
}

const sampleResponses: Record<string, string> = {
  "gpt-4o": "Here's a detailed breakdown of what you're asking about. The key insight is that modern approaches leverage transformer architectures with attention mechanisms that allow for parallel processing of sequence data.\n\n```python\nimport numpy as np\n\ndef attention(query, key, value):\n    scores = np.dot(query, key.T) / np.sqrt(key.shape[-1])\n    weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)\n    return np.dot(weights, value)\n```\n\nThe self-attention mechanism computes a weighted sum of all values, where the weights are derived from the compatibility between queries and keys. This enables the model to capture long-range dependencies effectively.\n\n| Feature | Benefit |\n|---------|--------|\n| Parallel processing | Faster training than RNNs |\n| Long-range dependencies | Better context understanding |\n| Scalability | Works with billions of parameters |\n\nWould you like me to elaborate on any specific aspect?",
  "gpt-4o-mini": "Great question! Let me give you a concise answer.\n\nThe core concept revolves around understanding the relationship between different components. Here's what you need to know:\n\n1. **Component A** handles the input processing\n2. **Component B** manages the transformation logic\n3. **Component C** produces the output\n\n> \"The best way to predict the future is to invent it.\" — Alan Kay\n\nI hope this helps! Let me know if you need more details on any part.",
  "claude-sonnet-4": "I'll provide a thorough analysis of this topic.\n\n## Overview\n\nThis is an excellent question that touches on several important concepts. Let me break it down systematically.\n\n### Key Principles\n\n1. **First Principle**: Everything should be built on solid foundations\n2. **Second Principle**: Complexity emerges from simple rules\n3. **Third Principle**: Optimization requires understanding trade-offs\n\n```typescript\ninterface System {\n  components: Component[]\n  connections: Connection[]\n  \n  analyze(): Analysis {\n    return {\n      complexity: this.calculateComplexity(),\n      reliability: this.assessReliability(),\n      recommendations: this.generateRecommendations()\n    }\n  }\n}\n```\n\nThe beauty of this approach is that it scales from small projects to large enterprise systems while maintaining clarity and maintainability.\n\n### Practical Application\n\nConsider implementing this in phases:\n1. Start with a minimal viable version\n2. Add features incrementally\n3. Refactor as understanding deepens\n\nI'm confident this approach will serve you well. What specific aspect would you like to explore further?",
  "claude-haiku-3": "Here's my quick take on this!\n\nThe answer involves a few key points:\n\n* **Efficiency** is paramount — optimize for the common case\n* **Simplicity** beats complexity — prefer straightforward solutions\n* **Testability** ensures reliability — write tests early\n\nLet me know if you'd like me to dive deeper into any of these areas!",
  "gemini-2.0-flash": "Let me process that and get back to you quickly.\n\nHere's what I found:\n\nThe concept you're asking about has several important dimensions:\n\n1. **Technical dimension** — how it works under the hood\n2. **Practical dimension** — how to apply it effectively\n3. **Strategic dimension** — when to use different approaches\n\n```javascript\nfunction analyze(problem) {\n  const constraints = identifyConstraints(problem)\n  const solution = findOptimalSolution(constraints)\n  return {\n    approach: solution.method,\n    complexity: solution.complexity,\n    tradeoffs: solution.tradeoffs\n  }\n}\n```\n\nIs there a specific area you'd like me to focus on more?",
  "gemini-2.5-pro": "I'll provide a comprehensive analysis drawing from my deep understanding of this topic.\n\n## Comprehensive Analysis\n\nThis question sits at an interesting intersection of several domains. Let me unpack it.\n\n### Foundational Concepts\n\nThe underlying principles can be traced back to fundamental discoveries in computer science:\n\n- **Abstraction**: Hiding complexity behind clean interfaces\n- **Composition**: Building complex systems from simpler parts\n- **Encapsulation**: Protecting internal state from external manipulation\n\n### Advanced Considerations\n\nWhen building production systems, consider:\n\n```rust\nfn process_data<T: Serialize>(input: &[T]) -> Result<Vec<u8>, Error> {\n    let mut buffer = Vec::new();\n    let mut encoder = Encoder::new(&mut buffer);\n    \n    for item in input {\n        encoder.encode(item)?;\n    }\n    \n    Ok(buffer)\n}\n```\n\n### Conclusion\n\nThe optimal approach depends on your specific constraints:\n- **Scale**: How much data are you processing?\n- **Latency**: How fast does it need to be?\n- **Reliability**: What's your tolerance for failure?\n\nWould you like me to elaborate on any of these aspects with more specific examples?",
  "grok-3": "Great question! Let's cut through the noise and get to the good stuff.\n\n**The short answer:** Yes, and here's why it matters.\n\n**The long answer:** \n\nThis is actually a fascinating problem that seems simple on the surface but has deep implications. Think of it like this:\n\n> \"Any sufficiently advanced technology is indistinguishable from magic.\" — Arthur C. Clarke\n\nBut we're not in the business of magic — we're in the business of understanding.\n\nHere's the reality check:\n- What works in theory often breaks in practice\n- Simple solutions beat clever ones 90% of the time\n- The best engineering is the engineering you don't have to do\n\nNow go build something awesome! 🚀\n\nLet me know what else you want to explore.",
}

export function ChatArea() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const {
    activeConversation, createConversation, addMessage,
    streamingMessageId, streamingContent, activeConversationId, setActiveConversation,
  } = useConversationStore()
  const defaultModel = useSettingsStore(s => s.defaultModel)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const el = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (el) {
        setTimeout(() => {
          el.scrollTop = el.scrollHeight
        }, 50)
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [activeConversation?.messages, streamingContent, scrollToBottom])

  const handleSend = useCallback((content: string, files: FileAttachment[]) => {
    let convId = activeConversationId

    if (!convId) {
      convId = createConversation(defaultModel)
    }

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
      files: files.length > 0 ? files : undefined,
    }

    addMessage(convId, userMsg)

    const assistantId = generateId()
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }
    addMessage(convId, assistantMsg)

    const conv = useConversationStore.getState().conversations.find(c => c.id === convId)
    const model = conv?.model || defaultModel
    const responseContent = sampleResponses[model] || sampleResponses["gpt-4o"]!

    simulateStreaming(assistantId, responseContent)
    scrollToBottom()
  }, [activeConversationId, createConversation, addMessage, defaultModel, scrollToBottom])

  const handleSuggestion = (text: string) => {
    handleSend(text, [])
  }

  const messages = activeConversation?.messages || []
  const isStreaming = streamingMessageId !== null

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {activeConversation ? (
        <>
          <ScrollArea ref={scrollRef} className="flex-1">
            <div className="max-w-4xl mx-auto py-4 space-y-1">
              {messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isStreaming={msg.id === streamingMessageId}
                />
              ))}
            </div>
          </ScrollArea>
          <ChatInput onSend={handleSend} disabled={isStreaming} />
        </>
      ) : (
        <>
          <div className="flex-1 overflow-auto">
            <EmptyState onSelect={handleSuggestion} />
          </div>
          <ChatInput onSend={handleSend} />
        </>
      )}
    </div>
  )
}
