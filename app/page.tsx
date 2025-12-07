"use client"

import { useState } from "react"
import { SearchInput } from "@/components/search-input"
import { LoadingState } from "@/components/loading-state"
import { ResultDisplay } from "@/components/result-display"
import { AlertCircle, MessageSquare, Cpu, Package, SearchIcon, Star, TrendingDown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (query: string) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 90000)

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Search failed")
      }

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(data.markdown)
      }
    } catch (err) {
      console.error("[v0] Search error:", err)
      if (err instanceof Error && err.name === "AbortError") {
        setError("Search took too long. Try with more specific keywords or a different product.")
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again with different keywords.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center space-y-6 max-w-5xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">AI-Powered Shopping Assistant</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
            Shop smarter with <span className="text-primary">AI</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tell us what you need. Our AI searches multiple stores, analyzes reviews, compares prices, and finds the
            best deals — all in seconds.
          </p>
        </div>

        <SearchInput onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <Alert variant="destructive" className="max-w-4xl mx-auto mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Results or Loading */}
      {isLoading && (
        <div className="container mx-auto px-4">
          <LoadingState />
        </div>
      )}

      {result && !isLoading && (
        <div className="container mx-auto px-4">
          <ResultDisplay markdown={result} />
        </div>
      )}

      {/* How It Works Section */}
      {!isLoading && !result && !error && (
        <>
          <div className="container mx-auto px-4 py-24">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold">How it works</h2>
              <p className="text-xl text-muted-foreground">Get from idea to purchase in three simple steps.</p>
            </div>

            {/* Steps with connecting lines */}
            <div className="max-w-6xl mx-auto relative">
              {/* Connecting line */}
              <div className="hidden lg:block absolute top-[72px] left-[18%] right-[18%] h-[2px] bg-border" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Step 1 */}
                <div className="text-center space-y-4 relative">
                  <div className="mx-auto w-32 h-32 rounded-full bg-card border-2 border-border flex items-center justify-center relative z-10">
                    <MessageSquare className="w-12 h-12 text-primary" />
                  </div>
                  <div className="text-primary font-mono text-sm">01</div>
                  <h3 className="text-2xl font-semibold">Tell us what you need</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Describe the product you're looking for in plain language. Include your budget, preferences, and any
                    must-have features.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center space-y-4 relative">
                  <div className="mx-auto w-32 h-32 rounded-full bg-card border-2 border-border flex items-center justify-center relative z-10">
                    <Cpu className="w-12 h-12 text-primary" />
                  </div>
                  <div className="text-primary font-mono text-sm">02</div>
                  <h3 className="text-2xl font-semibold">AI does the research</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our AI searches multiple stores, analyzes reviews, compares specs, checks prices, and finds the best
                    deals.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center space-y-4 relative">
                  <div className="mx-auto w-32 h-32 rounded-full bg-card border-2 border-border flex items-center justify-center relative z-10">
                    <Package className="w-12 h-12 text-primary" />
                  </div>
                  <div className="text-primary font-mono text-sm">03</div>
                  <h3 className="text-2xl font-semibold">Get your recommendation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Receive a curated list of the best options with clear explanations of why each product is
                    recommended.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="container mx-auto px-4 py-24">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold">Everything you need to shop smarter</h2>
              <p className="text-xl text-muted-foreground">
                Powerful AI features that save you time and money on every purchase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Feature 1 - Smart Match Scoring */}
              <div className="p-8 rounded-2xl bg-card border border-border space-y-4 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Match Scoring</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Each product gets a personalized match score (0-100) based on how well it fits your specific needs,
                  budget, and use case.
                </p>
              </div>

              {/* Feature 2 - Deal Intelligence */}
              <div className="p-8 rounded-2xl bg-card border border-border space-y-4 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Deal Intelligence</h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI predicts price trends and tells you whether to buy now or wait, based on historical data and market
                  patterns.
                </p>
              </div>

              {/* Feature 3 - Deep Review Analysis */}
              <div className="p-8 rounded-2xl bg-card border border-border space-y-4 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Deep Review Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Natural language processing analyzes thousands of customer reviews to extract real pros, cons, and
                  hidden issues.
                </p>
              </div>

              {/* Feature 4 - Long-term Value Analysis */}
              <div className="p-8 rounded-2xl bg-card border border-border space-y-4 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Long-term Value Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Calculate cost-per-use, durability predictions, and true value to help you invest in products that
                  last.
                </p>
              </div>

              {/* Feature 5 - Multi-Store Comparison */}
              <div className="p-8 rounded-2xl bg-card border border-border space-y-4 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <SearchIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Multi-Store Comparison</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Search Amazon, eBay, Walmart, Best Buy simultaneously with real-time pricing and availability data.
                </p>
              </div>

              {/* Feature 6 - Expert-Level Guidance */}
              <div className="p-8 rounded-2xl bg-card border border-border space-y-4 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Expert-Level Guidance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get professional-grade recommendations with decision guides that help you choose the right product for
                  your situation.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-border mt-24 py-12">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Package className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-bold">ShopAI</span>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  ShopAI uses real-time product data and AI to provide honest shopping recommendations. We help you find
                  the best products at the best prices.
                </p>
                <p className="text-sm text-muted-foreground">
                  As an Amazon Associate, we earn from qualifying purchases.
                </p>
              </div>
            </div>
          </footer>
        </>
      )}
    </main>
  )
}
