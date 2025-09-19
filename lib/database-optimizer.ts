import { supabase } from './supabase'
import { databaseCache } from './cache'
import { monitoring, LogCategory } from './monitoring'

// Query optimization configuration
export interface QueryConfig {
  useCache: boolean
  cacheTTL?: number
  cacheKey?: string
  cacheTags?: string[]
  timeout?: number
  retries?: number
  batchSize?: number
  selectFields?: string[]
  orderBy?: string
  limit?: number
  offset?: number
}

// Query performance metrics
export interface QueryMetrics {
  query: string
  duration: number
  rowsReturned: number
  cacheHit: boolean
  retries: number
  error?: string
  timestamp: string
}

// Query optimization strategies
export enum OptimizationStrategy {
  INDEX_HINT = 'index_hint',
  QUERY_REWRITE = 'query_rewrite',
  BATCH_OPTIMIZATION = 'batch_optimization',
  CACHE_FIRST = 'cache_first',
  CONNECTION_POOLING = 'connection_pooling',
  QUERY_PLANNING = 'query_planning'
}

// Optimized query builder
export class DatabaseOptimizer {
  private queryMetrics: QueryMetrics[] = []
  private maxMetrics = 1000

  // Optimized select query
  async select<T = any>(
    table: string,
    config: QueryConfig = {},
    filters: Record<string, any> = {}
  ): Promise<{ data: T[] | null; error: any; metrics: QueryMetrics }> {
    const startTime = Date.now()
    let retries = 0
    const maxRetries = config.retries || 3
    let cacheHit = false
    let error: any = null
    let data: T[] | null = null

    // Generate cache key
    const cacheKey = config.cacheKey || this.generateCacheKey(table, 'select', filters, config)
    
    // Try cache first if enabled
    if (config.useCache !== false) {
      const cached = databaseCache.get<T[]>(cacheKey, 'database')
      if (cached) {
        cacheHit = true
        data = cached
        monitoring.info(LogCategory.DATABASE, 'Cache hit for select query', {
          table,
          cacheKey,
          duration: Date.now() - startTime
        })
      }
    }

    // Execute query if not cached
    if (!cacheHit) {
      while (retries < maxRetries) {
        try {
          let query = supabase.from(table).select(config.selectFields?.join(',') || '*')

          // Apply filters
          for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                query = query.in(key, value)
              } else if (typeof value === 'string' && value.includes('%')) {
                query = query.like(key, value)
              } else if (typeof value === 'object' && value.operator) {
                switch (value.operator) {
                  case 'gt':
                    query = query.gt(key, value.value)
                    break
                  case 'gte':
                    query = query.gte(key, value.value)
                    break
                  case 'lt':
                    query = query.lt(key, value.value)
                    break
                  case 'lte':
                    query = query.lte(key, value.value)
                    break
                  case 'neq':
                    query = query.neq(key, value.value)
                    break
                  case 'is':
                    query = query.is(key, value.value)
                    break
                  case 'in':
                    query = query.in(key, value.value)
                    break
                  case 'contains':
                    query = query.contains(key, value.value)
                    break
                  case 'containedBy':
                    query = query.containedBy(key, value.value)
                    break
                  case 'rangeGt':
                    query = query.rangeGt(key, value.value)
                    break
                  case 'rangeGte':
                    query = query.rangeGte(key, value.value)
                    break
                  case 'rangeLt':
                    query = query.rangeLt(key, value.value)
                    break
                  case 'rangeLte':
                    query = query.rangeLte(key, value.value)
                    break
                  case 'rangeAdjacent':
                    query = query.rangeAdjacent(key, value.value)
                    break
                  case 'overlaps':
                    query = query.overlaps(key, value.value)
                    break
                  case 'textSearch':
                    query = query.textSearch(key, value.value)
                    break
                  case 'match':
                    query = query.match(value.value)
                    break
                  default:
                    query = query.eq(key, value)
                }
              } else {
                query = query.eq(key, value)
              }
            }
          }

          // Apply ordering
          if (config.orderBy) {
            const [column, direction] = config.orderBy.split(' ')
            query = query.order(column, { ascending: direction !== 'desc' })
          }

          // Apply pagination
          if (config.limit) {
            query = query.limit(config.limit)
          }
          if (config.offset) {
            query = query.range(config.offset, config.offset + (config.limit || 10) - 1)
          }

          // Execute query with timeout
          const result = await this.executeWithTimeout(query, config.timeout || 30000)
          
          data = result.data
          error = result.error

          if (error) {
            throw error
          }

          // Cache successful results
          if (config.useCache !== false && data) {
            databaseCache.set(cacheKey, data, config.cacheTTL, 'database', config.cacheTags)
            monitoring.info(LogCategory.DATABASE, 'Cached select query result', {
              table,
              cacheKey,
              rowsReturned: data.length
            })
          }

          break // Success, exit retry loop
        } catch (err) {
          retries++
          error = err
          
          if (retries >= maxRetries) {
            monitoring.error(LogCategory.DATABASE, 'Select query failed after retries', err as Error, {
              table,
              retries,
              filters
            })
          } else {
            // Exponential backoff
            await this.delay(Math.pow(2, retries) * 1000)
          }
        }
      }
    }

    // Record metrics
    const metrics: QueryMetrics = {
      query: `SELECT ${config.selectFields?.join(',') || '*'} FROM ${table}`,
      duration: Date.now() - startTime,
      rowsReturned: data?.length || 0,
      cacheHit,
      retries,
      error: error?.message,
      timestamp: new Date().toISOString()
    }

    this.recordMetrics(metrics)

    return { data, error, metrics }
  }

  // Optimized insert query
  async insert<T = any>(
    table: string,
    data: T | T[],
    config: QueryConfig = {}
  ): Promise<{ data: T[] | null; error: any; metrics: QueryMetrics }> {
    const startTime = Date.now()
    let retries = 0
    const maxRetries = config.retries || 3
    let error: any = null
    let result: T[] | null = null

    while (retries < maxRetries) {
      try {
        let query = supabase.from(table).insert(data)

        if (config.selectFields) {
          query = query.select(config.selectFields.join(','))
        }

        const response = await this.executeWithTimeout(query, config.timeout || 30000)
        
        result = response.data
        error = response.error

        if (error) {
          throw error
        }

        // Invalidate related cache entries
        if (config.cacheTags) {
          for (const tag of config.cacheTags) {
            databaseCache.invalidateByTag(tag, 'database')
          }
        }

        // Invalidate table cache
        databaseCache.invalidateByTag(`table:${table}`, 'database')

        monitoring.info(LogCategory.DATABASE, 'Insert query successful', {
          table,
          rowsInserted: Array.isArray(data) ? data.length : 1,
          duration: Date.now() - startTime
        })

        break
      } catch (err) {
        retries++
        error = err
        
        if (retries >= maxRetries) {
          monitoring.error(LogCategory.DATABASE, 'Insert query failed after retries', err as Error, {
            table,
            retries,
            dataCount: Array.isArray(data) ? data.length : 1
          })
        } else {
          await this.delay(Math.pow(2, retries) * 1000)
        }
      }
    }

    const metrics: QueryMetrics = {
      query: `INSERT INTO ${table}`,
      duration: Date.now() - startTime,
      rowsReturned: result?.length || 0,
      cacheHit: false,
      retries,
      error: error?.message,
      timestamp: new Date().toISOString()
    }

    this.recordMetrics(metrics)

    return { data: result, error, metrics }
  }

  // Optimized update query
  async update<T = any>(
    table: string,
    data: Partial<T>,
    filters: Record<string, any>,
    config: QueryConfig = {}
  ): Promise<{ data: T[] | null; error: any; metrics: QueryMetrics }> {
    const startTime = Date.now()
    let retries = 0
    const maxRetries = config.retries || 3
    let error: any = null
    let result: T[] | null = null

    while (retries < maxRetries) {
      try {
        let query = supabase.from(table).update(data)

        // Apply filters
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        }

        if (config.selectFields) {
          query = query.select(config.selectFields.join(','))
        }

        const response = await this.executeWithTimeout(query, config.timeout || 30000)
        
        result = response.data
        error = response.error

        if (error) {
          throw error
        }

        // Invalidate related cache entries
        if (config.cacheTags) {
          for (const tag of config.cacheTags) {
            databaseCache.invalidateByTag(tag, 'database')
          }
        }

        // Invalidate table cache
        databaseCache.invalidateByTag(`table:${table}`, 'database')

        monitoring.info(LogCategory.DATABASE, 'Update query successful', {
          table,
          rowsUpdated: result?.length || 0,
          duration: Date.now() - startTime
        })

        break
      } catch (err) {
        retries++
        error = err
        
        if (retries >= maxRetries) {
          monitoring.error(LogCategory.DATABASE, 'Update query failed after retries', err as Error, {
            table,
            retries,
            filters
          })
        } else {
          await this.delay(Math.pow(2, retries) * 1000)
        }
      }
    }

    const metrics: QueryMetrics = {
      query: `UPDATE ${table}`,
      duration: Date.now() - startTime,
      rowsReturned: result?.length || 0,
      cacheHit: false,
      retries,
      error: error?.message,
      timestamp: new Date().toISOString()
    }

    this.recordMetrics(metrics)

    return { data: result, error, metrics }
  }

  // Optimized delete query
  async delete(
    table: string,
    filters: Record<string, any>,
    config: QueryConfig = {}
  ): Promise<{ data: any[] | null; error: any; metrics: QueryMetrics }> {
    const startTime = Date.now()
    let retries = 0
    const maxRetries = config.retries || 3
    let error: any = null
    let result: any[] | null = null

    while (retries < maxRetries) {
      try {
        let query = supabase.from(table).delete()

        // Apply filters
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        }

        if (config.selectFields) {
          query = query.select(config.selectFields.join(','))
        }

        const response = await this.executeWithTimeout(query, config.timeout || 30000)
        
        result = response.data
        error = response.error

        if (error) {
          throw error
        }

        // Invalidate related cache entries
        if (config.cacheTags) {
          for (const tag of config.cacheTags) {
            databaseCache.invalidateByTag(tag, 'database')
          }
        }

        // Invalidate table cache
        databaseCache.invalidateByTag(`table:${table}`, 'database')

        monitoring.info(LogCategory.DATABASE, 'Delete query successful', {
          table,
          rowsDeleted: result?.length || 0,
          duration: Date.now() - startTime
        })

        break
      } catch (err) {
        retries++
        error = err
        
        if (retries >= maxRetries) {
          monitoring.error(LogCategory.DATABASE, 'Delete query failed after retries', err as Error, {
            table,
            retries,
            filters
          })
        } else {
          await this.delay(Math.pow(2, retries) * 1000)
        }
      }
    }

    const metrics: QueryMetrics = {
      query: `DELETE FROM ${table}`,
      duration: Date.now() - startTime,
      rowsReturned: result?.length || 0,
      cacheHit: false,
      retries,
      error: error?.message,
      timestamp: new Date().toISOString()
    }

    this.recordMetrics(metrics)

    return { data: result, error, metrics }
  }

  // Batch operations
  async batchInsert<T = any>(
    table: string,
    data: T[],
    batchSize: number = 1000,
    config: QueryConfig = {}
  ): Promise<{ data: T[] | null; error: any; metrics: QueryMetrics }> {
    const startTime = Date.now()
    let allResults: T[] = []
    let error: any = null

    try {
      // Process in batches
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize)
        const result = await this.insert(table, batch, config)
        
        if (result.error) {
          throw result.error
        }
        
        if (result.data) {
          allResults.push(...result.data)
        }
      }

      monitoring.info(LogCategory.DATABASE, 'Batch insert successful', {
        table,
        totalRows: data.length,
        batches: Math.ceil(data.length / batchSize),
        duration: Date.now() - startTime
      })
    } catch (err) {
      error = err
      monitoring.error(LogCategory.DATABASE, 'Batch insert failed', err as Error, {
        table,
        totalRows: data.length,
        batchSize
      })
    }

    const metrics: QueryMetrics = {
      query: `BATCH INSERT INTO ${table}`,
      duration: Date.now() - startTime,
      rowsReturned: allResults.length,
      cacheHit: false,
      retries: 0,
      error: error?.message,
      timestamp: new Date().toISOString()
    }

    this.recordMetrics(metrics)

    return { data: allResults, error, metrics }
  }

  // Query performance analysis
  getQueryMetrics(): QueryMetrics[] {
    return [...this.queryMetrics]
  }

  getSlowQueries(threshold: number = 1000): QueryMetrics[] {
    return this.queryMetrics.filter(metric => metric.duration > threshold)
  }

  getQueryStats(): {
    totalQueries: number
    averageDuration: number
    slowQueries: number
    cacheHitRate: number
    errorRate: number
  } {
    const total = this.queryMetrics.length
    if (total === 0) {
      return {
        totalQueries: 0,
        averageDuration: 0,
        slowQueries: 0,
        cacheHitRate: 0,
        errorRate: 0
      }
    }

    const totalDuration = this.queryMetrics.reduce((sum, metric) => sum + metric.duration, 0)
    const cacheHits = this.queryMetrics.filter(metric => metric.cacheHit).length
    const errors = this.queryMetrics.filter(metric => metric.error).length
    const slowQueries = this.queryMetrics.filter(metric => metric.duration > 1000).length

    return {
      totalQueries: total,
      averageDuration: totalDuration / total,
      slowQueries,
      cacheHitRate: (cacheHits / total) * 100,
      errorRate: (errors / total) * 100
    }
  }

  // Private methods
  private async executeWithTimeout(query: any, timeout: number): Promise<any> {
    return Promise.race([
      query,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), timeout)
      )
    ])
  }

  private generateCacheKey(table: string, operation: string, filters: Record<string, any>, config: QueryConfig): string {
    const filterStr = Object.entries(filters)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
      .join('|')
    
    const configStr = [
      config.selectFields?.join(','),
      config.orderBy,
      config.limit,
      config.offset
    ].filter(Boolean).join('|')

    return `${table}:${operation}:${filterStr}:${configStr}`
  }

  private recordMetrics(metrics: QueryMetrics): void {
    this.queryMetrics.push(metrics)
    
    // Keep only recent metrics
    if (this.queryMetrics.length > this.maxMetrics) {
      this.queryMetrics = this.queryMetrics.slice(-this.maxMetrics)
    }

    // Log slow queries
    if (metrics.duration > 5000) {
      monitoring.warn(LogCategory.DATABASE, 'Slow query detected', {
        query: metrics.query,
        duration: metrics.duration,
        table: metrics.query.split(' ')[2] || 'unknown'
      })
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const dbOptimizer = new DatabaseOptimizer()

// Export convenience functions
export const db = {
  select: <T = any>(table: string, config?: QueryConfig, filters?: Record<string, any>) =>
    dbOptimizer.select<T>(table, config, filters),
  insert: <T = any>(table: string, data: T | T[], config?: QueryConfig) =>
    dbOptimizer.insert<T>(table, data, config),
  update: <T = any>(table: string, data: Partial<T>, filters: Record<string, any>, config?: QueryConfig) =>
    dbOptimizer.update<T>(table, data, filters, config),
  delete: (table: string, filters: Record<string, any>, config?: QueryConfig) =>
    dbOptimizer.delete(table, filters, config),
  batchInsert: <T = any>(table: string, data: T[], batchSize?: number, config?: QueryConfig) =>
    dbOptimizer.batchInsert<T>(table, data, batchSize, config)
}

export default DatabaseOptimizer
