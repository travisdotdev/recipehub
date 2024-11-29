import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Users } from 'lucide-react';
import DOMPurify from 'dompurify';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchRecipe = async () => {
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        const response = await fetch(`http://localhost:8080/api/recipes/${id}`);

        if (!isMounted) return;

        if (!response.ok) {
          throw new Error(`Recipe not found (Status: ${response.status})`);
        }

        const data = await response.json();

        if (isMounted) {
          setRecipe({
            id: data.id || data.spoonacularId,
            title: data.title || 'Untitled Recipe',
            readyInMinutes: data.readyInMinutes || 0,
            servings: data.servings || 1,
            image: data.image || null,
            instructions: data.instructions || '',
            summary: data.summary || '',
            sourceUrl: data.sourceUrl || '',
            extendedIngredients: data.extendedIngredients || [],
            analyzedInstructions: data.analyzedInstructions || []
          });
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching recipe:', err);
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    if (id) {
      fetchRecipe();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBack = (e) => {
    e.preventDefault();
    window.history.back();
    setTimeout(() => {
      if (window.location.pathname === `/recipe/${id}`) {
        navigate('/');
      }
    }, 100);
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 pt-16 px-4">
          <div className="max-w-3xl mx-auto mt-8">
            <button
                onClick={handleBack}
                className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all"
            >
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

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 pt-16 px-4">
          <div className="max-w-3xl mx-auto mt-8">
            <button
                onClick={handleBack}
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

  if (!recipe) {
    return null;
  }

  const sanitizedInstructions = DOMPurify.sanitize(recipe.instructions);

  return (
      <div className="min-h-screen bg-gray-50 pt-16 px-4">
        <div className="max-w-3xl mx-auto mt-8">
          <button
              onClick={handleBack}
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

              {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Ingredients</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {recipe.extendedIngredients.map((ingredient, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="font-medium min-w-[80px]">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                            <span>{ingredient.originalName || ingredient.name}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {recipe.instructions && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Instructions</h2>
                    <div
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: sanitizedInstructions }}
                    />
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