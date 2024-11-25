import { useState, useEffect, useCallback } from 'react';
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

  // Map API response to match your RecipeCard component's expected format
  const mapRecipeData = (recipe) => ({
    id: recipe.id,
    title: recipe.title,
    readyInMinutes: recipe.readyInMinutes,
    servings: recipe.servings,
    image: recipe.image,
    imageType: recipe.imageType || 'jpg',
  });

  const fetchFeaturedRecipes = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, featured: true }));
      const data = await recipeService.getRandomRecipes(5);
      const mappedData = data.map(mapRecipeData);
      setRecipes(prev => ({ ...prev, featured: mappedData }));
      setError(prev => ({ ...prev, featured: null }));
    } catch (err) {
      console.error('Error fetching featured recipes:', err);
      setError(prev => ({ 
        ...prev, 
        featured: 'Failed to load featured recipes. Please try again later.'
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, featured: false }));
    }
  }, []);

  const fetchPopularRecipes = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, popular: true }));
      const data = await recipeService.getRandomRecipes(5, 'popular');
      const mappedData = data.map(mapRecipeData);
      setRecipes(prev => ({ ...prev, popular: mappedData }));
      setError(prev => ({ ...prev, popular: null }));
    } catch (err) {
      console.error('Error fetching popular recipes:', err);
      setError(prev => ({ 
        ...prev, 
        popular: 'Failed to load popular recipes. Please try again later.'
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, popular: false }));
    }
  }, []);

  const fetchLatestRecipes = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, latest: true }));
      const data = await recipeService.getRandomRecipes(5);
      const mappedData = data.map(mapRecipeData);
      setRecipes(prev => ({ ...prev, latest: mappedData }));
      setError(prev => ({ ...prev, latest: null }));
    } catch (err) {
      console.error('Error fetching latest recipes:', err);
      setError(prev => ({ 
        ...prev, 
        latest: 'Failed to load latest recipes. Please try again later.'
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, latest: false }));
    }
  }, []);

  const fetchAllRecipes = useCallback(async () => {
    Promise.all([
      fetchFeaturedRecipes(),
      fetchPopularRecipes(),
      fetchLatestRecipes()
    ]);
  }, [fetchFeaturedRecipes, fetchPopularRecipes, fetchLatestRecipes]);

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