"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchInputProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

export function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. noise-canceling headphones under $200 for gym"
            className="pl-14 h-16 text-lg bg-card border-border focus:border-primary"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-16 px-10 text-lg font-semibold bg-primary text-black hover:bg-primary/90"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? "Searching..." : "Start Shopping"}
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">No credit card required • Free to use</p>
    </form>
  )
}
