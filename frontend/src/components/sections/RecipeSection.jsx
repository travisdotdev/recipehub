import React from 'react';
import RecipeCarousel from '../RecipeCarousel';
import RecipeCard from '../RecipeCard';

const defaultConfig = {
  card: {
    backgroundColor: 'bg-white/95',
    shadow: 'shadow-xl'
  }
};

const RecipeSection = ({
  title,
  recipes = [],
  isLoading = false,
  error = null,
  className = '',
  variant = 'default',
  config = defaultConfig
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'alternate':
        return 'bg-gray-50';
      default:
        return 'bg-white';
    }
  };

  if (isLoading) {
    return (
      <section className={`py-12 px-4 sm:px-6 lg:px-8 ${getBackgroundColor()} ${className}`}>
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-500">Loading recipes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-12 px-4 sm:px-6 lg:px-8 ${getBackgroundColor()} ${className}`}>
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
          <div className="flex justify-center items-center h-48">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 px-4 sm:px-6 lg:px-8 ${getBackgroundColor()} ${className}`}>
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
        {recipes.length > 0 ? (
          <RecipeCarousel>
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                config={config}
              />
            ))}
          </RecipeCarousel>
        ) : (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-500">No recipes found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecipeSection;