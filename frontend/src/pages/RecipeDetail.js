import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Users } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

const RecipeDetail = ({ recipe: initialRecipe, goBack }) => {
  const [recipe, setRecipe] = useState(initialRecipe || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // For route-based navigation
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      // If we have initial recipe data (from search), use that ID, otherwise use route param
      const recipeId = initialRecipe?.id || id;
      if (!recipeId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}/information`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const recipeDetails = await response.json();

        setRecipe({
          ...recipeDetails,
          title: recipeDetails.title || initialRecipe?.title || "Unknown Recipe",
          image: recipeDetails.image || initialRecipe?.image || "",
        });
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id, initialRecipe]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = () => {
    if (goBack) {
      goBack(); // For search results
    } else {
      navigate(-1); // For route-based navigation
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 pt-16 px-4">
          <div className="max-w-3xl mx-auto mt-8">
            <button onClick={handleBack} className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all">
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
    );
  }

  // Show error state with back button
  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 pt-16 px-4">
          <div className="max-w-3xl mx-auto mt-8">
            <button
                onClick={goBack}
                className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}. Please try again later.
            </div>
          </div>
        </div>
    );
  }

  // Show nothing if no recipe (shouldn't happen with loading state)
  if (!recipe) {
    return null;
  }

  // Main render
  return (
      <div className="min-h-screen bg-gray-50 pt-16 px-4">
        <div className="max-w-3xl mx-auto mt-8">
          <button
              onClick={goBack}
              className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {recipe.image && (
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-64 object-cover"
                />
            )}

            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {recipe.title}
              </h1>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{recipe.readyInMinutes} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>

              {recipe.summary && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Summary</h2>
                    <div
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: recipe.summary }}
                    />
                  </div>
              )}

              {recipe.instructions && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Instructions</h2>
                    <p className="text-gray-700 whitespace-pre-line">
                      {recipe.instructions}
                    </p>
                  </div>
              )}

              {recipe.sourceUrl && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <a
                        href={recipe.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View Original Recipe
                    </a>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default RecipeDetail;