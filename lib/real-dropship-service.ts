// Real Dropship Service Integration
// Connects to actual print-on-demand services for real products

export interface RealProduct {
  id: string
  name: string
  category: string
  basePrice: number
  image: string
  description: string
  features: string[]
  sizes?: string[]
  colors?: string[]
  provider: 'printful' | 'gooten' | 'customink'
  providerId: string
  inStock: boolean
  estimatedShipping: string
  nmbrIntegration: boolean
}

export interface OrderRequest {
  productId: string
  quantity: number
  customization: {
    design: string
    text?: string
    colors?: string[]
    size?: string
  }
  nmbrCode?: string
  shippingAddress: {
    name: string
    address1: string
    address2?: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export interface OrderResponse {
  success: boolean
  orderId?: string
  trackingNumber?: string
  estimatedDelivery?: string
  totalCost: number
  error?: string
}

class RealDropshipService {
  private static instance: RealDropshipService
  private printfulApiKey: string | null = null
  private gootenApiKey: string | null = null
  private customInkApiKey: string | null = null

  constructor() {
    this.initializeProviders()
  }

  static getInstance(): RealDropshipService {
    if (!RealDropshipService.instance) {
      RealDropshipService.instance = new RealDropshipService()
    }
    return RealDropshipService.instance
  }

  private initializeProviders() {
    // In production, these would come from environment variables
    this.printfulApiKey = process.env.PRINTFUL_API_KEY || null
    this.gootenApiKey = process.env.GOOTEN_API_KEY || null
    this.customInkApiKey = process.env.CUSTOMINK_API_KEY || null
  }

  // Get real products from connected providers
  async getRealProducts(category?: string): Promise<RealProduct[]> {
    const products: RealProduct[] = []

    // Printful Integration (if API key available)
    if (this.printfulApiKey) {
      try {
        const printfulProducts = await this.fetchPrintfulProducts(category)
        products.push(...printfulProducts)
      } catch (error) {
        console.warn('Printful integration failed:', error)
      }
    }

    // Gooten Integration (if API key available)
    if (this.gootenApiKey) {
      try {
        const gootenProducts = await this.fetchGootenProducts(category)
        products.push(...gootenProducts)
      } catch (error) {
        console.warn('Gooten integration failed:', error)
      }
    }

    // CustomInk Integration (if API key available)
    if (this.customInkApiKey) {
      try {
        const customInkProducts = await this.fetchCustomInkProducts(category)
        products.push(...customInkProducts)
      } catch (error) {
        console.warn('CustomInk integration failed:', error)
      }
    }

    // If no real integrations available, return demo products with clear labeling
    if (products.length === 0) {
      return this.getDemoProducts(category)
    }

    return products
  }

  private async fetchPrintfulProducts(category?: string): Promise<RealProduct[]> {
    // Real Printful API integration
    const response = await fetch('https://api.printful.com/products', {
      headers: {
        'Authorization': `Bearer ${this.printfulApiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.result.map((product: any) => ({
      id: `printful-${product.id}`,
      name: product.name,
      category: this.mapPrintfulCategory(product.type),
      basePrice: product.base_price,
      image: product.thumbnail_url,
      description: product.description || 'High-quality product from Printful',
      features: ['Printful quality', 'Fast shipping', 'NMBR code ready'],
      sizes: product.sizes || [],
      colors: product.colors || [],
      provider: 'printful' as const,
      providerId: product.id.toString(),
      inStock: true,
      estimatedShipping: '3-7 business days',
      nmbrIntegration: true
    }))
  }

  private async fetchGootenProducts(category?: string): Promise<RealProduct[]> {
    // Real Gooten API integration
    const response = await fetch('https://api.gooten.com/v1/products', {
      headers: {
        'Authorization': `Bearer ${this.gootenApiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Gooten API error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.products.map((product: any) => ({
      id: `gooten-${product.id}`,
      name: product.name,
      category: this.mapGootenCategory(product.category),
      basePrice: product.base_price,
      image: product.image_url,
      description: product.description || 'Quality product from Gooten',
      features: ['Gooten quality', 'Global shipping', 'NMBR code ready'],
      sizes: product.sizes || [],
      colors: product.colors || [],
      provider: 'gooten' as const,
      providerId: product.id.toString(),
      inStock: true,
      estimatedShipping: '5-10 business days',
      nmbrIntegration: true
    }))
  }

  private async fetchCustomInkProducts(category?: string): Promise<RealProduct[]> {
    // Real CustomInk API integration
    const response = await fetch('https://api.customink.com/v1/products', {
      headers: {
        'Authorization': `Bearer ${this.customInkApiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`CustomInk API error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.products.map((product: any) => ({
      id: `customink-${product.id}`,
      name: product.name,
      category: this.mapCustomInkCategory(product.category),
      basePrice: product.base_price,
      image: product.image_url,
      description: product.description || 'Custom product from CustomInk',
      features: ['CustomInk quality', 'Custom designs', 'NMBR code ready'],
      sizes: product.sizes || [],
      colors: product.colors || [],
      provider: 'customink' as const,
      providerId: product.id.toString(),
      inStock: true,
      estimatedShipping: '7-14 business days',
      nmbrIntegration: true
    }))
  }

  private getDemoProducts(category?: string): RealProduct[] {
    // Demo products with clear labeling that they're not real
    const demoProducts: RealProduct[] = [
      {
        id: 'demo-tshirt',
        name: 'Classic T-Shirt (Demo)',
        category: 'apparel',
        basePrice: 12.99,
        image: 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=T-Shirt+Demo',
        description: 'Demo product - Connect dropship services to see real products',
        features: ['Demo product', 'Connect real services', 'NMBR code ready'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Navy', 'Red'],
        provider: 'printful',
        providerId: 'demo',
        inStock: false,
        estimatedShipping: 'Not available',
        nmbrIntegration: true
      },
      {
        id: 'demo-mug',
        name: 'Ceramic Mug (Demo)',
        category: 'drinkware',
        basePrice: 8.99,
        image: 'https://via.placeholder.com/300x300/059669/FFFFFF?text=Mug+Demo',
        description: 'Demo product - Connect dropship services to see real products',
        features: ['Demo product', 'Connect real services', 'NMBR code ready'],
        colors: ['White', 'Black', 'Blue'],
        provider: 'gooten',
        providerId: 'demo',
        inStock: false,
        estimatedShipping: 'Not available',
        nmbrIntegration: true
      }
    ]

    return category ? demoProducts.filter(p => p.category === category) : demoProducts
  }

  private mapPrintfulCategory(type: string): string {
    const mapping: { [key: string]: string } = {
      't-shirt': 'apparel',
      'hoodie': 'apparel',
      'tank-top': 'apparel',
      'mug': 'drinkware',
      'poster': 'office',
      'sticker': 'accessories'
    }
    return mapping[type] || 'accessories'
  }

  private mapGootenCategory(category: string): string {
    const mapping: { [key: string]: string } = {
      'apparel': 'apparel',
      'drinkware': 'drinkware',
      'office': 'office',
      'accessories': 'accessories'
    }
    return mapping[category] || 'accessories'
  }

  private mapCustomInkCategory(category: string): string {
    const mapping: { [key: string]: string } = {
      'apparel': 'apparel',
      'drinkware': 'drinkware',
      'office': 'office',
      'accessories': 'accessories'
    }
    return mapping[category] || 'accessories'
  }

  // Place a real order
  async placeOrder(request: OrderRequest): Promise<OrderResponse> {
    const product = await this.getProductById(request.productId)
    
    if (!product) {
      return {
        success: false,
        totalCost: 0,
        error: 'Product not found'
      }
    }

    if (!product.inStock) {
      return {
        success: false,
        totalCost: 0,
        error: 'Product not available for ordering'
      }
    }

    // Route to appropriate provider
    switch (product.provider) {
      case 'printful':
        return this.placePrintfulOrder(request, product)
      case 'gooten':
        return this.placeGootenOrder(request, product)
      case 'customink':
        return this.placeCustomInkOrder(request, product)
      default:
        return {
          success: false,
          totalCost: 0,
          error: 'Provider not supported'
        }
    }
  }

  private async getProductById(productId: string): Promise<RealProduct | null> {
    const products = await this.getRealProducts()
    return products.find(p => p.id === productId) || null
  }

  private async placePrintfulOrder(request: OrderRequest, product: RealProduct): Promise<OrderResponse> {
    // Real Printful order API call
    try {
      const response = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.printfulApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          external_id: `nmbr-${Date.now()}`,
          shipping: request.shippingAddress,
          items: [{
            variant_id: product.providerId,
            quantity: request.quantity,
            files: [{
              type: 'default',
              url: request.customization.design
            }]
          }]
        })
      })

      const data = await response.json()
      
      return {
        success: true,
        orderId: data.result.id.toString(),
        trackingNumber: data.result.shipments?.[0]?.tracking_number,
        estimatedDelivery: data.result.shipments?.[0]?.estimated_delivery,
        totalCost: data.result.total
      }
    } catch (error) {
      return {
        success: false,
        totalCost: 0,
        error: `Printful order failed: ${error}`
      }
    }
  }

  private async placeGootenOrder(request: OrderRequest, product: RealProduct): Promise<OrderResponse> {
    // Real Gooten order API call
    try {
      const response = await fetch('https://api.gooten.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.gootenApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [{
            product_id: product.providerId,
            quantity: request.quantity,
            customization: request.customization
          }],
          shipping_address: request.shippingAddress
        })
      })

      const data = await response.json()
      
      return {
        success: true,
        orderId: data.order_id,
        trackingNumber: data.tracking_number,
        estimatedDelivery: data.estimated_delivery,
        totalCost: data.total_cost
      }
    } catch (error) {
      return {
        success: false,
        totalCost: 0,
        error: `Gooten order failed: ${error}`
      }
    }
  }

  private async placeCustomInkOrder(request: OrderRequest, product: RealProduct): Promise<OrderResponse> {
    // Real CustomInk order API call
    try {
      const response = await fetch('https://api.customink.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.customInkApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: product.providerId,
          quantity: request.quantity,
          customization: request.customization,
          shipping_address: request.shippingAddress
        })
      })

      const data = await response.json()
      
      return {
        success: true,
        orderId: data.order_id,
        trackingNumber: data.tracking_number,
        estimatedDelivery: data.estimated_delivery,
        totalCost: data.total_cost
      }
    } catch (error) {
      return {
        success: false,
        totalCost: 0,
        error: `CustomInk order failed: ${error}`
      }
    }
  }

  // Get integration status
  getIntegrationStatus(): { provider: string; connected: boolean; productsAvailable: number }[] {
    return [
      {
        provider: 'Printful',
        connected: !!this.printfulApiKey,
        productsAvailable: this.printfulApiKey ? 1000 : 0
      },
      {
        provider: 'Gooten',
        connected: !!this.gootenApiKey,
        productsAvailable: this.gootenApiKey ? 500 : 0
      },
      {
        provider: 'CustomInk',
        connected: !!this.customInkApiKey,
        productsAvailable: this.customInkApiKey ? 200 : 0
      }
    ]
  }
}

export const realDropshipService = RealDropshipService.getInstance()
