import { ProjectCaseStudy } from '@/types/schema'

// Every JSON file in projects_json is a case study. Dropping a new file in is
// all that's needed - there is no import list to maintain.
const modules = import.meta.glob<{ default: ProjectCaseStudy }>(
    './projects_json/*.json',
    { eager: true },
)

export const caseStudies: ProjectCaseStudy[] = Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, m]) => m.default as ProjectCaseStudy)
    .sort((a, b) => {
        // Featured first; file-name order is preserved within each group.
        if (a.featured !== b.featured) return a.featured ? -1 : 1
        return 0
    })

/** Kept as the legacy export name so existing imports keep working. */
export const detailedProjects = caseStudies

export function getProjectBySlug(slug: string): ProjectCaseStudy | undefined {
    return caseStudies.find(project => project.slug === slug)
}

export function getAllProjectSlugs(): string[] {
    return caseStudies.map(project => project.slug)
}

export function getProjectCategories(): string[] {
    return Array.from(new Set(caseStudies.map(p => p.category))).sort()
}
