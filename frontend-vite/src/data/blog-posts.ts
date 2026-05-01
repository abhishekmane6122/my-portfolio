import { BlogPost } from '@/types/schema'

// Import all blog JSON files
import blog0 from './blog_json/00_building_rag_system.json'
import blog1 from './blog_json/00_fastapi_production.json'
import blog3 from './blog_json/01_multi_agent_systems_langgraph.json'
import blog4 from './blog_json/01_production_architecture_nginx_fastapi.json'
import blog5 from './blog_json/02_context_engineering_complete.json'
import blog6 from './blog_json/02_enterprise_rag_systems.json'
import blog7 from './blog_json/03_llmops_production.json'
import blog8 from './blog_json/03_multimodal_ai_architecture.json'
import blog9 from './blog_json/04_ai_agent_protocols_mcp.json'
import blog10 from './blog_json/04_small_language_models.json'
import blog11 from './blog_json/05_agentic_ai_production.json'
import blog12 from './blog_json/05_observability_monitoring_ai.json'

// Export the array of blog posts
export const blogPosts: BlogPost[] = [
    blog0 as BlogPost,
    blog1 as BlogPost,
    blog3 as BlogPost,
    blog4 as BlogPost,
    blog5 as BlogPost,
    blog6 as BlogPost,
    blog7 as BlogPost,
    blog8 as BlogPost,
    blog9 as BlogPost,
    blog10 as BlogPost,
    blog11 as BlogPost,
    blog12 as BlogPost,
].sort((a, b) => parseInt(a.id) - parseInt(b.id));

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
