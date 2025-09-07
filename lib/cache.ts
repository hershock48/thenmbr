import { NextRequest } from 'next/server'

// Cache configuration
export interface CacheConfig {
  ttl: number // Time to live in milliseconds
  maxSize: number // Maximum number of items
  strategy: 'lru' | 'fifo' | 'ttl' // Eviction strategy
  namespace?: string // Cache namespace for organization
}

// Cache entry interface
export interface CacheEntry<T = any> {
  key: string
  value: T
  timestamp: number
  ttl: number
  hits: number
  lastAccessed: number
  tags?: string[]
  metadata?: Record<string, any>
}

// Cache statistics
export interface CacheStats {
  hits: number
  misses: number
  hitRate: number
  totalItems: number
  memoryUsage: number
  evictions: number
  namespaceStats: Record<string, {
    hits: number
    misses: number
    items: number
  }>
}

// Cache event types
export enum CacheEvent {
  HIT = 'cache_hit',
  MISS = 'cache_miss',
  SET = 'cache_set',
  DELETE = 'cache_delete',
  EVICT = 'cache_evict',
  CLEAR = 'cache_clear'
}

// Cache event interface
export interface CacheEventData {
  key: string
  namespace?: string
  ttl?: number
  size?: number
  reason?: string
}

// Multi-tier cache service
export class CacheService {
  private memoryCache = new Map<string, CacheEntry>()
  private config: CacheConfig
  private stats: CacheStats
  private eventListeners: Map<CacheEvent, ((data: CacheEventData) => void)[]> = new Map()

  constructor(config: CacheConfig) {
    this.config = config
    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalItems: 0,
      memoryUsage: 0,
      evictions: 0,
      namespaceStats: {}
    }

    // Initialize event listeners
    Object.values(CacheEvent).forEach(event => {
      this.eventListeners.set(event, [])
    })

    // Start cleanup interval
    this.startCleanup()
  }

  // Core cache operations
  get<T>(key: string, namespace?: string): T | null {
    const fullKey = this.getFullKey(key, namespace)
    const entry = this.memoryCache.get(fullKey)

    if (!entry) {
      this.recordEvent(CacheEvent.MISS, { key, namespace })
      this.stats.misses++
      this.updateHitRate()
      return null
    }

    // Check if entry has expired
    if (this.isExpired(entry)) {
      this.memoryCache.delete(fullKey)
      this.recordEvent(CacheEvent.EVICT, { key, namespace, reason: 'expired' })
      this.stats.evictions++
      this.stats.misses++
      this.updateHitRate()
      return null
    }

    // Update access statistics
    entry.hits++
    entry.lastAccessed = Date.now()
    this.recordEvent(CacheEvent.HIT, { key, namespace })
    this.stats.hits++
    this.updateHitRate()

    return entry.value
  }

  set<T>(key: string, value: T, ttl?: number, namespace?: string, tags?: string[]): void {
    const fullKey = this.getFullKey(key, namespace)
    const entryTTL = ttl || this.config.ttl

    // Check if we need to evict items
    if (this.memoryCache.size >= this.config.maxSize) {
      this.evictItems()
    }

    const entry: CacheEntry<T> = {
      key: fullKey,
      value,
      timestamp: Date.now(),
      ttl: entryTTL,
      hits: 0,
      lastAccessed: Date.now(),
      tags,
      metadata: {
        size: this.calculateSize(value)
      }
    }

    this.memoryCache.set(fullKey, entry)
    this.recordEvent(CacheEvent.SET, { key, namespace, ttl: entryTTL })
    this.updateStats()
  }

  delete(key: string, namespace?: string): boolean {
    const fullKey = this.getFullKey(key, namespace)
    const deleted = this.memoryCache.delete(fullKey)
    
    if (deleted) {
      this.recordEvent(CacheEvent.DELETE, { key, namespace })
      this.updateStats()
    }
    
    return deleted
  }

  clear(namespace?: string): void {
    if (namespace) {
      // Clear only specific namespace
      const prefix = `${namespace}:`
      for (const [key, entry] of this.memoryCache.entries()) {
        if (key.startsWith(prefix)) {
          this.memoryCache.delete(key)
        }
      }
    } else {
      // Clear all
      this.memoryCache.clear()
    }
    
    this.recordEvent(CacheEvent.CLEAR, { namespace })
    this.updateStats()
  }

  // Advanced cache operations
  getOrSet<T>(
    key: string, 
    factory: () => Promise<T> | T, 
    ttl?: number, 
    namespace?: string, 
    tags?: string[]
  ): Promise<T> | T {
    const cached = this.get<T>(key, namespace)
    if (cached !== null) {
      return cached
    }

    const result = factory()
    
    if (result instanceof Promise) {
      return result.then(value => {
        this.set(key, value, ttl, namespace, tags)
        return value
      })
    } else {
      this.set(key, result, ttl, namespace, tags)
      return result
    }
  }

  // Tag-based operations
  invalidateByTag(tag: string, namespace?: string): number {
    let invalidated = 0
    const prefix = namespace ? `${namespace}:` : ''

    for (const [key, entry] of this.memoryCache.entries()) {
      if (key.startsWith(prefix) && entry.tags?.includes(tag)) {
        this.memoryCache.delete(key)
        invalidated++
      }
    }

    if (invalidated > 0) {
      this.recordEvent(CacheEvent.EVICT, { key: `tag:${tag}`, namespace, reason: 'tag_invalidation' })
      this.stats.evictions += invalidated
      this.updateStats()
    }

    return invalidated
  }

  // Batch operations
  mget<T>(keys: string[], namespace?: string): Map<string, T | null> {
    const result = new Map<string, T | null>()
    
    for (const key of keys) {
      result.set(key, this.get<T>(key, namespace))
    }
    
    return result
  }

  mset<T>(entries: Array<{ key: string; value: T; ttl?: number; tags?: string[] }>, namespace?: string): void {
    for (const entry of entries) {
      this.set(entry.key, entry.value, entry.ttl, namespace, entry.tags)
    }
  }

  // Cache statistics
  getStats(): CacheStats {
    return { ...this.stats }
  }

  getNamespaceStats(namespace: string): CacheStats['namespaceStats'][string] | null {
    return this.stats.namespaceStats[namespace] || null
  }

  // Event system
  on(event: CacheEvent, listener: (data: CacheEventData) => void): void {
    const listeners = this.eventListeners.get(event) || []
    listeners.push(listener)
    this.eventListeners.set(event, listeners)
  }

  off(event: CacheEvent, listener: (data: CacheEventData) => void): void {
    const listeners = this.eventListeners.get(event) || []
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  // Private methods
  private getFullKey(key: string, namespace?: string): string {
    return namespace ? `${namespace}:${key}` : key
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  private evictItems(): void {
    const entries = Array.from(this.memoryCache.entries())
    
    switch (this.config.strategy) {
      case 'lru':
        // Least Recently Used
        entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
        break
      case 'fifo':
        // First In, First Out
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
        break
      case 'ttl':
        // Time To Live (expired first)
        entries.sort((a, b) => (a[1].timestamp + a[1].ttl) - (b[1].timestamp + b[1].ttl))
        break
    }

    // Remove 10% of entries
    const toRemove = Math.ceil(entries.length * 0.1)
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      this.memoryCache.delete(entries[i][0])
      this.stats.evictions++
    }
  }

  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now()
      let cleaned = 0

      for (const [key, entry] of this.memoryCache.entries()) {
        if (this.isExpired(entry)) {
          this.memoryCache.delete(key)
          cleaned++
        }
      }

      if (cleaned > 0) {
        this.stats.evictions += cleaned
        this.updateStats()
      }
    }, 60000) // Cleanup every minute
  }

  private updateStats(): void {
    this.stats.totalItems = this.memoryCache.size
    this.stats.memoryUsage = this.calculateMemoryUsage()
    this.updateNamespaceStats()
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0
  }

  private updateNamespaceStats(): void {
    this.stats.namespaceStats = {}
    
    for (const [key, entry] of this.memoryCache.entries()) {
      const [namespace] = key.split(':')
      if (!this.stats.namespaceStats[namespace]) {
        this.stats.namespaceStats[namespace] = {
          hits: 0,
          misses: 0,
          items: 0
        }
      }
      this.stats.namespaceStats[namespace].items++
    }
  }

  private calculateSize(value: any): number {
    try {
      return JSON.stringify(value).length * 2 // Rough estimate
    } catch {
      return 0
    }
  }

  private calculateMemoryUsage(): number {
    let total = 0
    for (const entry of this.memoryCache.values()) {
      total += entry.metadata?.size || 0
    }
    return total
  }

  private recordEvent(event: CacheEvent, data: CacheEventData): void {
    const listeners = this.eventListeners.get(event) || []
    listeners.forEach(listener => {
      try {
        listener(data)
      } catch (error) {
        console.error('Cache event listener error:', error)
      }
    })
  }
}

// Predefined cache configurations
export const CACHE_CONFIGS = {
  // Short-term cache (1 minute)
  SHORT: {
    ttl: 60 * 1000,
    maxSize: 1000,
    strategy: 'lru' as const
  },
  
  // Medium-term cache (5 minutes)
  MEDIUM: {
    ttl: 5 * 60 * 1000,
    maxSize: 5000,
    strategy: 'lru' as const
  },
  
  // Long-term cache (1 hour)
  LONG: {
    ttl: 60 * 60 * 1000,
    maxSize: 10000,
    strategy: 'lru' as const
  },
  
  // User session cache (24 hours)
  SESSION: {
    ttl: 24 * 60 * 60 * 1000,
    maxSize: 1000,
    strategy: 'lru' as const
  },
  
  // API response cache (15 minutes)
  API: {
    ttl: 15 * 60 * 1000,
    maxSize: 2000,
    strategy: 'lru' as const
  },
  
  // Database query cache (30 minutes)
  DATABASE: {
    ttl: 30 * 60 * 1000,
    maxSize: 5000,
    strategy: 'lru' as const
  }
}

// Create cache instances
export const shortCache = new CacheService(CACHE_CONFIGS.SHORT)
export const mediumCache = new CacheService(CACHE_CONFIGS.MEDIUM)
export const longCache = new CacheService(CACHE_CONFIGS.LONG)
export const sessionCache = new CacheService(CACHE_CONFIGS.SESSION)
export const apiCache = new CacheService(CACHE_CONFIGS.API)
export const databaseCache = new CacheService(CACHE_CONFIGS.DATABASE)

// Cache decorator for functions
export function cached<T extends (...args: any[]) => any>(
  cache: CacheService,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: number,
  namespace?: string,
  tags?: string[]
) {
  return function (this: any, ...args: Parameters<T>): ReturnType<T> | Promise<ReturnType<T>> {
    const key = keyGenerator(...args)
    const cached = cache.get<ReturnType<T>>(key, namespace)
    
    if (cached !== null) {
      return cached
    }

    const result = this(...args)
    
    if (result instanceof Promise) {
      return result.then(value => {
        cache.set(key, value, ttl, namespace, tags)
        return value
      })
    } else {
      cache.set(key, result, ttl, namespace, tags)
      return result
    }
  }
}

// Cache middleware for API routes
export function withCache<T>(
  cache: CacheService,
  keyGenerator: (req: NextRequest) => string,
  ttl?: number,
  namespace?: string
) {
  return (handler: (req: NextRequest) => Promise<Response>) => {
    return async (req: NextRequest): Promise<Response> => {
      const key = keyGenerator(req)
      const cached = cache.get<Response>(key, namespace)
      
      if (cached) {
        return cached
      }

      const response = await handler(req)
      
      // Only cache successful responses
      if (response.status >= 200 && response.status < 300) {
        cache.set(key, response, ttl, namespace)
      }
      
      return response
    }
  }
}

export default CacheService
