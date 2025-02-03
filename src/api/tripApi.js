import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

// const API_KEY = process.env.REACT_APP_PERPLEXITY_API_KEY;
const perplexityURL = "https://api.perplexity.ai/chat/completions";
const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;

export const fetchSwipeSuggestions = async (tripDetails, preferences) => {

  try {
    // 1) Build the request payload for the LLM
    const messages = [
      {
        role: "system",
        content:
          "You are an expert at recommending trip suggestions matching certain user preferences",
      },
      {
        role: "user",
        // Ask LLM to respond ONLY with a JSON array of suggestions
        content: `
        <Task>
        Generate 7 suggestions for a trip based on the following trip details and preferences:

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
        - Focus on places that are suitable for travelers and groups of friends.
        - Regarding temperature, consider also the season of the given time frame to align with the preference.
        - The given examples should be as diverse as possible. 
        - The places we want to travel to should also be perfectly aligned with the given trip details. So the date of travel and the given budget should fit to 
        the given suggestion.
        - For finding the right places to the given budget assume the following
        things: 
          - We always start our trip from Munich, Germany, so try to do an estimation of the travel costs to the suggested place based on the starting point
          - Then try to align the preferences with the given budget and the duration
          - Give us only realistic suggestions that can be done with the given budget and the given duration of the trip.
          - So e.g. for a day trip with a budget of maximum 20 Euros, places like Salzburg, Regensburg or Garmisch are feasible since they can be done in one day with 20 Euros; but not e.g. Lisboa, Rome or Madrid since those are too far for a daytrip and too expensive for 20 Euros
          - The places should be perfectly aligned with the given trip details and preferences, dates and budget being the most important ones to adhere to (since else the trip would not be feasible). That means that even if user preference is warm, do not propose places in Spain if e.g. the user wants to travel in the winter for only 1 day with a maximum budget of 20 Euros but you have to choose local ones which might not be as warm.



        For every attribute in the suggestions respect the following rules:
        1. name: 
        - Provide for each place the name of the location and country it is in, separated by a comma, e.g.: Barcelona, Spain; Lapland, Finland
        - In case the location and the country are the same, provide the location and the region instead, so e.g: Barbados, Carribean (instead of Barbados, Barbados)
        2. tags: 
        - Provide 5 suitable tags that descibe the suggestion in the best possible way
        - Limit each tag to 10 characters
        3. shortDescription:
        - Should cover the most important facts about the suggestion
        - Should be formulated in a brief an catchy way covering up to 10 words, e.g.: "Where culture, beaches, and nightlife create epic adventures!
        4. description:
        - Consists of at least 5 to 10 sentences that describes the suggestion in an inspiring, personal, precise and cheeky way
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
          ...
        ]
        </Examples>
        `,
      },
    ];

    console.log(messages);

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-70b-instruct:free", // TODO: update to better model
        messages: messages,
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
        // repetition_penalty: 1
      }),
    };

    // 2) Call the LLM API
    const response = await fetch(OPENROUTER_URL, requestOptions);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch suggestions from Perplexity: ${response.status}`
      );
    }
    const data = await response.json();

    // 3) Parse the raw JSON array from the response
    //    (We assume LLM returns valid JSON in data.choices[0].message.content)

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
    const messages = [
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
	      // TODO @Phi Linh - Trip Details: {JSON.stringify(allTripDetails)}
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
        - Focus on a place that is suitable for the given number of travelers in the group
        - Regarding temperature, consider also the season of the given time frame to align with the preference.
        - The place should also be perfectly aligned with the given trip details. So the date of travel and the given budget should fit to 
        the given suggestion.
        - For finding the right place to the given budget assume the following
        things: 
          - We always start our trip from Munich, Germany, so try to do an estimation of the travel costs to the suggested place based on the starting point
          - Then try to align the preferences with the given budget and the duration
          - Give us only realistic suggestions that can be done with the given budget and the given duration of the trip.
          - So e.g. for a day trip with a budget of maximum 20 Euros, places like Salzburg, Regensburg or Garmisch are feasible since they can be done in one day with 20 Euros; but not e.g. Lisboa, Rome or Madrid since those are too far for a daytrip and too expensive for 20 Euros
          - The place should be perfectly aligned with the given trip details and preferences, dates and budget being the most important ones to adhere to (since else the trip would not be feasible). That means that even if user preference is warm, do not propose places in Spain if e.g. the user wants to travel in the winter for only 1 day with a maximum budget of 20 Euros but you have to choose local ones which might not be as warm.


        For every attribute in the suggestion respect the following rules:
        1. name: 
        - Provide for the place the name of the location and country it is in, separated by a comma, e.g.: Barcelona, Spain
        - In case the location and the country are the same, provide the location and the region instead, so e.g: Barbados, Carribean (instead of Barbados, Barbados)
        2. tags: 
        - Provide 5 suitable tags that descibe the suggestion in the best possible way
        - Limit each tag to 10 characters
        3. description:
        - Should cover the most important facts about the suggestion
        - Consists of around 10 sentences that describes the suggestion in an inspiring, personal, precise and cheeky way
        - The text is targeted at young individuals aiming to go on a group trip. It should give a good impression
        on what can be done and general summary of the suggestion. 
        4. recommendations:
        - Provide 2-3 restaurants and accomodations suiting the trip details (especially budget) and preferences
        5. userPreferences:
        - Provide approximate preferenceMatch scores for each user between 0 and 100, higher scores indicating a better match between place and respective user preference
        - Consider for the estimation all preferences and swipes of the users, e.g. if a user swiped right on a place that is similar to the final suggestion, the preferenceMatch should be higher, or if a user prefers cold weather , the preferenceMatch for a hot place like Dubai should be low
        

        
        </Task>
        
        <Example>
	      {
		    name: "Barcelona, Spain",
		    tags: ["sightseeing", "shopping", "beach", "nightlife", "water sport"],
		    description:
		      "Barcelona is a city that brings together the best of history, modernity, 
            and vibrant energy, making it the ultimate destination for any traveler. Wander through 
            the enchanting Gothic Quarter, where narrow alleys lead to stunning medieval architecture 
            and charming hidden cafés. Marvel at Gaudí’s whimsical masterpieces like Sagrada Família 
            and Park Güell, offering surreal landscapes that are perfect for sunset views. By day, soak up 
            the Mediterranean sun at Barceloneta Beach, and by night, dive into the city's electric nightlife—whether 
            it’s sipping cocktails on a rooftop bar, enjoying flamenco performances, or dancing until dawn in world-class clubs. 
            Every moment in Barcelona feels like an adventure waiting to happen",
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
		      { userId: "john", preferenceMatch: 69 },
		      { userId: "lisa", preferenceMatch: 73 },
		      { userId: "emma", preferenceMatch: 96 },
			    ],
			  };
        </Example>
        `
      }
    ];

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-70b-instruct:free",
        messages: messages,
        return_images: false,
        return_related_questions: false,
      }),
    };

    // Call Perplexity API
    const response = await fetch(OPENROUTER_URL, requestOptions);
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
    const pexelsImage = await fetchPexelsImage(finalMatch.name + "landscape tourism");
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


export const fetchPexelsImages = async (query) => {
  try {
    // Changed per_page from 1 to 5 to fetch five images
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query
    )}&per_page=5`; // NEW CODE: Fetch 5 images
    const response = await fetch(url, {
      headers: {
        Authorization: process.env.REACT_APP_PEXELS_API_KEY, // stored in .env
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Pexels");
    }

    const data = await response.json();
    // Return an array of image URLs using 'large2x' if available, else 'large'
    if (data.photos && data.photos.length > 0) {
      return data.photos.map(
        (photo) => photo.src.large2x || photo.src.large
      );
    }
    return ["https://via.placeholder.com/300x600"]; // fallback image if no photos
  } catch (error) {
    console.error("Pexels API error:", error);
    return ["https://via.placeholder.com/300x600"]; // fallback image on error
  }
};