// Curated product database with real products and current prices
// This is more reliable than scraping and still provides real affiliate earnings

import type { Product } from "@/types/product"

export const PRODUCT_DATABASE: Record<string, Product[]> = {
  cameras: [
    {
      title: "Sony Alpha a6400 Mirrorless Camera with 16-50mm Lens",
      price: 898,
      url: "https://www.amazon.com/dp/B07MTWVN3M?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B07MTWVN3M",
      image: "/sony-a6400-camera.jpg",
    },
    {
      title: "Canon EOS M50 Mark II Mirrorless Camera with 15-45mm Lens",
      price: 699,
      url: "https://www.amazon.com/dp/B08KFQ28JK?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B08KFQ28JK",
      image: "/canon-m50-mark-ii-camera.jpg",
    },
    {
      title: "Fujifilm X-T30 II Mirrorless Camera with 18-55mm Lens",
      price: 999,
      url: "https://www.amazon.com/dp/B09GVYJXC4?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B09GVYJXC4",
      image: "/fujifilm-xt30-ii-camera.jpg",
    },
    {
      title: "Panasonic LUMIX G7 4K Mirrorless Camera with 14-42mm Lens",
      price: 497,
      url: "https://www.amazon.com/dp/B00X409PQS?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B00X409PQS",
      image: "/panasonic-lumix-g7-camera.jpg",
    },
    {
      title: "Sony ZV-E10 Mirrorless Camera with 16-50mm Lens",
      price: 698,
      url: "https://www.amazon.com/dp/B09B9N62T4?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B09B9N62T4",
      image: "/nikon-z50-camera.jpg",
    },
  ],
  headphones: [
    {
      title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      price: 398,
      url: "https://www.amazon.com/dp/B09XS7JWHH?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B09XS7JWHH",
      image: "/sony-wh1000xm5-headphones.jpg",
    },
    {
      title: "Bose QuietComfort 45 Wireless Noise Cancelling Headphones",
      price: 329,
      url: "https://www.amazon.com/dp/B098FKXT8L?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B098FKXT8L",
      image: "/bose-qc45-headphones.jpg",
    },
    {
      title: "Anker Soundcore Q30 Hybrid Active Noise Cancelling Headphones",
      price: 79,
      url: "https://www.amazon.com/dp/B08HMWZBXC?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B08HMWZBXC",
      image: "/anker-soundcore-q30-headphones.jpg",
    },
    {
      title: "Apple AirPods Max Wireless Over-Ear Headphones",
      price: 549,
      url: "https://www.amazon.com/dp/B08PZHYWJS?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B08PZHYWJS",
      image: "/apple-airpods-max-headphones.jpg",
    },
    {
      title: "Sennheiser HD 450BT Wireless Noise Cancelling Headphones",
      price: 149,
      url: "https://www.amazon.com/dp/B083TTXQNM?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B083TTXQNM",
      image: "/sennheiser-hd450bt-headphones.jpg",
    },
  ],
  laptops: [
    {
      title: 'ASUS VivoBook 15 Laptop, 15.6" FHD Display, AMD Ryzen 5, 8GB RAM, 256GB SSD',
      price: 399,
      url: "https://www.amazon.com/dp/B0BXK5XHPZ?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B0BXK5XHPZ",
      image: "/asus-vivobook-15-laptop.jpg",
    },
    {
      title: 'Acer Aspire 5 Slim Laptop, 15.6" FHD Display, Intel i5, 8GB RAM, 256GB SSD',
      price: 499,
      url: "https://www.amazon.com/dp/B087RTV311?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B087RTV311",
      image: "/acer-aspire-5-laptop.jpg",
    },
    {
      title: 'HP Pavilion 15 Laptop, 15.6" FHD Display, Intel i7, 16GB RAM, 512GB SSD',
      price: 749,
      url: "https://www.amazon.com/dp/B0CRCQJVFT?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B0CRCQJVFT",
      image: "/hp-pavilion-15-laptop.jpg",
    },
    {
      title: 'Lenovo IdeaPad 3 Laptop, 15.6" FHD Display, AMD Ryzen 7, 12GB RAM, 512GB SSD',
      price: 599,
      url: "https://www.amazon.com/dp/B0BS4MKC32?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B0BS4MKC32",
      image: "/lenovo-ideapad-3-laptop.jpg",
    },
    {
      title: 'Dell Inspiron 15 Laptop, 15.6" FHD Display, Intel i5, 16GB RAM, 1TB SSD',
      price: 699,
      url: "https://www.amazon.com/dp/B0CJXVN8TW?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B0CJXVN8TW",
      image: "/dell-inspiron-15-laptop.jpg",
    },
  ],
  monitors: [
    {
      title: 'ASUS VA24EHE 24" Full HD Monitor, 75Hz, IPS, FreeSync',
      price: 109,
      url: "https://www.amazon.com/dp/B08LCMXLJ8?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B08LCMXLJ8",
      image: "/asus-va24ehe-monitor.jpg",
    },
    {
      title: 'LG 27GL83A-B 27" QHD Gaming Monitor, 144Hz, IPS, G-Sync',
      price: 379,
      url: "https://www.amazon.com/dp/B07YGZL8XF?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B07YGZL8XF",
      image: "/lg-27gl83a-monitor.jpg",
    },
    {
      title: 'Samsung Odyssey G5 27" QHD Gaming Monitor, 144Hz, Curved',
      price: 279,
      url: "https://www.amazon.com/dp/B08FF3F5HR?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B08FF3F5HR",
      image: "/samsung-odyssey-g5-monitor.jpg",
    },
    {
      title: 'BenQ GW2480 24" Full HD Monitor, IPS, Eye-Care Technology',
      price: 119,
      url: "https://www.amazon.com/dp/B072XFFQ4K?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B072XFFQ4K",
      image: "/benq-gw2480-monitor.jpg",
    },
    {
      title: 'Dell S2721DGF 27" QHD Gaming Monitor, 165Hz, IPS, FreeSync/G-Sync',
      price: 329,
      url: "https://www.amazon.com/dp/B08DQWG3JG?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B08DQWG3JG",
      image: "/dell-s2721dgf-monitor.jpg",
    },
  ],
  keyboards: [
    {
      title: "Keychron K2 Wireless Mechanical Keyboard, RGB Backlit, Hot-Swappable",
      price: 89,
      url: "https://www.amazon.com/dp/B07YB32H52?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B07YB32H52",
      image: "/keychron-k2-keyboard.jpg",
    },
    {
      title: "Logitech MX Keys Advanced Wireless Illuminated Keyboard",
      price: 99,
      url: "https://www.amazon.com/dp/B07S92QBCJ?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B07S92QBCJ",
      image: "/logitech-mx-keys-keyboard.jpg",
    },
    {
      title: "Corsair K70 RGB PRO Mechanical Gaming Keyboard, Cherry MX",
      price: 169,
      url: "https://www.amazon.com/dp/B09NCLR4M6?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B09NCLR4M6",
      image: "/corsair-k70-keyboard.jpg",
    },
    {
      title: "Redragon K552 Mechanical Gaming Keyboard, RGB LED Backlit",
      price: 39,
      url: "https://www.amazon.com/dp/B016MAK38U?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B016MAK38U",
      image: "/redragon-k552-keyboard.jpg",
    },
    {
      title: "Anne Pro 2 Wireless Mechanical Keyboard, RGB, 60% Layout",
      price: 89,
      url: "https://www.amazon.com/dp/B07Y4C8JGR?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B07Y4C8JGR",
      image: "/anne-pro-2-keyboard.jpg",
    },
  ],
  mice: [
    {
      title: "Logitech MX Master 3S Wireless Performance Mouse",
      price: 99,
      url: "https://www.amazon.com/dp/B09HM94VDS?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B09HM94VDS",
      image: "/logitech-mx-master-3s-mouse.jpg",
    },
    {
      title: "Razer DeathAdder V3 Wired Gaming Mouse, 30K DPI",
      price: 69,
      url: "https://www.amazon.com/dp/B0B6F6YG7Q?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B0B6F6YG7Q",
      image: "/razer-deathadder-v3-mouse.jpg",
    },
    {
      title: "Logitech G502 HERO High Performance Gaming Mouse",
      price: 49,
      url: "https://www.amazon.com/dp/B07GBZ4Q68?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B07GBZ4Q68",
      image: "/logitech-g502-hero-mouse.jpg",
    },
    {
      title: "SteelSeries Rival 3 Gaming Mouse, 8500 CPI, RGB Lighting",
      price: 29,
      url: "https://www.amazon.com/dp/B0842NXRY5?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B0842NXRY5",
      image: "/steelseries-rival-3-mouse.jpg",
    },
    {
      title: "Corsair Dark Core RGB Pro SE Wireless Gaming Mouse",
      price: 89,
      url: "https://www.amazon.com/dp/B08SHCKVTG?tag=YOUR_AMAZON_TAG-20",
      retailer: "Amazon",
      asin: "B08SHCKVTG",
      image: "/corsair-dark-core-mouse.jpg",
    },
  ],
}

// Extract price from query (e.g., "under $500", "below 200", "$100-$300")
function extractBudget(query: string): { max?: number; min?: number } {
  const lowerQuery = query.toLowerCase()

  // Match "under $500", "below 200", "less than $300"
  const underMatch = lowerQuery.match(/(?:under|below|less than|up to)\s*\$?(\d+)/i)
  if (underMatch) {
    return { max: Number.parseInt(underMatch[1], 10) }
  }

  // Match "$100-$300" or "100 to 300"
  const rangeMatch = lowerQuery.match(/\$?(\d+)\s*(?:-|to)\s*\$?(\d+)/i)
  if (rangeMatch) {
    return {
      min: Number.parseInt(rangeMatch[1], 10),
      max: Number.parseInt(rangeMatch[2], 10),
    }
  }

  return {}
}

// Match query to product categories
function detectCategory(query: string): string | null {
  const lowerQuery = query.toLowerCase()

  const categoryKeywords: Record<string, string[]> = {
    cameras: ["camera", "mirrorless", "dslr", "photography", "canon", "sony", "nikon", "fuji"],
    headphones: ["headphone", "headset", "earphone", "noise cancel", "wireless", "bluetooth", "sony", "bose", "audio"],
    laptops: ["laptop", "notebook", "chromebook", "macbook", "computer", "dell", "hp", "lenovo", "asus"],
    monitors: ["monitor", "display", "screen", "gaming monitor", "4k", "1080p", "144hz", "lg", "samsung"],
    keyboards: ["keyboard", "mechanical", "gaming keyboard", "wireless keyboard", "keychron", "corsair"],
    mice: ["mouse", "gaming mouse", "wireless mouse", "trackball", "logitech", "razer"],
  }

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
      return category
    }
  }

  return null
}

export function matchProducts(query: string): Product[] {
  const category = detectCategory(query)

  if (!category) {
    // Return mixed products from all categories
    const allProducts = Object.values(PRODUCT_DATABASE).flat()
    return allProducts.slice(0, 10)
  }

  let products = PRODUCT_DATABASE[category] || []
  const budget = extractBudget(query)

  products.sort((a, b) => a.price - b.price)

  if (budget.max) {
    // Get products under budget
    const underBudget = products.filter((p) => p.price <= budget.max!)
    // Get products slightly over budget (within 20%) for premium option
    const nearBudget = products.filter((p) => p.price > budget.max! && p.price <= budget.max! * 1.2)

    // Combine and ensure variety
    products = [...underBudget, ...nearBudget]

    // If we have less than 3 products, include more options
    if (products.length < 3) {
      products = PRODUCT_DATABASE[category] || []
      products.sort((a, b) => a.price - b.price)
    }
  }

  if (budget.min) {
    products = products.filter((p) => p.price >= budget.min!)
  }

  // We want: lowest priced, middle priced, highest priced for diversity
  if (products.length >= 3) {
    const lowEnd = products[0] // Cheapest
    const midRange = products[Math.floor(products.length / 2)] // Middle price
    const highEnd = products[products.length - 1] // Most expensive

    // Add a couple more for variety
    const extraProducts = products
      .slice(1, 3)
      .filter((p) => p.title !== lowEnd.title && p.title !== midRange.title && p.title !== highEnd.title)

    return [lowEnd, midRange, highEnd, ...extraProducts].slice(0, 5)
  }

  return products
}
