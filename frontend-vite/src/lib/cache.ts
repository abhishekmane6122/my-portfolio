/**
 * Simple cache utility for storing and retrieving data
 */

interface CacheItem<T> {
    data: T
    timestamp: number
    expiresIn: number // milliseconds
}

class Cache {
    private storage: Storage

    constructor(storage: Storage = localStorage) {
        this.storage = storage
    }

    /**
     * Set a cache item with expiration
     */
    set<T>(key: string, data: T, expiresIn: number = 1000 * 60 * 60): void {
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            expiresIn,
        }
        try {
            this.storage.setItem(`cache_${key}`, JSON.stringify(item))
        } catch (error) {
            console.error('Cache set error:', error)
        }
    }

    /**
     * Get a cache item if not expired
     */
    get<T>(key: string): T | null {
        try {
            const itemStr = this.storage.getItem(`cache_${key}`)
            if (!itemStr) return null

            const item: CacheItem<T> = JSON.parse(itemStr)
            const now = Date.now()

            // Check if expired
            if (now - item.timestamp > item.expiresIn) {
                this.remove(key)
                return null
            }

            return item.data
        } catch (error) {
            console.error('Cache get error:', error)
            return null
        }
    }

    /**
     * Remove a cache item
     */
    remove(key: string): void {
        try {
            this.storage.removeItem(`cache_${key}`)
        } catch (error) {
            console.error('Cache remove error:', error)
        }
    }

    /**
     * Clear all cache items
     */
    clear(): void {
        try {
            const keys = Object.keys(this.storage)
            keys.forEach((key) => {
                if (key.startsWith('cache_')) {
                    this.storage.removeItem(key)
                }
            })
        } catch (error) {
            console.error('Cache clear error:', error)
        }
    }

    /**
     * Check if a cache item exists and is valid
     */
    has(key: string): boolean {
        return this.get(key) !== null
    }
}

// Export singleton instance
export const cache = new Cache()

// Export class for custom instances
export default Cache
