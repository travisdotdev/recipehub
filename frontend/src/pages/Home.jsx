import React, { useState, useEffect, useCallback } from 'react';
import HeroSection from '../components/sections/HeroSection';
import RecipeSection from '../components/sections/RecipeSection';
import useRecipes from '../hooks/useRecipes';
import { recipeService } from '../services/recipeService';
import testImage from '../assets/images/testBackground2k.jpg';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [recipes, setRecipes] = useState({ featured: [] });
  const [isLoading, setIsLoading] = useState({ featured: true });
  const [error, setError] = useState({ featured: null });

  const loadRandomRecipes = async () => {
    try {
      setIsLoading(prev => ({ ...prev, featured: true }));
      setError(prev => ({ ...prev, featured: null }));
      
      // Clear cache for random recipes by using a new timestamp
      const freshRecipes = await recipeService.getRandomRecipes(20);
      
      setRecipes(prev => ({ ...prev, featured: freshRecipes }));
    } catch (err) {
      setError(prev => ({ ...prev, featured: 'Failed to load recipes' }));
      console.error('Error loading random recipes:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, featured: false }));
    }
  };

  useEffect(() => {
    if (!initialLoadComplete) {
      loadRandomRecipes();
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    await loadRandomRecipes();
  };

  return (
    <main className="relative">
      <HeroSection 
        isVisible={isVisible}
        backgroundImage={testImage}
        title="Discover Delicious Recipes"
        subtitle="Find and share the best recipes from around the world"
      >
        <div className="w-full">
          <div className="max-w-7xl mx-0 px-0">
            <h2 className="text-3xl font-bold text-white mt-10 mb-0 inline-block bg-black/60 px-6 py-3 rounded-lg backdrop-blur-sm">
              Featured Recipes
            </h2>
          </div>
          <RecipeSection
            recipes={recipes.featured}
            isLoading={isLoading.featured}
            error={error.featured}
            className="pt-0"
            onRefresh={handleRefresh}
          />
        </div>
      </HeroSection>
    </main>
  );
};

export default Home;