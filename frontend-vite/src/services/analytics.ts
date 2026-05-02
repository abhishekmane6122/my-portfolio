/**
 * KVDB SOLUTION:
 * This is a public Key-Value store with full CORS support.
 * It is much more reliable for retrieving text/numbers than badge services.
 */

// A unique bucket for your portfolio
const BUCKET_ID = 'AbhishekManePortfolio_v1_2026';
const KEY = 'total_views';
const API_URL = `https://kvdb.io/${BUCKET_ID}/${KEY}`;

export const incrementView = async () => {
    try {
        // KVdb supports a special '+1' syntax to increment a value
        const response = await fetch(API_URL, {
            method: 'POST',
            body: '+1'
        });
        const count = await response.text();
        return { total_views: parseInt(count) || 0 };
    } catch (error) {
        console.error('Failed to increment view:', error);
        return null;
    }
};

export const getViewStats = async () => {
    try {
        const response = await fetch(API_URL);
        const count = await response.text();
        return { total_views: parseInt(count) || 0 };
    } catch (error) {
        console.error('Failed to fetch view stats:', error);
        return { total_views: 0 };
    }
};
