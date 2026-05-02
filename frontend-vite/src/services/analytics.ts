/**
 * ZERO-DB SOLUTION:
 * We use VisitorBadge.io which is designed for GitHub portfolios.
 * It tracks views based on a unique 'path' you provide.
 */

// Use your GitHub username and repo name as the unique ID
const PAGE_ID = 'abhishekmane6122-portfolio-2026';

export const incrementView = async () => {
    try {
        // VisitorBadge increments automatically when you hit the badge URL
        // We use a CORS-friendly endpoint to trigger the hit
        const response = await fetch(`https://api.visitorbadge.io/api/visitors?path=${PAGE_ID}`);
        const data = await response.json();
        return data;
    } catch (error) {
        // If it fails, we ignore it to prevent UI crashes
        return null;
    }
};

export const getViewStats = async () => {
    try {
        // This fetches the current count
        const response = await fetch(`https://api.visitorbadge.io/api/visitors?path=${PAGE_ID}`);
        const data = await response.json();
        
        // The API returns an object with a 'text' or 'value' field depending on the version
        // We ensure we return a number for our UI
        const count = typeof data === 'number' ? data : (data.value || 0);
        return { total_views: count };
    } catch (error) {
        console.error('Failed to fetch view stats:', error);
        return { total_views: 0 };
    }
};
