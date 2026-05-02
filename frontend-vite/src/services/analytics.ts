// We use countapi.xyz which is a free, public counter API. 
// No backend required!
const NAMESPACE = 'abhishek-portfolio-2026';
const KEY = 'visits';

export const incrementView = async () => {
    try {
        // This increments the counter and returns the new value
        const response = await fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to increment view:', error);
        return null;
    }
};

export const getViewStats = async () => {
    try {
        // This just gets the current value without incrementing
        const response = await fetch(`https://api.countapi.xyz/get/${NAMESPACE}/${KEY}`);
        const data = await response.json();
        return { total_views: data.value || 0 };
    } catch (error) {
        console.error('Failed to fetch view stats:', error);
        return { total_views: 0 };
    }
};
