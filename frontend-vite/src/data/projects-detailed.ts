import { ProjectDetailed } from '@/types/schema'

// Import individual project JSON files
// NOTE: 02_adani_equity_platform.json is intentionally excluded (private/confidential)
import project1 from './projects_json/01_aegis_platform.json'
import project3 from './projects_json/03_quantus_med.json'
import project4 from './projects_json/04_bse_rag_processor.json'
import project5 from './projects_json/05_doc_capture.json'
import project6 from './projects_json/06_omniqa_agent.json'
import project7 from './projects_json/07_rbi_pipeline_portfolio.json'

// Export the array of detailed projects
export const detailedProjects: ProjectDetailed[] = [
    project1 as ProjectDetailed,
    project3 as ProjectDetailed,
    project4 as ProjectDetailed,
    project5 as ProjectDetailed,
    project6 as ProjectDetailed,
    project7 as ProjectDetailed
];

export function getProjectBySlug(slug: string): ProjectDetailed | undefined {
    return detailedProjects.find(project => project.slug === slug)
}

export function getAllProjectSlugs(): string[] {
    return detailedProjects.map(project => project.slug)
}
