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
const API_BASE_URL = 'http://localhost:8080';

const recipeService = {
  async getRandomRecipes(number = 20, includeTags = '', excludeTags = '', includeNutrition = false) {
    const cacheKey = `random-${number}-${includeTags}-${excludeTags}-${includeNutrition}`;
    
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

      cache.set(cacheKey, {
        data: recipes,
        timestamp: Date.now()
      });

      return recipes;

    } catch (error) {
      console.error('Error fetching random recipes:', error);
      return FALLBACK_RECIPES.slice(0, Math.min(number, FALLBACK_RECIPES.length));
    }
  },

  async searchRecipes(query, options = {}) {
    try {
      const params = new URLSearchParams({
        query: query,
        number: options.number || 10,
        addRecipeInformation: true,
        fillIngredients: true,
        ...options
      });

      const cacheKey = `search-${params.toString()}`;
      const cachedData = cache.get(cacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return cachedData.data;
      }

      const response = await fetch(`${API_BASE_URL}/api/recipes/complexSearch?${params}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const recipes = Array.isArray(data) ? data : [];

      cache.set(cacheKey, {
        data: recipes,
        timestamp: Date.now()
      });

      return recipes;

    } catch (error) {
      console.error('Error searching recipes:', error);
      return FALLBACK_RECIPES;
    }
  },

  async searchByIngredients(ingredients, number = 10) {
    try {
      const params = new URLSearchParams({
        ingredients: ingredients,
        number: number,
        ranking: 2,  // maximize used ingredients
        ignorePantry: true,
        addRecipeInformation: true,  // Added to get full recipe details
        fillIngredients: true        // Added to get complete ingredient information
      });

      const cacheKey = `ingredients-${params.toString()}`;
      const cachedData = cache.get(cacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return cachedData.data;
      }

      const response = await fetch(`${API_BASE_URL}/api/recipes/searchByIngredients?${params}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Ensure all required fields are present
      const recipes = Array.isArray(data) ? data.map(recipe => ({
        ...recipe,
        readyInMinutes: recipe.readyInMinutes || 30, // Default value if missing
        servings: recipe.servings || 4,              // Default value if missing
        image: recipe.image || "/api/placeholder/400/300",
        imageType: recipe.imageType || "jpg"
      })) : [];

      cache.set(cacheKey, {
        data: recipes,
        timestamp: Date.now()
      });

      return recipes;

    } catch (error) {
      console.error('Error searching recipes by ingredients:', error);
      return FALLBACK_RECIPES;
    }
  },

  async getRecipeById(id) {
    try {
      const cacheKey = `recipe-${id}`;
      const cachedData = cache.get(cacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return cachedData.data;
      }

      const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const recipe = await response.json();

      cache.set(cacheKey, {
        data: recipe,
        timestamp: Date.now()
      });

      return recipe;

    } catch (error) {
      console.error('Error fetching recipe details:', error);
      return FALLBACK_RECIPES[0];
    }
  }
};

export { recipeService };