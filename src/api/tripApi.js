import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const API_KEY = process.env.REACT_APP_PERPLEXITY_API_KEY;
const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;

export const fetchSwipeSuggestions = async (tripDetails, preferences) => {
  try {
    // 1) Build the request payload for Perplexity API
    const perplexityURL = "https://api.perplexity.ai/chat/completions";
    const perplexityMessages = [
      {
        role: "system",
        content:
          "You are an expert at recommending trip suggestions matching certain user preferences",
      },
      {
        role: "user",
        // Ask Perplexity to respond ONLY with a JSON array of suggestions
        content: `
        <Task>
        Generate 3 suggestions for a trip based on the following trip details and preferences:

        1. Trip Details:       
        ${JSON.stringify(tripDetails)} 

        2. Preferences: ${JSON.stringify(preferences)} 

        Return the suggestions ONLY as a valid JSON array of objects. No extra commentary, no code fences, no markdown blocks. Only a raw JSON array.
       All property names have to be double-quoted. The JSON array and objects should look like:
        [
        {
          "name": "...",
          "tags": ["..."],
          "shortDescription": "...",
          "description": "..."
        }, 
        ...
        ]

        For the suggestion of places respect the following rules:
        - Provide places from all around the world
        - Focus on places that are suitable for travelers and groups of friends.
        - The places should be perfectly alligned with the given preferences.
        - The given examples should be as diverse as possible and should include places from different
        ccountries and enable doing different activities, still aligning with the preferences. 
        - The places we want to travel to should also be perfectly aligned with the given trip details. So the date of travel and the given budget should fit to 
        the given suggestion.
        - For finding the right places to the given budget assume the following
        things: 
          - We always start our trip from Munich, Germany, so try to do an estimation of the travel costs to the suggested place based on the starting point
          - Then try to align the preferences with the given budget and the duration
          - Give us only realistic suggestions that can be done with the given budget and the given duration of the trip.



        For every attribute in the suggestions respect the following rules:
        1. name: 
        - Provide for each place the name of the location and country it is in, separated by a comma, e.g.: Barcelona, Spain; Lapland, Finland
        2. tags: 
        - Provide 5 suitable tags that descibe the suggestion in the best possible way
        - Limit each tag to 10 characters
        3. shortDescription:
        - Should cover the most important facts about the suggestion
        - Should be formulated in a brief an catchy way covering up to 10 words, e.g.: "Where culture, beaches, and nightlife create epic adventures!
        4. description:
        - Consists of 4-5 sentences that describes the suggestion in an inspiring, personal, precise and cheeky way
        - The text is targeted at young individuals aiming to go on a group trip. It should give a good impression
        on what can be done and general summary of the suggestion. 

        </Task>

        <Examples>
        [
          {
            name: "Barcelona, Spain",
            tags: ["#Beaches #Culture #Nightlife #Food #Adventure"],
            shortDescription: "Where culture, beaches, and nightlife create epic adventures!"
            description: "Barcelona is a city that brings together the best of history, modernity, 
            and vibrant energy, making it the ultimate destination for any traveler. Wander through 
            the enchanting Gothic Quarter, where narrow alleys lead to stunning medieval architecture 
            and charming hidden cafés. Marvel at Gaudí’s whimsical masterpieces like Sagrada Família 
            and Park Güell, offering surreal landscapes that are perfect for sunset views. By day, soak up 
            the Mediterranean sun at Barceloneta Beach, and by night, dive into the city's electric nightlife—whether 
            it’s sipping cocktails on a rooftop bar, enjoying flamenco performances, or dancing until dawn in world-class clubs. 
            Every moment in Barcelona feels like an adventure waiting to happen",

          },
          {
            name: "Miami, USA",
            tags: ["#Beaches #Nightlife #Art #Food #Vibes"],
            shortDescription: "Where sun, style, and nonstop fun collide effortlessly!"
            description:
              "Miami is a city that radiates energy, making it a must-visit for those who love a mix of beach life, art, 
              and incredible food. Spend your mornings walking the Art Deco-lined streets of South Beach before diving 
              into its crystal-clear waters. Take a trip to the Wynwood Walls to witness one of the most impressive urban 
              art scenes in the world, or explore the diverse culinary offerings in Little Havana, where Cuban coffee and 
              authentic sandwiches transport you straight to Havana. As the sun sets, Miami comes alive—rooftop lounges, 
              oceanfront parties, and iconic clubs ensure that your nights are as thrilling as your days. Whether you’re on a 
              yacht, in a poolside cabana, or dancing beneath neon lights, Miami guarantees unforgettable moments",
          },
          {
            name: "Kyoto, Japan",
            tags: [#Culture #Temples #Nature #Food #Zen],
            shortDescription: "Where ancient traditions meet modern squad-worthy adventures!"
            description:
              "Kyoto is your gateway to Japan’s serene charm, perfect for a group 
              craving culture and beauty. Wander through the mesmerizing Arashiyama 
              Bamboo Grove, snap iconic photos at the red torii gates of Fushimi 
              Inari Shrine, and enjoy a tea ceremony to experience timeless traditions. 
              Whether you’re biking along picturesque streets or sampling  local 
              delicacies, Kyoto blends zen and excitement for a trip your crew will 
              never forget. Enjoy a moment of tranquility in the beautifully maintained Zen gardens of Ryoanji, before indulging 
              in Kyoto’s renowned kaiseki cuisine—a multi-course feast that celebrates seasonal flavors. Kyoto is more than a destination; 
              it’s a journey into Japan’s soul, offering an unforgettable mix of adventure and serenity",
          },
        ]
        </Examples>
        `,
      },
    ];

    const perplexityRequestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar", // TODO: update to better model
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
      throw new Error(
        `Failed to fetch suggestions from Perplexity: ${response.status}`
      );
    }
    const data = await response.json();

    // 3) Parse the raw JSON array from the response
    //    (We assume Perplexity returns valid JSON in data.choices[0].message.content)

    let content = data.choices?.[0]?.message?.content || "";
    console.log(content);

    // a) Find the first '[' and the last ']' in the content
    const startIndex = content.indexOf("[");
    const endIndex = content.lastIndexOf("]");

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      console.error(
        "Could not find a valid JSON array in the response text:",
        content
      );
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

export const fetchPerfectMatch = async (tripId) => {
  try {
    // Fetch trip data from Firestore
    const tripRef = doc(db, "trips", tripId);
    const tripSnap = await getDoc(tripRef);
    if (!tripSnap.exists()) {
      throw new Error(`Trip with ID ${tripId} not found in Firestore.`);
    }
    const tripData = tripSnap.data();

    // Gather all preferences and swipes from Firestore
    const allPreferences = tripData.preferences || [];
    const allUserSuggestions = tripData.suggestions || [];

    // Perplexity API Request for fetchPerfectMatch
    const perplexityMessages = [
      {
        role: "system",
        content: "You are an expert at recommending a trip that best matches all group preferences.",
      },
      {
        role: "user",
        content: 
        `
        <Task>
   
        Generate a final best trip match based on the following:   
	      // TODO - Trip Details: ${JSON.stringify(allTripDetails)}
        - Preferences: ${JSON.stringify(allPreferences)}
        - Swipes: ${JSON.stringify(allUserSuggestions)}

        Return ONLY as a valid JSON object:
        {
          "name": "...",
          "tags": ["..."],
          "description": "...",
          "recommendations": {
            "restaurants": [{"name": "..."}, ...],
            "accommodations": [{"name": "..."}, ...]
          },
          "userPreferences": [{"userId": "...", "preferenceMatch": 90}, ...]
        }
        No extra commentary, no code fences, no markdown blocks. Only raw JSON.
        
        For the suggestion of the final best place respect the following rules:
        - Provide a place from all around the world
        - Focus on a place that is suitable for the given number of travelers in the group
        - The place should be perfectly aligned with the given preferences and swipes.
        
        - The place should also be perfectly aligned with the given trip details. So the date of travel and the given budget should fit to 
        the given suggestion.
        - For finding the right place to the given budget assume the following
        things: 
          - We always start our trip from Munich, Germany, so try to do an estimation of the travel costs to the suggested place based on the starting point
          - Then try to align the preferences with the given budget and the duration
          - Give us only realistic suggestions that can be done with the given budget and the given duration of the trip.



        For every attribute in the suggestion respect the following rules:
        1. name: 
        - Provide for the place the name of the location and country it is in, separated by a comma, e.g.: Barcelona, Spain
        2. tags: 
        - Provide 5 suitable tags that descibe the suggestion in the best possible way
        - Limit each tag to 10 characters
        3. description:
        - Should cover the most important facts about the suggestion
        - Consists of 2-3 sentences that describes the suggestion in an inspiring, personal, precise and cheeky way
        - The text is targeted at young individuals aiming to go on a group trip. It should give a good impression
        on what can be done and general summary of the suggestion. 
        4. recommendations:
        - Provide 2-3 restaurants and accomodations suiting the trip details (especially budget) and preferences
        5. userPreferences:
        - Provide approximate preferenceMatch scores for each user between 0 and 100, higher scores indicating a better match between place and respective user preference
        

        
        </Task>
        
        <Example>
	      {
		    name: "Barcelona, Spain",
		    tags: ["sightseeing", "shopping", "beach", "nightlife", "water sport"],
		    description:
		      "Get ready to fall in love with Barcelona—a city that blends vibrant culture, stunning architecture, and Mediterranean charm. This trip will take you through the iconic Sagrada Familia, the whimsical wonders of Park Güell, and the winding streets of the Gothic Quarter. You’ll sip sangria by the beach, devour mouthwatering tapas, and soak up breathtaking views from Montjuïc Hill.",
		    recommendations: {
		      restaurants: [
		        { name: "Nine"},
		        { name: "La Lotja"},
		        { name: "El Tributz"},
		      ],
		      accommodations: [
		        { name: "Mandarin Oriental"},
		        { name: "W Hotel"},
		        { name: "Hyatt Regency"},
		      ],
		    },
		    userPreferences: [
		      { userId: "john", preferenceMatch: 100 },
		      { userId: "lisa", preferenceMatch: 90 },
		      { userId: "emma", preferenceMatch: 93 },
			    ],
			  };
        </Example>
        `
      }
    ];

    const perplexityURL = "https://api.perplexity.ai/chat/completions";
    const perplexityRequestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: perplexityMessages,
        return_images: false,
        return_related_questions: false,
      }),
    };

    // Call Perplexity API
    const response = await fetch(perplexityURL, perplexityRequestOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch perfect match: ${response.status}`);
    }
    const data = await response.json();

    // Parse response content
    let content = data.choices?.[0]?.message?.content || "";
    const startIndex = content.indexOf("{");
    const endIndex = content.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      throw new Error("No valid JSON object found in the response");
    }

    const jsonString = content.substring(startIndex, endIndex + 1);
    let finalMatch = JSON.parse(jsonString);

    // Fetch profile pictures for each user
    for (const user of finalMatch.userPreferences) {
      const userRef = doc(db, "users", user.userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        user.profilePicture =
          userSnap.data().profilePicture || "/assets/images/emptyProfile.jpg"; // Fallback image
      } else {
        user.profilePicture = "/assets/images/emptyProfile.jpg"; // Fallback image
      }
    }

    // Fetch background image from Pexels
    const pexelsImage = await fetchPexelsImage(finalMatch.name);
    finalMatch.backgroundImage = pexelsImage;

    console.log("Perfect Match from Perplexity:", finalMatch);
    return finalMatch;
  } catch (error) {
    console.error("API Error (fetchPerfectMatch):", error);
    throw error;
  }
};

const fetchPexelsImage = async (query) => {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query
    )}&per_page=1`; // We only want the top match
    const response = await fetch(url, {
      headers: {
        Authorization: process.env.REACT_APP_PEXELS_API_KEY, // stored in .env
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Pexels");
    }

    const data = await response.json();
    // Return the 'large' image if we have results, else fallback to placeholder
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.large2x || data.photos[0].src.large;
    }
    return "https://via.placeholder.com/300x600"; // fallback TODO: update placeholder image with good one
  } catch (error) {
    console.error("Pexels API error:", error);
    return "https://via.placeholder.com/300x600"; // fallback TODO: update placeholder image with good one
  }
};
