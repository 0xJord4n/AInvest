
// filepath: /Users/youyoutucoco/Desktop/side_pro/AInvest/webapp/src/api/homeApi.ts

// This file will contain the API calls related to the home page
// You can add your API functions here

export const fetchHomeData = async () => {
  // Example API call
  const response = await fetch('/api/home');
  if (!response.ok) {
    throw new Error('Failed to fetch home data');
  }
  return response.json();
};
