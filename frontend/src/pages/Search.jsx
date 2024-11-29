import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import { AlertCircle, ArrowRight } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('name');
  const [offset, setOffset] = useState(0);
  const RECIPES_PER_PAGE = 12;

  const fetchResults = async (currentOffset = 0) => {
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'name';

    if (!query) {
      setRecipes([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);

      let results;
      if (type === 'ingredients') {
        results = await recipeService.searchByIngredients(query);
      } else {
        results = await recipeService.searchRecipes(query, {
          offset: currentOffset,
          number: RECIPES_PER_PAGE
        });
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

      // if loading more, append to existing recipes, otherwise replace them
      setRecipes(prev => currentOffset > 0 ? [...prev, ...validRecipes] : validRecipes);
      setSearchType(type);

    } catch (err) {
      setError('Failed to load recipes. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setOffset(0);
    fetchResults(0);
  }, [searchParams]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const newOffset = offset + RECIPES_PER_PAGE;
    setOffset(newOffset);
    await fetchResults(newOffset);
  };

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

  if (error && recipes.length === 0) {
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
      <div className="min-h-screen pt-24 px-4 pb-12" style={backgroundStyle}>
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
                      <div key={recipe.id} className="backdrop-blur-sm">
                        <RecipeCard
                            recipe={recipe}
                            className="w-full"
                        />
                      </div>
                  ))}
                </div>

                {recipes.length >= RECIPES_PER_PAGE && (
                    <div className="mt-8 flex justify-center">
                      <button
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                      >
                        {loadingMore ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                              Loading...
                            </>
                        ) : (
                            <>
                              Load More
                              <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                      </button>
                    </div>
                )}
              </>
          )}
        </div>
      </div>
  );
};

export default Search;