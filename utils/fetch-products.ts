import * as cheerio from "cheerio"
import type { Product } from "@/types/product"

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
]

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

function cleanPrice(priceText: string): number {
  const cleaned = priceText.replace(/[^0-9.]/g, "")
  return Number.parseFloat(cleaned) || 0
}

function extractBudget(query: string): number {
  console.log("[v0] Original query for budget extraction:", query)

  // Match explicit budget phrases with dollar signs or price keywords
  const explicitBudget = query.match(/under \$?(\d+)|below \$?(\d+)|max \$?(\d+)|budget \$?(\d+)/i)
  if (explicitBudget) {
    const budget = Number.parseInt(explicitBudget[1] || explicitBudget[2] || explicitBudget[3] || explicitBudget[4])
    console.log("[v0] Extracted explicit budget:", budget)
    return budget
  }

  // Only match standalone dollar amounts (e.g., "$500" or "500 dollars")
  const dollarMatch = query.match(/\$(\d+)|(\d+)\s*dollars?/i)
  if (dollarMatch) {
    const budget = Number.parseInt(dollarMatch[1] || dollarMatch[2])
    console.log("[v0] Extracted dollar budget:", budget)
    return budget
  }

  // Default to no budget limit (Infinity means no filtering)
  console.log("[v0] No budget found, using Infinity")
  return Number.POSITIVE_INFINITY
}

function cleanQuery(query: string): string {
  const baseQuery = query.replace(/under \$?\d+|budget|best|cheap|affordable/gi, "").trim()

  // Extract budget to add price hints to search
  const budgetMatch = query.match(/under \$?(\d+)/)
  if (budgetMatch) {
    const budget = Number.parseInt(budgetMatch[1])
    // For high budgets, add price qualifier to get better results
    if (budget >= 200) {
      return baseQuery // Keep it clean for high budget searches
    }
  }

  return baseQuery
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

async function fetchAccuratePrice(asin: string, depth = 0): Promise<{ price: number; canonicalAsin: string }> {
  if (depth > 2) {
    console.log(`[v0] Max recursion depth reached for ASIN ${asin}`)
    return { price: 0, canonicalAsin: asin }
  }

  try {
    const productUrl = `https://www.amazon.com/dp/${asin}`

    const response = await fetchWithTimeout(
      productUrl,
      {
        headers: {
          "User-Agent": getRandomUserAgent(),
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          Referer: "https://www.amazon.com/",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          DNT: "1",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-User": "?1",
          "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
        },
      },
      10000,
    )

    if (!response.ok) {
      console.log(`[v0] Product page for ASIN ${asin} returned ${response.status}, skipping accurate price fetch`)
      return { price: 0, canonicalAsin: asin }
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    let canonicalAsin = asin

    const parentAsinMatch = html.match(/"parentAsin":"([A-Z0-9]{10})"/)
    if (parentAsinMatch && parentAsinMatch[1] !== asin) {
      canonicalAsin = parentAsinMatch[1]
      console.log(`[v0] Found parent ASIN ${canonicalAsin} for variant ${asin}, fetching parent price...`)

      try {
        const parentResult = await fetchAccuratePrice(canonicalAsin, depth + 1)
        // Only use parent result if it has a valid price
        if (parentResult.price > 0) {
          return parentResult
        } else {
          console.log(`[v0] Parent ASIN ${canonicalAsin} has no valid price, falling back to variant ${asin}`)
        }
      } catch (error: any) {
        console.log(
          `[v0] Failed to fetch parent ASIN ${canonicalAsin}: ${error.message}, using variant ${asin} instead`,
        )
      }
    }

    const twisterMatch = html.match(/data-dp-twister-parent-asin="([A-Z0-9]{10})"/)
    if (twisterMatch && twisterMatch[1] !== asin) {
      canonicalAsin = twisterMatch[1]
      console.log(`[v0] Found twister parent ASIN ${canonicalAsin} for variant ${asin}, fetching parent price...`)

      try {
        const parentResult = await fetchAccuratePrice(canonicalAsin, depth + 1)
        // Only use parent result if it has a valid price
        if (parentResult.price > 0) {
          return parentResult
        } else {
          console.log(`[v0] Twister parent ASIN ${canonicalAsin} has no valid price, falling back to variant ${asin}`)
        }
      } catch (error: any) {
        console.log(
          `[v0] Failed to fetch twister parent ASIN ${canonicalAsin}: ${error.message}, using variant ${asin} instead`,
        )
      }
    }

    console.log(`[v0] Debugging price elements for ASIN ${asin}:`)

    const debugSelectors = [
      "#apex_offerDisplay_desktop .a-price .a-offscreen",
      "#apex_desktop .a-price .a-offscreen",
      "#corePrice_desktop .a-price .a-offscreen",
      "#corePriceDisplay_desktop_feature_div .a-price .a-offscreen",
      ".a-price.aok-align-center .a-offscreen",
      "#priceblock_ourprice",
      "#priceblock_dealprice",
      ".a-price-whole",
    ]

    debugSelectors.forEach((sel) => {
      const elem = $(sel).first()
      if (elem.length > 0) {
        console.log(`[v0]   ${sel}: "${elem.text().trim()}"`)
      }
    })

    const allPrices: { price: number; source: string }[] = []

    const buyboxSelectors = [
      { selector: "#corePriceDisplay_desktop_feature_div .a-price .a-offscreen", name: "core_display_main" },
      { selector: "#corePrice_desktop .a-price .a-offscreen", name: "core_desktop_main" },
      { selector: ".a-price.aok-align-center.reinventPricePriceToPayMargin .a-offscreen", name: "reinvent_price" },
      { selector: "#apex_offerDisplay_desktop .a-price .a-offscreen", name: "apex_desktop_offscreen" },
      { selector: "#apex_desktop .a-price .a-offscreen", name: "apex_alt_offscreen" },
      { selector: "#price_inside_buybox", name: "classic_buybox" },
      { selector: "#priceblock_ourprice", name: "priceblock_ourprice" },
      { selector: "#priceblock_dealprice", name: "priceblock_dealprice" },
    ]

    for (const { selector, name } of buyboxSelectors) {
      const priceText = $(selector).first().text().trim()
      if (priceText) {
        const priceValue = cleanPrice(priceText)
        if (priceValue > 0) {
          allPrices.push({ price: priceValue, source: name })
        }
      }
    }

    const wholeFractionSelectors = [
      {
        whole: "#corePriceDisplay_desktop_feature_div .a-price-whole",
        fraction: "#corePriceDisplay_desktop_feature_div .a-price-fraction",
        name: "core_display_composite",
      },
      {
        whole: "#corePrice_desktop .a-price-whole",
        fraction: "#corePrice_desktop .a-price-fraction",
        name: "core_desktop_composite",
      },
      {
        whole: "#apex_offerDisplay_desktop .a-price-whole",
        fraction: "#apex_offerDisplay_desktop .a-price-fraction",
        name: "apex_composite",
      },
      {
        whole: "#apex_desktop .a-price-whole",
        fraction: "#apex_desktop .a-price-fraction",
        name: "apex_alt_composite",
      },
      {
        whole: "#corePrice_feature_div .a-price-whole",
        fraction: "#corePrice_feature_div .a-price-fraction",
        name: "core_price",
      },
    ]

    for (const { whole, fraction, name } of wholeFractionSelectors) {
      const wholeText = $(whole).first().text().trim()
      const fractionText = $(fraction).first().text().trim()
      if (wholeText) {
        const combinedPrice = wholeText + (fractionText || "00")
        const priceValue = cleanPrice(combinedPrice)
        if (priceValue > 0) {
          allPrices.push({ price: priceValue, source: name })
        }
      }
    }

    if (allPrices.length > 0) {
      // Try to find core_display or core_desktop prices first
      const corePrice = allPrices.find((p) => p.source.includes("core_display") || p.source.includes("core_desktop"))

      if (corePrice) {
        console.log(
          `[v0] Accurate price for ASIN ${asin}: $${corePrice.price} (from ${corePrice.source} - PRIMARY DISPLAY)`,
        )
        return { price: corePrice.price, canonicalAsin }
      }

      // Fallback to frequency analysis if no core price found
      const priceFrequency = new Map<number, number>()
      allPrices.forEach(({ price }) => {
        priceFrequency.set(price, (priceFrequency.get(price) || 0) + 1)
      })

      const sortedPrices = Array.from(priceFrequency.entries()).sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1]
        return b[0] - a[0]
      })

      const finalPrice = sortedPrices[0][0]
      const sources = allPrices
        .filter((p) => p.price === finalPrice)
        .map((p) => p.source)
        .join(", ")
      console.log(
        `[v0] Accurate price for ASIN ${asin}: $${finalPrice} (found ${allPrices.length} prices, most frequent from: ${sources})`,
      )
      return { price: finalPrice, canonicalAsin }
    }

    console.log(`[v0] No valid price found for ASIN ${asin}`)
    return { price: 0, canonicalAsin: asin }
  } catch (error: any) {
    console.log(`[v0] Could not fetch accurate price for ASIN ${asin}: ${error.message}`)
    return { price: 0, canonicalAsin: asin }
  }
}

async function scrapeAmazon(query: string): Promise<Product[]> {
  try {
    const maxBudget = extractBudget(query)
    const cleanQ = cleanQuery(query)

    let searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(cleanQ)}`
    if (maxBudget >= 150) {
      // Sort by price high to low for high budget queries to get premium options
      searchUrl += `&s=price-desc-rank`
    }

    const response = await fetchWithTimeout(
      searchUrl,
      {
        headers: {
          "User-Agent": getRandomUserAgent(),
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://www.google.com/",
        },
      },
      10000,
    )

    if (!response.ok) return []

    const html = await response.text()
    const $ = cheerio.load(html)

    const products: Product[] = []

    const selectors = [
      ".s-result-item[data-asin]:not([data-asin=''])",
      "div[data-component-type='s-search-result']",
      ".sg-col-inner .s-card-container",
    ]

    for (const selector of selectors) {
      $(selector).each((i, el) => {
        if (products.length >= 25) return false

        const $el = $(el)

        const asin = $el.attr("data-asin") || $el.find("[data-asin]").attr("data-asin")
        if (!asin || asin === "") return

        let title = $el.find("h2 a span").text().trim()
        if (!title) title = $el.find(".a-size-medium").text().trim()
        if (!title) title = $el.find(".a-size-base-plus").text().trim()
        if (!title || title.length < 5) return

        let price = 0
        let priceSource = ""

        const wholePrice = $el.find(".a-price-whole").first().text().trim()
        const fractionPrice = $el.find(".a-price-fraction").first().text().trim()
        if (wholePrice) {
          const combinedPrice = wholePrice + (fractionPrice || "00")
          price = cleanPrice(combinedPrice)
          priceSource = "whole+fraction"
        }

        if (price === 0) {
          const offscreenPrice = $el.find(".a-price .a-offscreen").first().text().trim()
          if (offscreenPrice) {
            price = cleanPrice(offscreenPrice)
            priceSource = "a-offscreen"
          }
        }

        if (price === 0) {
          const generalPrice = $el.find("span.a-price").first().text().trim()
          if (generalPrice) {
            price = cleanPrice(generalPrice)
            priceSource = "a-price-general"
          }
        }

        if (price === 0) {
          console.log(`[v0] Product: ${title.substring(0, 50)}... | SKIPPED - No valid price found`)
          return
        }

        console.log(`[v0] Product: ${title.substring(0, 50)}... | Price: $${price} (source: ${priceSource})`)

        if (price > maxBudget * 1.2) {
          console.log(`[v0] FILTERED OUT - Price $${price} exceeds budget $${maxBudget}`)
          return
        }

        if (maxBudget >= 150 && price < maxBudget * 0.2) {
          console.log(`[v0] FILTERED OUT - Price $${price} too low for budget $${maxBudget}`)
          return
        }

        let rating = 0
        let reviewCount = 0

        const ratingText = $el.find(".a-icon-alt").first().text().trim()
        if (ratingText) {
          const ratingMatch = ratingText.match(/(\d+\.?\d*)\s*out of/)
          if (ratingMatch) {
            rating = Number.parseFloat(ratingMatch[1])
          }
        }

        const reviewText = $el.find(".a-size-base.s-underline-text, .a-size-small .a-link-normal").first().text().trim()
        if (reviewText) {
          const reviewMatch = reviewText.match(/([\d,]+)/)
          if (reviewMatch) {
            reviewCount = Number.parseInt(reviewMatch[1].replace(/,/g, ""))
          }
        }

        const url = `https://www.amazon.com/dp/${asin}?tag=shopai0c6-20`

        const image = $el.find("img.s-image").attr("src") || $el.find("img").first().attr("src") || ""

        if (rating > 0 && reviewCount >= 10) {
          products.push({
            title,
            price,
            url,
            retailer: "Amazon",
            image,
            asin,
            rating,
            reviewCount,
          })
        }
      })

      if (products.length > 0) break
    }

    return products
  } catch (error: any) {
    console.error("[v0] Amazon scraping failed:", error.message)
    return []
  }
}

async function scrapeEbay(query: string): Promise<Product[]> {
  try {
    const maxBudget = extractBudget(query)
    const cleanQ = cleanQuery(query)
    const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(cleanQ)}&_sacat=0`

    const response = await fetchWithTimeout(
      searchUrl,
      {
        headers: {
          "User-Agent": getRandomUserAgent(),
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
      8000,
    )

    if (!response.ok) return []

    const html = await response.text()
    const $ = cheerio.load(html)

    const products: Product[] = []

    $(".s-item").each((i, el) => {
      if (products.length >= 10) return false

      const $el = $(el)
      const title = $el.find(".s-item__title").text().trim()
      if (!title || title.includes("Shop on eBay")) return

      const priceText = $el.find(".s-item__price").text().trim()
      const price = cleanPrice(priceText)
      if (price === 0 || price > maxBudget * 1.2) return

      const url = $el.find(".s-item__link").attr("href") || ""
      if (!url) return

      const image = $el.find(".s-item__image-img").attr("src") || ""

      products.push({
        title,
        price,
        url,
        retailer: "eBay",
        image,
      })
    })

    return products
  } catch (error: any) {
    console.log("[v0] eBay backup unavailable")
    return []
  }
}

function scoreProduct(product: Product): number {
  let score = 0

  if (product.rating) {
    score += (product.rating / 5) * 50
  } else {
    score += 20
  }

  if (product.reviewCount) {
    if (product.reviewCount >= 1000) score += 30
    else if (product.reviewCount >= 500) score += 25
    else if (product.reviewCount >= 100) score += 20
    else if (product.reviewCount >= 50) score += 15
    else if (product.reviewCount >= 10) score += 10
    else score += 5
  } else {
    score += 10
  }

  score += 20

  return score
}

function rankProducts(products: Product[]): Product[] {
  return products
    .map((product) => {
      let score = 0

      if (product.rating && product.rating > 0) {
        score += (product.rating / 5) * 50
      }
      // No score boost for products without ratings

      if (product.reviewCount && product.reviewCount > 0) {
        if (product.reviewCount >= 1000) score += 30
        else if (product.reviewCount >= 500) score += 25
        else if (product.reviewCount >= 100) score += 20
        else if (product.reviewCount >= 50) score += 15
        else if (product.reviewCount >= 10) score += 10
      }
      // No score boost for products without reviews

      return { product, score }
    })
    .sort((a, b) => b.score - a.score)
    .map((sp) => sp.product)
}

function selectDiverseProducts(products: Product[]): Product[] {
  if (products.length <= 10) return products

  const sortedByPrice = [...products].sort((a, b) => a.price - b.price)

  const result: Product[] = []

  const priceRange = sortedByPrice[sortedByPrice.length - 1].price - sortedByPrice[0].price

  if (priceRange > 100) {
    // Wide price range - get good distribution
    const budgetCount = Math.ceil(sortedByPrice.length * 0.25)
    result.push(...sortedByPrice.slice(0, budgetCount))

    const midStart = Math.floor(sortedByPrice.length * 0.25)
    const midEnd = Math.floor(sortedByPrice.length * 0.75)
    result.push(...sortedByPrice.slice(midStart, midEnd))

    const premiumStart = Math.floor(sortedByPrice.length * 0.75)
    result.push(...sortedByPrice.slice(premiumStart))
  } else {
    // Narrow price range - just return diverse selection
    const budgetCount = Math.ceil(sortedByPrice.length * 0.3)
    result.push(...sortedByPrice.slice(0, budgetCount))

    const midStart = Math.floor(sortedByPrice.length * 0.3)
    const midEnd = Math.floor(sortedByPrice.length * 0.7)
    result.push(...sortedByPrice.slice(midStart, midEnd))

    const premiumStart = Math.floor(sortedByPrice.length * 0.7)
    result.push(...sortedByPrice.slice(premiumStart))
  }

  return result.slice(0, 15)
}

function createFallbackQuery(originalQuery: string): string | null {
  // Extract common brand names to preserve them
  const brandKeywords = [
    "philips",
    "samsung",
    "lg",
    "sony",
    "tcl",
    "vizio",
    "hisense",
    "apple",
    "dell",
    "hp",
    "asus",
    "lenovo",
  ]
  const lowerQuery = originalQuery.toLowerCase()
  const hasBrand = brandKeywords.some((brand) => lowerQuery.includes(brand))

  // Remove very specific feature requirements that might not exist
  let fallback = originalQuery
    .replace(/with\s+\w+light/gi, "") // Remove "with AMBILIGHT" type requirements
    .replace(/with\s+\w+sync/gi, "") // Remove "with FreeSync" type requirements
    .trim()

  // Only remove "just", "but", "only" if they're NOT followed by a brand name
  if (hasBrand) {
    // Preserve brand restrictions - don't remove "just philips" or "only samsung"
    console.log("[v0] Brand detected, preserving brand requirement in fallback")
  } else {
    // No brand specified, can safely remove restrictive words
    fallback = fallback
      .replace(/just\s+/gi, "")
      .replace(/but\s+/gi, "")
      .replace(/only\s+/gi, "")
      .trim()
  }

  // If fallback is too similar to original, return null
  if (fallback.toLowerCase() === originalQuery.toLowerCase()) {
    return null
  }

  console.log(`[v0] Created fallback query: "${fallback}" (from "${originalQuery}")`)
  return fallback
}

export async function fetchProducts(query: string): Promise<Product[]> {
  try {
    console.log("[v0] Fetching products from Amazon (primary) + eBay (backup)")

    const amazonProducts = await scrapeAmazon(query)

    console.log("[v0] Amazon returned:", amazonProducts.length, "products")

    if (amazonProducts.length === 0) {
      const fallbackQuery = createFallbackQuery(query)
      if (fallbackQuery) {
        console.log(`[v0] No products found for specific query, trying fallback: "${fallbackQuery}"`)
        const fallbackProducts = await scrapeAmazon(fallbackQuery)
        console.log(`[v0] Fallback search returned: ${fallbackProducts.length} products`)

        if (fallbackProducts.length > 0) {
          // Continue with fallback products
          const rankedProducts = rankProducts(fallbackProducts)
          const diverseProducts = selectDiverseProducts(rankedProducts)

          console.log(`[v0] Verifying accurate prices for all ${diverseProducts.length} products...`)
          for (let i = 0; i < diverseProducts.length; i++) {
            const product = diverseProducts[i]
            if (product.asin) {
              const originalAsin = product.asin
              const { price: accuratePrice, canonicalAsin } = await fetchAccuratePrice(product.asin)

              if (canonicalAsin !== product.asin && accuratePrice > 0) {
                console.log(`[v0] Updating ASIN ${product.asin} to parent ASIN ${canonicalAsin}`)
                product.asin = canonicalAsin
                product.url = `https://www.amazon.com/dp/${canonicalAsin}?tag=shopai0c6-20`
              }

              if (accuratePrice > 0) {
                product.price = accuratePrice
              }

              await new Promise((resolve) => setTimeout(resolve, 300))
            }
          }

          console.log(`[v0] Returning ${diverseProducts.length} unique products`)
          return diverseProducts
        }
      }
    }

    if (amazonProducts.length >= 10) {
      const rankedProducts = rankProducts(amazonProducts)
      const diverseProducts = selectDiverseProducts(rankedProducts)

      console.log(`[v0] Verifying accurate prices for all ${diverseProducts.length} products...`)
      for (let i = 0; i < diverseProducts.length; i++) {
        const product = diverseProducts[i]
        if (product.asin) {
          const originalAsin = product.asin
          const { price: accuratePrice, canonicalAsin } = await fetchAccuratePrice(product.asin)

          if (canonicalAsin !== product.asin && accuratePrice > 0) {
            console.log(`[v0] Updating ASIN ${product.asin} to parent ASIN ${canonicalAsin}`)
            product.asin = canonicalAsin
            product.url = `https://www.amazon.com/dp/${canonicalAsin}?tag=shopai0c6-20`
          }

          if (accuratePrice > 0) {
            product.price = accuratePrice
          }

          await new Promise((resolve) => setTimeout(resolve, 300))
        }
      }

      console.log(`[v0] Returning ${diverseProducts.length} unique products`)
      return diverseProducts
    }

    console.log("[v0] Getting eBay backup products...")
    const ebayProducts = await scrapeEbay(query)
    console.log("[v0] eBay returned:", ebayProducts.length, "products")

    const allProducts = [...amazonProducts, ...ebayProducts]

    const uniqueProducts = Array.from(new Map(allProducts.map((p) => [p.title.toLowerCase(), p])).values())

    if (uniqueProducts.length === 0) {
      console.log("[v0] No products found from any source")
      return []
    }

    console.log(`[v0] Returning ${uniqueProducts.length} unique products`)
    return uniqueProducts
  } catch (error: any) {
    console.error("[v0] Product fetching failed:", error.message)
    return []
  }
}
