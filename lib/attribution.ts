import crypto from 'crypto'

export interface AttributionParams {
  nmbrId?: string
  updateId?: string
  campaignId?: string
  recipientId?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  referrer?: string
}

export interface SignedAttributionParams extends AttributionParams {
  signature: string
  timestamp: number
}

const SECRET_KEY = process.env.ATTRIBUTION_SECRET_KEY || 'your-secret-key'

/**
 * Creates signed attribution parameters for email links
 * This prevents tampering and ensures attribution integrity
 */
export function createSignedAttribution(params: AttributionParams): SignedAttributionParams {
  const timestamp = Date.now()
  const data = {
    ...params,
    timestamp
  }
  
  // Create signature
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(JSON.stringify(data))
    .digest('hex')
  
  return {
    ...data,
    signature
  }
}

/**
 * Verifies signed attribution parameters
 * Returns the params if valid, null if invalid
 */
export function verifySignedAttribution(signedParams: SignedAttributionParams): AttributionParams | null {
  const { signature, timestamp, ...params } = signedParams
  
  // Check timestamp (valid for 7 days)
  const now = Date.now()
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  if (now - timestamp > maxAge) {
    return null
  }
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(JSON.stringify({ ...params, timestamp }))
    .digest('hex')
  
  if (signature !== expectedSignature) {
    return null
  }
  
  return params
}

/**
 * Generates attribution URL with signed parameters
 */
export function generateAttributionUrl(
  baseUrl: string,
  params: AttributionParams
): string {
  const signedParams = createSignedAttribution(params)
  const queryString = new URLSearchParams()
  
  Object.entries(signedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryString.append(key, value.toString())
    }
  })
  
  return `${baseUrl}?${queryString.toString()}`
}

/**
 * Extracts attribution from URL parameters
 */
export function extractAttributionFromUrl(url: string): AttributionParams | null {
  try {
    const urlObj = new URL(url)
    const params = new URLSearchParams(urlObj.search)
    
    const signedParams: SignedAttributionParams = {
      nmbrId: params.get('nmbrId') || undefined,
      updateId: params.get('updateId') || undefined,
      campaignId: params.get('campaignId') || undefined,
      recipientId: params.get('recipientId') || undefined,
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
      utmTerm: params.get('utm_term') || undefined,
      utmContent: params.get('utm_content') || undefined,
      referrer: params.get('referrer') || undefined,
      signature: params.get('signature') || '',
      timestamp: parseInt(params.get('timestamp') || '0')
    }
    
    return verifySignedAttribution(signedParams)
  } catch (error) {
    console.error('Error extracting attribution from URL:', error)
    return null
  }
}

/**
 * Creates attribution cookie for view-through attribution
 */
export function createAttributionCookie(params: AttributionParams): string {
  const signedParams = createSignedAttribution(params)
  return `nmbr_attribution=${encodeURIComponent(JSON.stringify(signedParams))}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`
}

/**
 * Reads attribution from cookie
 */
export function readAttributionCookie(cookieHeader: string): AttributionParams | null {
  try {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
    
    const attributionCookie = cookies.nmbr_attribution
    if (!attributionCookie) return null
    
    const signedParams = JSON.parse(decodeURIComponent(attributionCookie))
    return verifySignedAttribution(signedParams)
  } catch (error) {
    console.error('Error reading attribution cookie:', error)
    return null
  }
}

/**
 * Generates email link with attribution
 */
export function generateEmailLink(
  baseUrl: string,
  params: AttributionParams
): string {
  // Add UTM parameters for email tracking
  const emailParams = {
    ...params,
    utmSource: 'nmbr_email',
    utmMedium: 'update',
    utmCampaign: params.campaignId || 'newsletter'
  }
  
  return generateAttributionUrl(baseUrl, emailParams)
}

/**
 * Generates product link with story attribution
 */
export function generateProductLink(
  productSlug: string,
  orgSlug: string,
  params: AttributionParams,
  isMarketplace = false
): string {
  const baseUrl = isMarketplace 
    ? `https://market.nmbr.com/products/${productSlug}`
    : `https://shop.${orgSlug}.org/${productSlug}`
  
  return generateEmailLink(baseUrl, params)
}

/**
 * Generates one-click checkout link
 */
export function generateCheckoutLink(
  productId: string,
  variantId: string,
  quantity: number,
  orgSlug: string,
  params: AttributionParams
): string {
  const baseUrl = `https://shop.${orgSlug}.org/checkout`
  const checkoutParams = new URLSearchParams({
    sku: productId,
    variant: variantId,
    qty: quantity.toString()
  })
  
  const attributionUrl = generateEmailLink(baseUrl, params)
  return `${attributionUrl}&${checkoutParams.toString()}`
}

/**
 * Example usage for email templates
 */
export function generateEmailProductBlocks(
  products: Array<{ id: string; slug: string; title: string; price: number }>,
  nmbrId: string,
  updateId: string,
  campaignId: string,
  recipientId: string,
  orgSlug: string
): Array<{ title: string; price: number; link: string; image: string }> {
  return products.map(product => ({
    title: product.title,
    price: product.price,
    link: generateProductLink(product.slug, orgSlug, {
      nmbrId,
      updateId,
      campaignId,
      recipientId
    }),
    image: `/images/products/${product.slug}.jpg`
  }))
}
