import { db } from "../firebase/firebase"; 
import { doc, getDoc } from "firebase/firestore";

const API_KEY = process.env.REACT_APP_PERPLEXITY_API_KEY;
const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;

export const fetchSwipeSuggestions = async (tripDetails, preferences) => {
  try {
    // 1) Build the request payload for Perplexity API
    const perplexityURL = "https://api.perplexity.ai/chat/completions";
    const perplexityMessages = [
      { role: "system", content: "You are an expert at recommending trip suggestions matching certain user preferences" },
      {
        role: "user",
        // Ask Perplexity to respond ONLY with a JSON array of suggestions
        content:                
        `
        <Task>
        Generate 3 suggestions for a trip based on the following trip details and preferences:

        1. Trip Details:       
        ${JSON.stringify(
          tripDetails
        )} 

        2. Preferences: ${JSON.stringify(
          preferences
        )} 

        Return the suggestions ONLY as a valid JSON array of objects. No extra commentary, no code fences, no markdown blocks. Only a raw JSON array.
        The JSON array and objects should look like:
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
        - Consists of 2-3 sentences that describes the suggestion in an inspiring, personal, precise and cheeky way
        - The text is targeted at young individuals aiming to go on a group trip. It should give a good impression
        on what can be done and general summary of the suggestion. 

        </Task>

        <Examples>
        [
          {
            name: "Barcelona, Spain",
            tags: ["#Beaches #Culture #Nightlife #Food #Adventure"],
            shortDescription: "Where culture, beaches, and nightlife create epic adventures!"
            description: "Barcelona is the ultimate destination for your crew, offering
            everything from sun-soaked beach days to jaw-dropping Gaudí architecture 
            and nights that don’t stop until sunrise. Explore the vibrant Gothic Quarter,
            feast on endless tapas, and catch golden hour at Park Güell for 
            unforgettable views. It’s the perfect mix of culture, chaos, and coastal 
            vibes, tailor-made for squad-level memories."

        Tags:
        #BeachVibes #GaudíDreamscape #EpicNightlife #FoodieHeaven #ArtAndAdventure",
          },
          {
            name: "Miami, USA",
            tags: ["#Beaches #Nightlife #Art #Food #Vibes"],
            shortDescription: "Where sun, style, and nonstop fun collide effortlessly!"
            description:
              "Miami is a playground of golden beaches, vibrant nightlife, and bold flavors 
              that will have your group living their best lives. Spend your days soaking up 
              rays in South Beach, exploring the artsy Wynwood district, or feasting on Cuban 
              sandwiches in Little Havana. When night falls, the city turns electric—perfect 
              for dancing, rooftop cocktails, and making unforgettable squad memories.",
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
              never forget",
          },
        ]
        </Examples>
        `
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
    //    (We assume Perplexity returns valid JSON in data.choices[0].message.content) 
    
    let content = data.choices?.[0]?.message?.content || "";
    console.log(content);

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

export const fetchPerfectMatch = async (tripId) => {
  try {
    // 1) Fetch trip doc from Firestore to gather all real user preferences & swipes
    const tripRef = doc(db, "trips", tripId);
    const tripSnap = await getDoc(tripRef);
    if (!tripSnap.exists()) {
      throw new Error(`Trip with ID ${tripId} not found in Firestore.`);
    }
    const tripData = tripSnap.data();

    // 'preferences' is an array with objects like { creatorId, preferences: [...] }
    const allPreferences = tripData.preferences || [];

    // 'suggestions' is an array with objects like { creatorId, answers: [...] }
    // Each user might have different suggestions and different swipe answers
    const allUserSuggestions = tripData.suggestions || [];

    // 2) Build a single prompt that includes all preferences & swipes. 
    //    Let Perplexity figure out the best final suggestion.
    const perplexityMessages = [
      {
        role: "system",
        content: "You are an expert at recommending trip suggestions matching different needs of users in a group."
      },
      {
        role: "user",
        content: `We have a group trip. The Firestore data is:
        Preferences: ${JSON.stringify(allPreferences)}
        Swipes: ${JSON.stringify(allUserSuggestions)}
        We want one final best match (the single best suggestion) for the entire group. 
        Return it ONLY as a valid JSON object with the following fields:
        {
          "name": "...",
          "tags": ["..."],
          "description": "..."
        }

        E.g.:
        {
          name: "Barcelona, Spain",
          tags: ["sightseeing", "shopping", "beach"],
          description: "Where culture meets coastline. Explore Gaudí’s wonders.",
        }
        No extra commentary, no code fences, no markdown blocks. Only a raw JSON object.`
      }
    ];

    // 3) Make the API call to Perplexity
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

    const response = await fetch(perplexityURL, perplexityRequestOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch perfect match from Perplexity: ${response.status}`);
    }
    const data = await response.json();

    // 4) Parse JSON from the returned content
    let content = data.choices?.[0]?.message?.content || "";
    const startIndex = content.indexOf("{");
    const endIndex = content.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      console.error("Could not find a valid JSON object in the response text:", content);
      throw new Error("No valid JSON object found in the response");
    }

    const jsonString = content.substring(startIndex, endIndex + 1);

    let finalMatch;
    try {
      finalMatch = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing perfect match from Perplexity:", parseError);
      throw new Error("Error parsing perfect match from Perplexity");
    }

    console.log("Perfect match from Perplexity:", finalMatch);
    return finalMatch;
  } catch (error) {
    console.error("API Error (fetchPerfectMatch):", error);
    throw error;
  }

  //  Uncomment the following for a successful response simulation
  //  return {
  //         name: "Barcelona, Spain",
  //         tags: ["sightseeing", "shopping", "beach"],
  //         description: "Where culture meets coastline. Explore Gaudí’s wonders.",
  //         }
};





