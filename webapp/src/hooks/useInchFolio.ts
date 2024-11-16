export const fetchPortfolioValue = async () => {
    const response = await fetch('/api/folio');
    if (!response.ok) {
        throw new Error('Failed to fetch portfolio value');
    }
    return response.json();
}