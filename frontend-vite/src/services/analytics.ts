/**
 * PLAIN TEXT SOLUTION (Architecture):
 * We use a CORS proxy (allorigins.win) to bypass security blocks.
 * This allows us to fetch the raw number from a public counter.
 */

const COUNTER_URL = 'https://api.counterapi.dev/v1/abhishek-portfolio-2026/visits';
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

export const incrementView = async () => {
    try {
        // We use the 'up' endpoint to increment
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(COUNTER_URL + '/up')}`);
        const data = await response.json();
        return { total_views: data.count || 0 };
    } catch (error) {
        console.error('Failed to increment view:', error);
        return null;
    }
};

export const getViewStats = async () => {
    try {
        // We just fetch the current count
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(COUNTER_URL)}`);
        const data = await response.json();
        return { total_views: data.count || 0 };
    } catch (error) {
        console.error('Failed to fetch view stats:', error);
        return { total_views: 0 };
    }
};
