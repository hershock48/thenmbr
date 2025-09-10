// Product Template Library for NMBR Marketplace
// Generic, customizable templates that nonprofits can use

export interface ProductTemplate {
  id: string
  name: string
  category: 'apparel' | 'drinkware' | 'accessories' | 'office' | 'events'
  subcategory: string
  price: number
  description: string
  features: string[]
  specifications: {
    material?: string
    size?: string
    color?: string
    weight?: string
    dimensions?: string
  }
  nmbrIntegration: {
    placement: 'front' | 'back' | 'bottom' | 'side' | 'custom'
    size: 'small' | 'medium' | 'large'
    callToAction: string
  }
  designAreas: {
    front: { width: number; height: number; position: string }
    back?: { width: number; height: number; position: string }
    left?: { width: number; height: number; position: string }
    right?: { width: number; height: number; position: string }
  }
  colors: string[]
  sizes?: string[]
  rating: number
  reviews: number
  bestseller: boolean
  nmbrReady: boolean
  dropshipPartner: 'printful' | 'gooten' | 'customink'
  estimatedFulfillment: string
  minimumOrder: number
  bulkDiscounts: {
    quantity: number
    discount: number
  }[]
}

export const productTemplates: ProductTemplate[] = [
  // APPAREL
  {
    id: 'tshirt-unisex-basic',
    name: 'Unisex Basic T-Shirt',
    category: 'apparel',
    subcategory: 't-shirts',
    price: 12.99,
    description: '100% cotton, comfortable fit for any cause',
    features: [
      '100% cotton construction',
      'Pre-shrunk fabric',
      'NMBR code integration',
      'Customizable design area',
      'Machine washable'
    ],
    specifications: {
      material: '100% Cotton',
      weight: '5.3 oz',
      dimensions: 'Various sizes available'
    },
    nmbrIntegration: {
      placement: 'back',
      size: 'medium',
      callToAction: 'Scan to see your impact'
    },
    designAreas: {
      front: { width: 12, height: 16, position: 'center' },
      back: { width: 12, height: 16, position: 'center' }
    },
    colors: ['White', 'Black', 'Navy', 'Gray', 'Red', 'Blue', 'Green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.8,
    reviews: 124,
    bestseller: true,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '2-7 days',
    minimumOrder: 1,
    bulkDiscounts: [
      { quantity: 10, discount: 5 },
      { quantity: 25, discount: 10 },
      { quantity: 50, discount: 15 }
    ]
  },
  {
    id: 'hoodie-unisex-pullover',
    name: 'Unisex Pullover Hoodie',
    category: 'apparel',
    subcategory: 'hoodies',
    price: 24.99,
    description: 'Warm, comfortable hoodie perfect for events and daily wear',
    features: [
      '80% cotton, 20% polyester',
      'Kangaroo pocket',
      'Drawstring hood',
      'NMBR code on back',
      'Machine washable'
    ],
    specifications: {
      material: '80% Cotton, 20% Polyester',
      weight: '8.5 oz',
      dimensions: 'Various sizes available'
    },
    nmbrIntegration: {
      placement: 'back',
      size: 'large',
      callToAction: 'Scan to follow our impact'
    },
    designAreas: {
      front: { width: 12, height: 16, position: 'center' },
      back: { width: 12, height: 16, position: 'center' }
    },
    colors: ['Black', 'Navy', 'Gray', 'Charcoal', 'Forest Green'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.9,
    reviews: 89,
    bestseller: true,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '3-7 days',
    minimumOrder: 1,
    bulkDiscounts: [
      { quantity: 10, discount: 8 },
      { quantity: 25, discount: 12 },
      { quantity: 50, discount: 18 }
    ]
  },
  {
    id: 'tank-top-women',
    name: 'Women\'s Tank Top',
    category: 'apparel',
    subcategory: 'tank-tops',
    price: 14.99,
    description: 'Lightweight tank top perfect for summer events',
    features: [
      '100% cotton',
      'Ribbed knit',
      'NMBR code on back',
      'Slim fit',
      'Machine washable'
    ],
    specifications: {
      material: '100% Cotton',
      weight: '4.2 oz',
      dimensions: 'Various sizes available'
    },
    nmbrIntegration: {
      placement: 'back',
      size: 'medium',
      callToAction: 'Scan to see your impact'
    },
    designAreas: {
      front: { width: 10, height: 12, position: 'center' },
      back: { width: 10, height: 12, position: 'center' }
    },
    colors: ['White', 'Black', 'Navy', 'Pink', 'Coral', 'Mint'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    rating: 4.7,
    reviews: 67,
    bestseller: false,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '2-7 days',
    minimumOrder: 1,
    bulkDiscounts: [
      { quantity: 10, discount: 5 },
      { quantity: 25, discount: 10 },
      { quantity: 50, discount: 15 }
    ]
  },

  // DRINKWARE
  {
    id: 'mug-ceramic-white',
    name: 'White Ceramic Mug',
    category: 'drinkware',
    subcategory: 'mugs',
    price: 8.99,
    description: '11oz ceramic mug with full-wrap design area',
    features: [
      'Dishwasher safe',
      'Microwave safe',
      'NMBR code on bottom',
      'Full-wrap design',
      'Comfortable handle'
    ],
    specifications: {
      material: 'Ceramic',
      weight: '1.2 lbs',
      dimensions: '4.5" x 3.5" x 3.5"'
    },
    nmbrIntegration: {
      placement: 'bottom',
      size: 'small',
      callToAction: 'Scan to see your impact'
    },
    designAreas: {
      front: { width: 8.5, height: 3.5, position: 'center' },
      back: { width: 8.5, height: 3.5, position: 'center' }
    },
    colors: ['White'],
    rating: 4.9,
    reviews: 156,
    bestseller: true,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '2-5 days',
    minimumOrder: 1,
    bulkDiscounts: [
      { quantity: 10, discount: 10 },
      { quantity: 25, discount: 15 },
      { quantity: 50, discount: 20 }
    ]
  },
  {
    id: 'water-bottle-insulated',
    name: 'Insulated Water Bottle',
    category: 'drinkware',
    subcategory: 'water-bottles',
    price: 15.99,
    description: '20oz insulated stainless steel bottle',
    features: [
      'Keeps cold 24hrs, hot 12hrs',
      'Leak-proof lid',
      'NMBR code on side',
      'BPA-free',
      'Dishwasher safe'
    ],
    specifications: {
      material: 'Stainless Steel',
      weight: '0.8 lbs',
      dimensions: '10.5" x 2.8"'
    },
    nmbrIntegration: {
      placement: 'side',
      size: 'medium',
      callToAction: 'Scan to follow our impact'
    },
    designAreas: {
      front: { width: 6, height: 8, position: 'center' },
      back: { width: 6, height: 8, position: 'center' }
    },
    colors: ['White', 'Black', 'Navy', 'Forest Green', 'Rose Gold'],
    rating: 4.9,
    reviews: 203,
    bestseller: true,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '3-7 days',
    minimumOrder: 1,
    bulkDiscounts: [
      { quantity: 10, discount: 8 },
      { quantity: 25, discount: 12 },
      { quantity: 50, discount: 18 }
    ]
  },
  {
    id: 'tumbler-20oz',
    name: '20oz Tumbler',
    category: 'drinkware',
    subcategory: 'tumblers',
    price: 12.99,
    description: 'Double-wall insulated tumbler with lid',
    features: [
      'Double-wall insulation',
      'Leak-proof lid',
      'NMBR code on side',
      'BPA-free',
      'Hand wash recommended'
    ],
    specifications: {
      material: 'Stainless Steel',
      weight: '0.6 lbs',
      dimensions: '7.5" x 3"'
    },
    nmbrIntegration: {
      placement: 'side',
      size: 'medium',
      callToAction: 'Scan to see your impact'
    },
    designAreas: {
      front: { width: 5, height: 6, position: 'center' },
      back: { width: 5, height: 6, position: 'center' }
    },
    colors: ['White', 'Black', 'Navy', 'Pink', 'Mint'],
    rating: 4.8,
    reviews: 134,
    bestseller: false,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '2-5 days',
    minimumOrder: 1,
    bulkDiscounts: [
      { quantity: 10, discount: 8 },
      { quantity: 25, discount: 12 },
      { quantity: 50, discount: 18 }
    ]
  },

  // ACCESSORIES
  {
    id: 'sticker-vinyl-pack',
    name: 'Vinyl Sticker Pack',
    category: 'accessories',
    subcategory: 'stickers',
    price: 4.99,
    description: 'Set of 10 weatherproof vinyl stickers',
    features: [
      'Weatherproof vinyl',
      'Multiple designs',
      'Easy application',
      'NMBR code on each sticker',
      'Various sizes'
    ],
    specifications: {
      material: 'Vinyl',
      weight: '0.1 lbs',
      dimensions: 'Various sizes (1"-3")'
    },
    nmbrIntegration: {
      placement: 'front',
      size: 'small',
      callToAction: 'Scan to see impact'
    },
    designAreas: {
      front: { width: 2, height: 2, position: 'center' }
    },
    colors: ['White', 'Transparent'],
    rating: 4.7,
    reviews: 89,
    bestseller: false,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '1-3 days',
    minimumOrder: 1,
    bulkDiscounts: [
      { quantity: 10, discount: 15 },
      { quantity: 25, discount: 25 },
      { quantity: 50, discount: 35 }
    ]
  },
  {
    id: 'tote-bag-cotton',
    name: 'Cotton Tote Bag',
    category: 'accessories',
    subcategory: 'bags',
    price: 9.99,
    description: 'Eco-friendly cotton tote bag with large design area',
    features: [
      '100% cotton',
      'Reinforced handles',
      'Large design area',
      'NMBR code on front',
      'Machine washable'
    ],
    specifications: {
      material: '100% Cotton',
      weight: '0.3 lbs',
      dimensions: '15" x 15" x 3"'
    },
    nmbrIntegration: {
      placement: 'front',
      size: 'medium',
      callToAction: 'Scan to see your impact'
    },
    designAreas: {
      front: { width: 12, height: 12, position: 'center' },
      back: { width: 12, height: 12, position: 'center' }
    },
    colors: ['Natural', 'Black', 'Navy', 'Forest Green', 'Burgundy'],
    rating: 4.8,
    reviews: 112,
    bestseller: true,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '2-5 days',
    minimumOrder: 1,
    bulkDiscounts: [
      { quantity: 10, discount: 10 },
      { quantity: 25, discount: 15 },
      { quantity: 50, discount: 25 }
    ]
  },
  {
    id: 'keychain-acrylic',
    name: 'Acrylic Keychain',
    category: 'accessories',
    subcategory: 'keychains',
    price: 3.99,
    description: 'Durable acrylic keychain with custom design',
    features: [
      'Durable acrylic',
      'Custom design',
      'NMBR code on back',
      'Key ring included',
      'Waterproof'
    ],
    specifications: {
      material: 'Acrylic',
      weight: '0.05 lbs',
      dimensions: '2" x 1.5"'
    },
    nmbrIntegration: {
      placement: 'back',
      size: 'small',
      callToAction: 'Scan for impact'
    },
    designAreas: {
      front: { width: 1.5, height: 1.5, position: 'center' },
      back: { width: 1.5, height: 1.5, position: 'center' }
    },
    colors: ['Clear', 'White', 'Black', 'Transparent'],
    rating: 4.6,
    reviews: 67,
    bestseller: false,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '1-3 days',
    minimumOrder: 1,
    bulkDiscounts: [
      { quantity: 25, discount: 20 },
      { quantity: 50, discount: 30 },
      { quantity: 100, discount: 40 }
    ]
  },

  // OFFICE
  {
    id: 'notebook-spiral',
    name: 'Spiral Notebook',
    category: 'office',
    subcategory: 'notebooks',
    price: 6.99,
    description: '80-page spiral bound notebook with custom cover',
    features: [
      'College ruled pages',
      'Durable cover',
      'NMBR code on back',
      'Spiral binding',
      '80 pages'
    ],
    specifications: {
      material: 'Paper, Cardboard',
      weight: '0.4 lbs',
      dimensions: '8.5" x 11"'
    },
    nmbrIntegration: {
      placement: 'back',
      size: 'medium',
      callToAction: 'Scan to see your impact'
    },
    designAreas: {
      front: { width: 7, height: 9, position: 'center' },
      back: { width: 7, height: 9, position: 'center' }
    },
    colors: ['White'],
    rating: 4.6,
    reviews: 43,
    bestseller: false,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '2-5 days',
    minimumOrder: 1,
    bulkDiscounts: [
      { quantity: 10, discount: 10 },
      { quantity: 25, discount: 15 },
      { quantity: 50, discount: 25 }
    ]
  },
  {
    id: 'mouse-pad-desk',
    name: 'Desk Mouse Pad',
    category: 'office',
    subcategory: 'desk-accessories',
    price: 7.99,
    description: 'Non-slip mouse pad with custom design',
    features: [
      'Non-slip base',
      'Smooth surface',
      'NMBR code on corner',
      'Machine washable',
      'Durable construction'
    ],
    specifications: {
      material: 'Rubber, Fabric',
      weight: '0.2 lbs',
      dimensions: '9" x 7"'
    },
    nmbrIntegration: {
      placement: 'front',
      size: 'small',
      callToAction: 'Scan for impact'
    },
    designAreas: {
      front: { width: 8, height: 6, position: 'center' }
    },
    colors: ['Black', 'White', 'Gray', 'Navy'],
    rating: 4.7,
    reviews: 78,
    bestseller: false,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '1-3 days',
    minimumOrder: 1,
    bulkDiscounts: [
      { quantity: 10, discount: 10 },
      { quantity: 25, discount: 15 },
      { quantity: 50, discount: 25 }
    ]
  },

  // EVENTS
  {
    id: 'lanyard-basic',
    name: 'Basic Lanyard',
    category: 'events',
    subcategory: 'lanyards',
    price: 2.99,
    description: 'Adjustable lanyard for events and conferences',
    features: [
      'Adjustable length',
      'Breakaway safety',
      'NMBR code on tag',
      'Durable construction',
      'Bulk pricing available'
    ],
    specifications: {
      material: 'Polyester',
      weight: '0.1 lbs',
      dimensions: '36" length'
    },
    nmbrIntegration: {
      placement: 'front',
      size: 'small',
      callToAction: 'Scan to learn more'
    },
    designAreas: {
      front: { width: 2, height: 1, position: 'center' }
    },
    colors: ['Black', 'Navy', 'Red', 'Blue', 'Green', 'Purple'],
    rating: 4.5,
    reviews: 156,
    bestseller: false,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '1-3 days',
    minimumOrder: 10,
    bulkDiscounts: [
      { quantity: 50, discount: 20 },
      { quantity: 100, discount: 30 },
      { quantity: 250, discount: 40 }
    ]
  },
  {
    id: 'wristband-silicone',
    name: 'Silicone Wristband',
    category: 'events',
    subcategory: 'wristbands',
    price: 1.99,
    description: 'Comfortable silicone wristband with custom message',
    features: [
      'Comfortable silicone',
      'Custom message',
      'NMBR code on inside',
      'One size fits most',
      'Waterproof'
    ],
    specifications: {
      material: 'Silicone',
      weight: '0.05 lbs',
      dimensions: '8" circumference'
    },
    nmbrIntegration: {
      placement: 'inside',
      size: 'small',
      callToAction: 'Scan for impact'
    },
    designAreas: {
      front: { width: 6, height: 0.5, position: 'center' }
    },
    colors: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink'],
    rating: 4.8,
    reviews: 234,
    bestseller: true,
    nmbrReady: true,
    dropshipPartner: 'printful',
    estimatedFulfillment: '1-3 days',
    minimumOrder: 25,
    bulkDiscounts: [
      { quantity: 100, discount: 25 },
      { quantity: 250, discount: 35 },
      { quantity: 500, discount: 45 }
    ]
  }
]

// Helper functions
export const getProductsByCategory = (category: string) => {
  if (category === 'all') return productTemplates
  return productTemplates.filter(product => product.category === category)
}

export const getProductById = (id: string) => {
  return productTemplates.find(product => product.id === id)
}

export const getBestsellers = () => {
  return productTemplates.filter(product => product.bestseller)
}

export const getNMBRReadyProducts = () => {
  return productTemplates.filter(product => product.nmbrReady)
}

export const searchProducts = (query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return productTemplates.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
  )
}
