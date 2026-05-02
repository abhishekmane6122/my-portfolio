const API_BASE_URL = 'http://localhost:8000'; // Adjust for production

export const incrementView = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/increment-view`, {
            method: 'POST',
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to increment view:', error);
        return null;
    }
};

export const getViewStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/views`);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch view stats:', error);
        return { total_views: 0, daily_views: {} };
    }
};
