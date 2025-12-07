export interface Product {
  title: string
  price: number
  url: string
  retailer: string
  asin?: string
  image?: string
  rating?: number
  reviewCount?: number
}

export interface AIRecommendation {
  markdown: string
  products: Product[]
}
