import { BlogPost } from '@/types/schema'
import blogIndex from 'virtual:blog-index'

// Metadata for every JSON file under blog_json (including series sub-folders),
// with article bodies stripped out - see the blog-index plugin in vite.config.ts.
// Adding a new article is just a matter of dropping the file in.
export const blogPosts: BlogPost[] = (blogIndex as BlogPost[])
    .slice()
    .sort((a, b) => {
        const byDate = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        return byDate !== 0 ? byDate : parseInt(b.id) - parseInt(a.id)
    })

// Article bodies are code-split one chunk per post and fetched on demand.
const contentLoaders = import.meta.glob<{ default: { content?: string } }>('./blog_json/**/*.json')

export async function getPostContent(post: BlogPost): Promise<string> {
    const loader = post.contentKey ? contentLoaders[post.contentKey] : undefined
    if (!loader) return ''
    const mod = await loader()
    return mod.default.content ?? ''
}

export interface SeriesInfo {
    name: string
    slug: string
    count: number
}

/** Series present in the data, ordered by the most recent post in each. */
export function getAllSeries(): SeriesInfo[] {
    const seen = new Map<string, SeriesInfo>()
    for (const post of blogPosts) {
        if (!post.series || !post.seriesSlug) continue
        const existing = seen.get(post.seriesSlug)
        if (existing) {
            existing.count += 1
        } else {
            seen.set(post.seriesSlug, { name: post.series, slug: post.seriesSlug, count: 1 })
        }
    }
    return Array.from(seen.values())
}

/**
 * All posts in a series, ordered by part number. Series without part numbers
 * (standalone collections) fall back to oldest-first so prev/next still reads
 * in a sensible direction.
 */
export function getSeriesPosts(seriesSlug: string): BlogPost[] {
    return blogPosts
        .filter((post) => post.seriesSlug === seriesSlug)
        .sort((a, b) => {
            if (a.seriesPart != null && b.seriesPart != null) return a.seriesPart - b.seriesPart
            return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        })
}

/** The previous and next entry within a post's own series. */
export function getSeriesNeighbours(post: BlogPost): { prev?: BlogPost; next?: BlogPost } {
    if (!post.seriesSlug) return {}
    const siblings = getSeriesPosts(post.seriesSlug)
    const index = siblings.findIndex((p) => p.slug === post.slug)
    if (index === -1) return {}
    return { prev: siblings[index - 1], next: siblings[index + 1] }
}

export function getAllCategories(): string[] {
    return Array.from(new Set(blogPosts.map((post) => post.category))).sort()
}

export function getFeaturedPosts(): BlogPost[] {
    return blogPosts.filter(post => post.featured)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find(post => post.slug === slug)
}

export function getAllPosts(): BlogPost[] {
    return blogPosts
}

export function getPostsByCategory(category: string): BlogPost[] {
    return blogPosts.filter(post => post.category === category)
}

export function getPostsByTag(tag: string): BlogPost[] {
    return blogPosts.filter(post => post.tags.includes(tag))
}
