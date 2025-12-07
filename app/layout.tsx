import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopAI – The only shopping AI that never lies about price",
  description:
    "Get honest product recommendations with real prices, actual pros and cons, and direct buy links. Powered by AI and real-time product data.",
  keywords: ["shopping", "AI", "product recommendations", "price comparison", "honest reviews"],
  openGraph: {
    title: "ShopAI – The only shopping AI that never lies about price",
    description: "Get honest product recommendations with real prices, actual pros and cons, and direct buy links.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' fontSize='90'>🛍️</text></svg>",
      },
    ],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
