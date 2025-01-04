const BASE_URL = "https://your-api-url.com"; //TODO Replace with actual API URL

export const fetchSwipeSuggestions = async (tripDetails, preferences) => {
  try {
    const response = await fetch(`${BASE_URL}/generate-suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripDetails, preferences }),
    });
    if (!response.ok) throw new Error("Failed to fetch suggestions");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchPerfectMatch = async (data) => {
  console.log("Simulated API Request with Data:", data);

  // Simulate a failed API response
  throw new Error("Simulated API failure");

  // Uncomment the following for a successful response simulation
  // return {
  //   name: "Kyoto, Japan",
  //   description: "A serene blend of ancient traditions and breathtaking landscapes.",
  // };
};
