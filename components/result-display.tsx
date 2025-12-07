"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from "react-markdown"

interface ResultDisplayProps {
  markdown: string
}

export function ResultDisplay({ markdown }: ResultDisplayProps) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Badge
          variant="outline"
          className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/30"
        >
          <span className="mr-2">🧠</span>
          Advanced AI Analysis Powered by LLaMA 3.3 70B
        </Badge>
      </div>

      <Card className="p-8 prose prose-lg dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500 bg-card/50 backdrop-blur">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-4xl font-bold mt-8 mb-4 text-foreground bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground" {...props} />,
            h4: ({ node, ...props }) => <h4 className="text-xl font-semibold mt-4 mb-2 text-foreground" {...props} />,
            p: ({ node, ...props }) => (
              <p className="text-base leading-relaxed mb-4 text-muted-foreground" {...props} />
            ),
            a: ({ node, href, children, ...props }) => {
              if (
                children?.toString().toLowerCase().includes("check current price") ||
                children?.toString().toLowerCase().includes("buy now")
              ) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/50 no-underline my-4 transform hover:scale-105"
                    {...props}
                  >
                    {children}
                  </a>
                )
              }
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:text-emerald-600 underline"
                  {...props}
                >
                  {children}
                </a>
              )
            },
            strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
            em: ({ node, ...props }) => <em className="italic text-muted-foreground" {...props} />,
            hr: ({ node, ...props }) => <hr className="my-8 border-border" {...props} />,
            ul: ({ node, ...props }) => <ul className="space-y-2 my-4" {...props} />,
            li: ({ node, ...props }) => <li className="text-muted-foreground" {...props} />,
            div: ({ node, ...props }) => <div {...props} />,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </Card>
    </div>
  )
}
