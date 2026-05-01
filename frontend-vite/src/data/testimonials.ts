import { Testimonial } from '@/types/schema'

export const testimonials: Testimonial[] = [
    {
        id: '1',
        text: 'This automation system transformed our regulatory compliance workflow. What used to take our team hours every day now happens automatically with higher accuracy. The AI-generated summaries are remarkably accurate and have helped us identify critical announcements much faster.',
        author: {
            name: 'Secretarial Department Head',
            role: 'Department Head',
            company: 'Adani Group',
            photo: '/testimonials/avatar-1.jpg',
        },
        rating: 5,
        date: '2024-12-15',
        featured: true,
    },
    {
        id: '2',
        text: 'AEGIS has revolutionized our compliance workflow. The automated director disclosures and insider trading monitoring have eliminated manual errors and saved our team hundreds of hours. The system\'s ability to aggregate data from multiple sources in real-time is impressive.',
        author: {
            name: 'Legal & Compliance Manager',
            role: 'Manager',
            company: 'Adani Group',
            photo: '/testimonials/avatar-2.jpg',
        },
        rating: 5,
        date: '2024-11-20',
        featured: true,
    },
    {
        id: '3',
        text: 'Abhishek demonstrated exceptional technical skills and problem-solving abilities. His implementation of the RAG system was innovative and exceeded our expectations. He consistently delivered high-quality code and was proactive in addressing challenges.',
        author: {
            name: 'Senior Engineering Manager',
            role: 'Engineering Manager',
            company: 'Tech Solutions Inc',
            photo: '/testimonials/avatar-3.jpg',
        },
        rating: 5,
        date: '2024-10-10',
        featured: false,
    },
    {
        id: '4',
        text: 'Working with Abhishek was a pleasure. His expertise in full-stack development and AI/ML integration helped us deliver our project ahead of schedule. He has a great understanding of both frontend and backend technologies.',
        author: {
            name: 'Product Manager',
            role: 'Product Manager',
            company: 'Innovation Labs',
            photo: '/testimonials/avatar-4.jpg',
        },
        rating: 5,
        date: '2024-09-05',
        featured: false,
    },
]

export function getFeaturedTestimonials(): Testimonial[] {
    return testimonials.filter(t => t.featured)
}

export function getAllTestimonials(): Testimonial[] {
    return testimonials
}
