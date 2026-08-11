import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateTripPlan = async (preferences) => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    Generate a detailed trip plan for a trip from ${preferences.origin} to ${preferences.destination} from ${preferences.startDate} to ${preferences.endDate}.
    Budget: ${preferences.budget}.
    Interests: ${preferences.interests}.

    Please provide the response in strict JSON format with the following structure:
    {
      "trip_details": {
        "origin": "${preferences.origin}",
        "destination": "${preferences.destination}",
        "duration": "Calculated number of days",
        "dates": "${preferences.startDate} to ${preferences.endDate}",
        "origin_coords": {"lat": number, "lng": number},
        "destination_coords": {"lat": number, "lng": number}
      },
      "en_route_stops": [
        {
          "name": "Stop Name",
          "description": "Why it's worth stopping here",
          "type": "Scenic/Food/Landmark",
          "lat": number,
          "lng": number
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "date": "YYYY-MM-DD",
          "day_of_week": "Monday/Tuesday/etc",
          "is_weekend": true/false,
          "theme": "Theme of the day",
          "activities": [
            {
              "time": "Morning",
              "description": "Activity description",
              "place_name": "Name of the place",
              "lat": number,
              "lng": number,
              "google_maps_query": "Search term for google maps"
            }
          ]
        }
      ],
      "budget_breakdown": {
        "accommodation": "Estimated cost",
        "food": "Estimated cost",
        "transportation": "Estimated cost",
        "activities": "Estimated cost",
        "total": "Estimated total cost"
      },
      "places": [
        {
          "name": "Place Name",
          "description": "Short description",
          "specifications": "Key features or specs (e.g., entry fee, best time to visit)",
          "lat": number,
          "lng": number,
          "google_maps_query": "Search term for google maps"
        }
      ],
      "packing_list": {
        "clothing": ["Item 1", "Item 2"],
        "electronics": ["Item 1", "Item 2"],
        "documents": ["Item 1", "Item 2"],
        "toiletries": ["Item 1", "Item 2"],
        "essentials": ["Item 1", "Item 2"]
      },
      "local_guide": {
        "climate_summary": "Expected weather and recommended clothing style",
        "currency_and_payments": "Local currency, card acceptance, tipping custom",
        "emergency_contacts": "Key emergency phone numbers and medical guidance",
        "local_etiquette": "Cultural norms, dress codes, do's and don'ts",
        "transport_tips": "Best ways to get around (metro, taxi, ride-hailing apps, bus)"
      }
    }
    Ensure the JSON is valid and does not contain any markdown formatting. Make sure latitude and longitude values are accurate real numerical values for the places, cities, and stops mentioned.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating trip plan:", error);
    throw error;
  }
};

