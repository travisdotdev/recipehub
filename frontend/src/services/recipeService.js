// recipeService.js

// Fallback data for when API is unavailable
const FALLBACK_RECIPES = [
    {
      id: 1,
      title: "Temporary Recipe 1",
      readyInMinutes: 30,
      servings: 4,
      image: "/api/placeholder/400/300",
      imageType: "jpg"
    },
    {
      id: 2,
      title: "Temporary Recipe 2",
      readyInMinutes: 45,
      servings: 6,
      image: "/api/placeholder/400/300",
      imageType: "jpg"
    },
    {
      id: 3,
      title: "Temporary Recipe 3",
      readyInMinutes: 25,
      servings: 2,
      image: "/api/placeholder/400/300",
      imageType: "jpg"
    }
  ];
  
  // Cache for storing recent API responses
  const cache = new Map();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  // Add base URL for backend
const API_BASE_URL = 'http://localhost:8080'; // or whatever port your Spring Boot server is running on

const recipeService = {
  async getRandomRecipes(number = 10, includeTags = '', excludeTags = '', includeNutrition = false) {
    // Create cache key
    const cacheKey = `random-${number}-${includeTags}-${excludeTags}-${includeNutrition}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const params = new URLSearchParams({
        number: Math.min(number, 20).toString(),
        ...(includeTags && { includeTags }),
        ...(excludeTags && { excludeTags }),
        includeNutrition: includeNutrition.toString()
      });

      // Add API_BASE_URL to fetch call
      const response = await fetch(`${API_BASE_URL}/api/recipes/random?${params}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const recipes = Array.isArray(data) ? data : [];

      // Cache the successful response
      cache.set(cacheKey, {
        data: recipes,
        timestamp: Date.now()
      });

      return recipes;

    } catch (error) {
      console.error('Error fetching random recipes:', error);
      return FALLBACK_RECIPES.slice(0, Math.min(number, FALLBACK_RECIPES.length));
    }
  }
};

export { recipeService };