const API_KEY = process.env.REACT_APP_PERPLEXITY_API_KEY;
const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;


/**
 * Helper to get the best matching image from Pexels for the given query.
 * Returns a fallback placeholder if no match is found or if an error occurs.
 */
export const fetchPexelsImage = async (query) => {
  try {
    // Build the Pexels search URL
    // Possible TODO: update query: 'travel' or other keywords can yield more relevant travel images
    const encodedQuery = encodeURIComponent(query);
    const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodedQuery}&per_page=1`;

    // Make the request
    const response = await fetch(pexelsUrl, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    // If Pexels returns an error status, or we can't parse results, fallback
    if (!response.ok) {
      console.error(`Pexels API request failed with status ${response.status}`);
      return "https://via.placeholder.com/300x600";   // TODO: update placeholder image with good one
    }

    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      // Return a decently sized image, e.g. large2x or large
      return data.photos[0].src.large2x || data.photos[0].src.large;
    } else {
      return "https://via.placeholder.com/300x600";
    }
  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return "https://via.placeholder.com/300x600";
  }
};



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
        )}. Return them ONLY as a valid JSON array of objects. 
Each object MUST have:
[
{
  "name": "...",
  "tags": ["..."],
  "description": "..."
}, 
...
]

E.g.:
[
  {
    name: "Barcelona, Spain",
    tags: ["sightseeing", "shopping", "beach"],
    description: "Where culture meets coastline. Explore Gaudí’s wonders.",
  },
  {
    name: "Miami, USA",
    tags: ["surfing", "shopping", "yachting"],
    description:
      "Dive into the glamour and experience Florida’s tropical vibes.",
  },
  {
    name: "Kyoto, Japan",
    tags: ["temples", "nature", "tradition"],
    description:
      "A serene blend of ancient traditions and breathtaking landscapes.",
  },
]

No extra commentary, no code fences, no markdown blocks. Only a raw JSON array.`
      }
    ];

    const perplexityRequestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",   // TODO: update to better model
        messages: perplexityMessages,
        // max_tokens: 256,
        // temperature: 0.2,
        // top_p: 0.9,
        // search_domain_filter: [],
        return_images: false,
        return_related_questions: false,
        // search_recency_filter: "month",
        // top_k: 0,
        // stream: false,
        // presence_penalty: 0,
        // frequency_penalty: 1,
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
    
    let content = data.choices?.[0]?.message?.content || "";

    // a) Find the first '[' and the last ']' in the content
    const startIndex = content.indexOf("[");
    const endIndex = content.lastIndexOf("]");

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      console.error("Could not find a valid JSON array in the response text:", content);
      throw new Error("No valid JSON array found in the response");
    }

    // b) Extract just the substring that we believe is the JSON array
    const jsonString = content.substring(startIndex, endIndex + 1);

    // c) Now parse it
    let suggestions;
    try {
      suggestions = JSON.parse(jsonString);
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
  // data = { userSwipes: [...], simulatedFriends: { friend1: [...], friend2: [...], ... } }

  console.log("Simulated API Request with Data:", data);

  // 1) Combine user swipes + all friend swipes into a single array
  const allSwipes = [...data.userSwipes];
  if (data.simulatedFriends) {
    Object.values(data.simulatedFriends).forEach((friendSwipes) => {
      allSwipes.push(...friendSwipes);
    });
  }

  // 2) Create a map to aggregate likes for each trip ID
  const aggregator = {}; 
  // aggregator[id] = { id, name, tags, description, likeCount, superlikeCount }

  // 3) Populate aggregator
  for (const swipeObj of allSwipes) {
    const { id, name, tags, description, swipe } = swipeObj;
    if (!aggregator[id]) {
      aggregator[id] = {
        id,
        name,
        tags,
        description,
        likeCount: 0,
        superlikeCount: 0,
      };
    }

    if (swipe === "like" || swipe === "superlike") {
      aggregator[id].likeCount += 1;
    }
    if (swipe === "superlike") {
      aggregator[id].superlikeCount += 1;
    }
  }

  // Convert aggregator to array
  const aggregatorArray = Object.values(aggregator);
  if (!aggregatorArray.length) {    // TODO find solution, e.g. return a default suggestion / error message to user
    console.error("No swipes found for perfect match calculation.");
    throw new Error("No swipes found");
  }

  // 4) Find the item(s) with the maximum likeCount
  const maxLikeCount = Math.max(...aggregatorArray.map((obj) => obj.likeCount));
  let topCandidates = aggregatorArray.filter(
    (obj) => obj.likeCount === maxLikeCount
  );

  // If there's exactly one top candidate, return it
  if (topCandidates.length === 1) {
    return topCandidates[0];
  }

  // Otherwise, check superlikeCount among top candidates
  const maxSuperlikeCount = Math.max(
    ...topCandidates.map((obj) => obj.superlikeCount)
  );
  let superlikeCandidates = topCandidates.filter(
    (obj) => obj.superlikeCount === maxSuperlikeCount
  );

  // If there's exactly one among the superlike candidates, return it
  if (superlikeCandidates.length === 1) {
    return superlikeCandidates[0];
  }

  // If still tied, pick randomly among the last tie group
  const randomIndex = Math.floor(Math.random() * superlikeCandidates.length);
  return superlikeCandidates[randomIndex];

  // Uncomment the following for a successful response simulation
  // return {
  //   name: "Kyoto, Japan",
  //   description: "A serene blend of ancient traditions and breathtaking landscapes.",
  // };
};







