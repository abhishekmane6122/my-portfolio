// Using api.counterapi.dev as a more stable alternative
const NAMESPACE = 'abhishek-portfolio';
const KEY = 'visits';

export const incrementView = async () => {
    try {
        const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to increment view:', error);
        return null;
    }
};

export const getViewStats = async () => {
    try {
        const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}`);
        const data = await response.json();
        return { total_views: data.count || 0 };
    } catch (error) {
        console.error('Failed to fetch view stats:', error);
        return { total_views: 0 };
    }
};
