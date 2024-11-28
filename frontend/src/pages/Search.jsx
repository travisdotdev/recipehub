import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import { AlertCircle } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('name');

  useEffect(() => {
    const fetchResults = async () => {
      const query = searchParams.get('q');
      const type = searchParams.get('type') || 'name';
      setSearchType(type);

      if (!query) {
        setRecipes([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        let results;
        if (type === 'ingredients') {
          results = await recipeService.searchByIngredients(query);
        } else {
          results = await recipeService.searchRecipes(query);
        }
        
        const validRecipes = results.filter(recipe => 
          recipe && 
          recipe.id && 
          recipe.title && 
          recipe.readyInMinutes && 
          recipe.servings
        );

        if (validRecipes.length === 0 && results.length > 0) {
          setError('Some recipes could not be displayed due to missing information.');
        }
        
        setRecipes(validRecipes);
      } catch (err) {
        setError('Failed to load recipes. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const searchTypeLabel = searchType === 'ingredients' 
    ? 'Recipes using ingredients' 
    : 'Recipes matching';

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.4)), url('/images/search-background.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4" style={backgroundStyle}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4" style={backgroundStyle}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 bg-red-50/90 text-red-600 p-4 rounded-lg backdrop-blur-sm">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!searchParams.get('q')) {
    return (
      <div className="min-h-screen pt-24 px-4" style={backgroundStyle}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white backdrop-blur-sm bg-black/30 p-6 rounded-lg">
            Enter a search term to find recipes
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4" style={backgroundStyle}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 backdrop-blur-sm bg-black/30 p-4 rounded-lg inline-block">
          {searchTypeLabel} "{searchParams.get('q')}"
        </h1>
        
        {recipes.length === 0 ? (
          <div className="text-center text-white backdrop-blur-sm bg-black/30 p-6 rounded-lg">
            No recipes found for your search
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 flex items-center gap-2 bg-yellow-50/90 text-yellow-700 p-4 rounded-lg backdrop-blur-sm">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recipes.map(recipe => (
                <div className="backdrop-blur-sm">
                <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    className="w-full"
                />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;