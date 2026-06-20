import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { cn } from "@/lib/utils"
import { Copy, Check } from "lucide-react"

function highlightCode(code: string, language: string): string {
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  if (!language) return escaped

  const patterns: Record<string, RegExp[]> = {
    javascript: [
      /\/\/.*/g,
      /\/\*[\s\S]*?\*\//g,
      /'[^']*'/g,
      /"[^"]*"/g,
      /`[^`]*`/g,
      /\b(const|let|var|function|return|if|else|for|while|import|export|from|async|await|class|new|this|typeof|instanceof|try|catch|throw)\b/g,
      /\b(true|false|null|undefined|NaN)\b/g,
      /\b(\d+\.?\d*)\b/g,
    ],
    typescript: [
      /\/\/.*/g,
      /\/\*[\s\S]*?\*\//g,
      /'[^']*'/g,
      /"[^"]*"/g,
      /`[^`]*`/g,
      /\b(const|let|var|function|return|if|else|for|while|import|export|from|async|await|class|new|this|typeof|instanceof|try|catch|throw|interface|type|enum|implements|extends|abstract|private|public|protected|readonly|static)\b/g,
      /\b(true|false|null|undefined|never|any|void)\b/g,
      /\b(\d+\.?\d*)\b/g,
    ],
    python: [
      /#.*/g,
      /'''[\s\S]*?'''/g,
      /"""/g,
      /'[^']*'/g,
      /"[^"]*"/g,
      /\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|finally|with|yield|lambda|pass|break|continue|raise|self|async|await|True|False|None|in|not|and|or|is)\b/g,
      /\b(\d+\.?\d*)\b/g,
    ],
    rust: [
      /\/\/.*/g,
      /\/\*[\s\S]*?\*\//g,
      /'[^']*'/g,
      /"[^"]*"/g,
      /\b(fn|let|mut|const|if|else|for|while|loop|return|struct|enum|impl|trait|pub|use|mod|match|unsafe|async|await|ref|move|as|where|Self|self|true|false|Some|None|Ok|Err)\b/g,
      /\b(u8|u16|u32|u64|i8|i16|i32|i64|f32|f64|bool|String|str|Vec|Option|Result|Box|HashMap)\b/g,
      /\b(\d+\.?\d*)\b/g,
    ],
  }

  const p = patterns[language] || patterns.javascript
  let result = escaped

  const replacements: { pattern: RegExp; replacement: string }[] = [
    { pattern: /\/\/.*/g, replacement: '<span class="hljs-comment">$&</span>' },
    { pattern: /\/\*[\s\S]*?\*\//g, replacement: '<span class="hljs-comment">$&</span>' },
    { pattern: /#.*/g, replacement: '<span class="hljs-comment">$&</span>' },
    { pattern: /'''[\s\S]*?'''/g, replacement: '<span class="hljs-string">$&</span>' },
    { pattern: /'[^']*'/g, replacement: '<span class="hljs-string">$&</span>' },
    { pattern: /"[^"]*"/g, replacement: '<span class="hljs-string">$&</span>' },
    { pattern: /`[^`]*`/g, replacement: '<span class="hljs-string">$&</span>' },
    { pattern: /\b(true|false|null|undefined|None|True|False)\b/g, replacement: '<span class="hljs-literal">$&</span>' },
    { pattern: /\b(\d+\.?\d*)\b/g, replacement: '<span class="hljs-number">$&</span>' },
  ]

  const keywords = [
    /\b(const|let|var|function|return|if|else|for|while|import|export|from|async|await|class|new|this|try|catch|throw|def|fn|struct|enum|impl|trait|pub|use|mod|match|interface|type|extends|implements|abstract|lambda|yield|raise|with|as|in|not|or|and|is)\b/g,
  ]

  for (const { pattern, replacement } of replacements) {
    result = result.replace(pattern, replacement)
  }

  for (const pattern of keywords) {
    result = result.replace(pattern, '<span class="hljs-keyword">$&</span>')
  }

  return result
}

function CodeBlock({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const match = /language-(\w+)/.exec(className || "")
  const code = String(children).replace(/\n$/, "")
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (match) {
    const lang = match[1].toLowerCase()
    const highlighted = highlightCode(code, lang)

    return (
      <div className="relative group my-3">
        <div className="flex items-center justify-between px-4 py-1.5 bg-muted/80 rounded-t-lg border border-b-0 border-border text-xs text-muted-foreground">
          <span>{match[1]}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-b-lg border border-border bg-[#282c34] p-4 text-sm leading-relaxed">
          <code
            className="font-mono text-[#abb2bf]"
            dangerouslySetInnerHTML={{ __html: highlighted || escapedCode(code) }}
          />
        </pre>
      </div>
    )
  }

  return (
    <code className={cn("bg-muted px-1.5 py-0.5 rounded text-sm font-mono", className)} {...props}>
      {children}
    </code>
  )
}

function escapedCode(code: string): string {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code: CodeBlock,
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3">
                <table className="min-w-full border-collapse border border-border text-sm">
                  {children}
                </table>
              </div>
            )
          },
          th({ children }) {
            return <th className="border border-border bg-muted px-3 py-2 text-left font-medium">{children}</th>
          },
          td({ children }) {
            return <td className="border border-border px-3 py-2">{children}</td>
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
