export const fetchSwipeSuggestions = async (tripDetails, preferences) => {
  try {
    // 1) Build the request payload for Perplexity API
    const perplexityURL = "https://api.perplexity.ai/chat/completions";
    const perplexityMessages = [
      { role: "system", content: "Be precise and concise." },
      {
        role: "user",
        // Ask Perplexity to respond ONLY with a JSON array of suggestions
        content: `Generate about 3 suggestions for a trip with details: ${JSON.stringify(
          tripDetails
        )} and preferences: ${JSON.stringify(
          preferences
        )}. The suggestions should be returned in JSON array format, each item containing:
{
  "name": "...",
  "tags": ["..."],
  "description": "..."
}
No extra text. Only the JSON array.`
      }
    ];

    const perplexityRequestOptions = {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",   // TODO: update to better model
        messages: perplexityMessages,
        max_tokens: 256,
        temperature: 0.2,
        top_p: 0.9,
        search_domain_filter: [],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: "month",
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1,
      }),
    };

    // 2) Call the Perplexity API
    const response = await fetch(perplexityURL, perplexityRequestOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch suggestions from Perplexity: ${response.status}`);
    }
    const data = await response.json();

    // 3) Parse the raw JSON array from the response
    //    (We assume Perplexity returns valid JSON in data.choices[0].message.content) else TODO add parsing error handling to only remove unncessary text around JSON array
    let suggestions;
    try {
      suggestions = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error("Error parsing suggestions from Perplexity:", parseError);
      throw new Error("Error parsing suggestions from Perplexity");
    }

    // 4) Log them to verify everything works
    console.log("Fetched suggestions from Perplexity:", suggestions);

    return suggestions;
  } catch (error) {
    console.error("API Error (Perplexity):", error);
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





// TODO: @PhiLinh - Implement API call to fetch swipe suggestions based on preferences, i already implemented the fetchSwipeSuggestions function in tripApi
// const BASE_URL = "https://your-api-url.com"; //TODO Replace with actual API URL

// export const fetchSwipeSuggestions = async (tripDetails, preferences) => {
//   try {
//     const response = await fetch(`${BASE_URL}/generate-suggestions`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ tripDetails, preferences }),
//     });
//     if (!response.ok) throw new Error("Failed to fetch suggestions");
//     return await response.json();
//   } catch (error) {
//     console.error("API Error:", error);
//     throw error;
//   }
// };


