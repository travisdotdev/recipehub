// useRecipes.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { recipeService } from '../services/recipeService';

const useRecipes = () => {
  const [recipes, setRecipes] = useState({
    featured: [],
    popular: [],
    latest: []
  });
  const [isLoading, setIsLoading] = useState({
    featured: true,
    popular: true,
    latest: true
  });
  const [error, setError] = useState({
    featured: null,
    popular: null,
    latest: null
  });

  // Use refs to track mounted state and prevent memory leaks
  const isMounted = useRef(true);
  const fetchTimeouts = useRef({});

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      // Clear any pending timeouts
      Object.values(fetchTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  // Map API response to match your RecipeCard component's expected format
  const mapRecipeData = (recipe) => ({
    id: recipe.id,
    title: recipe.title,
    readyInMinutes: recipe.readyInMinutes || 30,
    servings: recipe.servings || 4,
    image: recipe.image || '/api/placeholder/400/300',
    imageType: recipe.imageType || 'jpg',
  });

  const fetchWithDebounce = useCallback((key, fetchFunction, delay = 1000) => {
    if (fetchTimeouts.current[key]) {
      clearTimeout(fetchTimeouts.current[key]);
    }

    fetchTimeouts.current[key] = setTimeout(async () => {
      if (!isMounted.current) return;
      await fetchFunction();
      delete fetchTimeouts.current[key];
    }, delay);
  }, []);

  const fetchFeaturedRecipes = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      setIsLoading(prev => ({ ...prev, featured: true }));
      const data = await recipeService.getRandomRecipes(5);
      
      if (!isMounted.current) return;
      
      const mappedData = data.map(mapRecipeData);
      setRecipes(prev => ({ ...prev, featured: mappedData }));
      setError(prev => ({ ...prev, featured: null }));
    } catch (err) {
      console.error('Error fetching featured recipes:', err);
      if (isMounted.current) {
        setError(prev => ({ 
          ...prev, 
          featured: 'Failed to load featured recipes. Please try again later.'
        }));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(prev => ({ ...prev, featured: false }));
      }
    }
  }, []);

  const fetchPopularRecipes = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      setIsLoading(prev => ({ ...prev, popular: true }));
      const data = await recipeService.getRandomRecipes(5, 'popular');
      
      if (!isMounted.current) return;
      
      const mappedData = data.map(mapRecipeData);
      setRecipes(prev => ({ ...prev, popular: mappedData }));
      setError(prev => ({ ...prev, popular: null }));
    } catch (err) {
      console.error('Error fetching popular recipes:', err);
      if (isMounted.current) {
        setError(prev => ({ 
          ...prev, 
          popular: 'Failed to load popular recipes. Please try again later.'
        }));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(prev => ({ ...prev, popular: false }));
      }
    }
  }, []);

  const fetchLatestRecipes = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      setIsLoading(prev => ({ ...prev, latest: true }));
      const data = await recipeService.getRandomRecipes(5);
      
      if (!isMounted.current) return;
      
      const mappedData = data.map(mapRecipeData);
      setRecipes(prev => ({ ...prev, latest: mappedData }));
      setError(prev => ({ ...prev, latest: null }));
    } catch (err) {
      console.error('Error fetching latest recipes:', err);
      if (isMounted.current) {
        setError(prev => ({ 
          ...prev, 
          latest: 'Failed to load latest recipes. Please try again later.'
        }));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(prev => ({ ...prev, latest: false }));
      }
    }
  }, []);

  const fetchAllRecipes = useCallback(() => {
    fetchWithDebounce('featured', fetchFeaturedRecipes);
    fetchWithDebounce('popular', fetchPopularRecipes);
    fetchWithDebounce('latest', fetchLatestRecipes);
  }, [fetchFeaturedRecipes, fetchPopularRecipes, fetchLatestRecipes, fetchWithDebounce]);

  return {
    recipes,
    isLoading,
    error,
    actions: {
      fetchFeaturedRecipes,
      fetchPopularRecipes,
      fetchLatestRecipes,
      fetchAllRecipes
    }
  };
};

export default useRecipes;