import { Skill } from '@/types/schema'
import skillsData from './skills.json'

// Cast the JSON data to the correct types
export const skills = skillsData.skills as Skill[]
export const skillCategories = skillsData.categories
export const skillStats = skillsData.stats

export function getSkillsByCategory(category: Skill['category']): Skill[] {
    return skills.filter(skill => skill.category === category)
}

export function getSkillsByProficiency(proficiency: Skill['proficiency']): Skill[] {
    return skills.filter(skill => skill.proficiency === proficiency)
}

export function getAllSkills(): Skill[] {
    return skills
}
