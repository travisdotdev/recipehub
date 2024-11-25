import React, { useState, useEffect, useCallback } from 'react';
import HeroSection from '../components/sections/HeroSection';
import RecipeSection from '../components/sections/RecipeSection';
import useRecipes from '../hooks/useRecipes';
import testImage from '../assets/images/testBackground2k.jpg';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { 
    recipes, 
    isLoading, 
    error, 
    actions 
  } = useRecipes();

  // Initial data fetch with debounce
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!initialLoadComplete) {
        await actions.fetchAllRecipes();
        if (mounted) {
          setInitialLoadComplete(true);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [actions, initialLoadComplete]);

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  
  const renderRecipeSection = useCallback(({ title, recipes, isLoading, error, variant, className }) => (
    <RecipeSection
      title={title}
      recipes={recipes}
      isLoading={isLoading}
      error={error}
      variant={variant}
      className={className}
      key={title} 
    />
  ), []);

  if (!initialLoadComplete) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative">
      <HeroSection 
        isVisible={isVisible}
        backgroundImage={testImage}
        title="Discover Delicious Recipes"
        subtitle="Find and share the best recipes from around the world"
      >
        <div className="w-full">
          <h2 className="text-3xl font-bold text-white mt-10 mb-8 max-w-7xl mx-auto px-4">
            Featured Recipes
          </h2>
          {renderRecipeSection({
            recipes: recipes.featured,
            isLoading: isLoading.featured,
            error: error.featured,
            className: "pt-0"
          })}
        </div>
      </HeroSection>

      {renderRecipeSection({
        title: "Popular Recipes",
        recipes: recipes.popular,
        isLoading: isLoading.popular,
        error: error.popular,
        variant: "alternate"
      })}

      {renderRecipeSection({
        title: "Latest Recipes",
        recipes: recipes.latest,
        isLoading: isLoading.latest,
        error: error.latest
      })}
    </main>
  );
};

export default Home;