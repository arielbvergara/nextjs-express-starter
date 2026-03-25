import { NearbyRestaurant } from "../types";
import { cache } from "../lib/cache";

// Target location: Merckenburg 10, Amsterdam, Netherlands
const NEARBY_SEARCH_LAT = 52.3256979;
const NEARBY_SEARCH_LNG = 4.8713088;
const NEARBY_SEARCH_RADIUS_METERS = 5000;

// Places API (New) — Nearby Search endpoint
// Docs: https://developers.google.com/maps/documentation/places/web-service/nearby-search
const PLACES_API_BASE_URL = "https://places.googleapis.com/v1";

// Only the fields we need; narrow mask reduces billing cost.
// websiteUri is included so we can filter it out server-side.
const FIELD_MASK = [
  "places.displayName",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.editorialSummary",
  "places.formattedAddress",
].join(",");

const CACHE_KEY_NEARBY_RESTAURANTS = "nearby-restaurants-no-website";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// ── Places API (New) response types ──────────────────────────────────────────

type PlacesApiPlace = {
  displayName?: { text: string };
  websiteUri?: string;
  googleMapsUri?: string;
  editorialSummary?: { text: string };
  formattedAddress?: string;
};

type PlacesApiNearbyResponse = {
  places?: PlacesApiPlace[];
  error?: { message: string; status: string };
};

// ─────────────────────────────────────────────────────────────────────────────

const MOCK_NEARBY_RESTAURANTS: NearbyRestaurant[] = [
  {
    name: "Café De Pijp",
    description: "A cozy neighbourhood café serving Dutch comfort food in the heart of De Pijp district.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9+De+Pijp+Amsterdam",
  },
  {
    name: "Eetcafé 't Smalle",
    description: "Traditional Dutch brown café on one of Amsterdam's most picturesque canals.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Eetcaf%C3%A9+t+Smalle+Amsterdam",
  },
  {
    name: "Restaurante El Rincón",
    description: "Family-run Spanish tapas restaurant offering authentic home-cooked cuisine.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante+El+Rincon+Amsterdam",
  },
  {
    name: "Brasserie Zuidpool",
    description: "Laid-back brasserie in Amsterdam-Zuid with a daily changing menu of seasonal dishes.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Brasserie+Zuidpool+Amsterdam",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export class NearbyRestaurantsService {
  private readonly mapsApiKey: string;

  constructor(mapsApiKey: string) {
    this.mapsApiKey = mapsApiKey;
  }

  async getNearbyRestaurantsWithoutWebsite(): Promise<NearbyRestaurant[]> {
    const cached = cache.get<NearbyRestaurant[]>(CACHE_KEY_NEARBY_RESTAURANTS);
    if (cached) {
      return cached;
    }

    if (!this.mapsApiKey) {
      return this.getMockRestaurants();
    }

    return this.fetchFromPlacesApi();
  }

  getMockRestaurants(): NearbyRestaurant[] {
    return MOCK_NEARBY_RESTAURANTS;
  }

  private async fetchFromPlacesApi(): Promise<NearbyRestaurant[]> {
    const response = await fetch(`${PLACES_API_BASE_URL}/places:searchNearby`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.mapsApiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        includedTypes: ["restaurant"],
        locationRestriction: {
          circle: {
            center: {
              latitude: NEARBY_SEARCH_LAT,
              longitude: NEARBY_SEARCH_LNG,
            },
            radius: NEARBY_SEARCH_RADIUS_METERS,
          },
        },
        maxResultCount: 20,
      }),
    });

    if (!response.ok) {
      throw new Error(`Places API (New) nearby search failed with HTTP ${response.status}`);
    }

    const json = (await response.json()) as PlacesApiNearbyResponse;

    if (json.error) {
      throw new Error(
        `Places API (New) returned error: ${json.error.status} — ${json.error.message}`
      );
    }

    const restaurants: NearbyRestaurant[] = (json.places ?? [])
      .filter((place) => !place.websiteUri)
      .map((place) => ({
        name: place.displayName?.text ?? "Unknown Restaurant",
        description:
          place.editorialSummary?.text ?? place.formattedAddress ?? "",
        mapsUrl: place.googleMapsUri ?? "",
      }));

    cache.set(CACHE_KEY_NEARBY_RESTAURANTS, restaurants, CACHE_TTL_MS);

    return restaurants;
  }
}
