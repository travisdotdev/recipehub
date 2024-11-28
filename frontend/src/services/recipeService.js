// Fallback data and constants
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

const API_BASE_URL = 'http://localhost:8080';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Enhanced cache implementation
class Cache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new Cache();

// Helper function for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper function for retrying failed requests
async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      await delay(RETRY_DELAY);
      console.log(`Retrying request to ${url}. Attempts remaining: ${retries - 1}`);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

const recipeService = {
  async getRandomRecipes(number = 30, includeTags = '', excludeTags = '', includeNutrition = false) {
    const cacheKey = `random-${number}-${includeTags}-${excludeTags}-${includeNutrition}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) return cachedData;

    try {
      const params = new URLSearchParams({
        number: Math.min(number, 50).toString(),
        ...(includeTags && { includeTags }),
        ...(excludeTags && { excludeTags }),
        includeNutrition: includeNutrition.toString()
      });

      const data = await fetchWithRetry(
        `${API_BASE_URL}/api/recipes/random?${params}`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );

      const recipes = Array.isArray(data) ? data : [];
      cache.set(cacheKey, recipes);
      return recipes;

    } catch (error) {
      console.error('Error fetching random recipes:', error);
      return FALLBACK_RECIPES.slice(0, Math.min(number, FALLBACK_RECIPES.length));
    }
  },

  async searchRecipes(query, options = {}) {
    const params = new URLSearchParams({
      query: query,
      number: options.number || 10,
      addRecipeInformation: true,
      fillIngredients: true,
      ...options
    });

    const cacheKey = `search-${params.toString()}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) return cachedData;

    try {
      const data = await fetchWithRetry(
        `${API_BASE_URL}/api/recipes/complexSearch?${params}`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );

      const recipes = Array.isArray(data) ? data : [];
      cache.set(cacheKey, recipes);
      return recipes;

    } catch (error) {
      console.error('Error searching recipes:', error);
      return FALLBACK_RECIPES;
    }
  },

  async searchByIngredients(ingredients, number = 10) {
    const params = new URLSearchParams({
      ingredients: ingredients,
      number: number,
      ranking: 2,
      ignorePantry: true,
      addRecipeInformation: true,
      fillIngredients: true
    });

    const cacheKey = `ingredients-${params.toString()}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) return cachedData;

    try {
      const data = await fetchWithRetry(
        `${API_BASE_URL}/api/recipes/searchByIngredients?${params}`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );

      const recipes = Array.isArray(data) ? data.map(recipe => ({
        ...recipe,
        readyInMinutes: recipe.readyInMinutes || 30,
        servings: recipe.servings || 4,
        image: recipe.image || "/api/placeholder/400/300",
        imageType: recipe.imageType || "jpg"
      })) : [];

      cache.set(cacheKey, recipes);
      return recipes;

    } catch (error) {
      console.error('Error searching recipes by ingredients:', error);
      return FALLBACK_RECIPES;
    }
  },

  async getRecipeById(id) {
    const cacheKey = `recipe-${id}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) return cachedData;

    try {
      const recipe = await fetchWithRetry(
        `${API_BASE_URL}/api/recipes/${id}`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );

      cache.set(cacheKey, recipe);
      return recipe;

    } catch (error) {
      console.error('Error fetching recipe details:', error);
      return FALLBACK_RECIPES[0];
    }
  }
};

export { recipeService };