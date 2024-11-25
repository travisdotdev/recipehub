import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

/**
 * Default configuration object for the RecipeCard component.
 * Modify these values to change the appearance of the card.
 */
// Card container styling
const defaultConfig = {
  // Card container styling
  card: {
    width: 'w-64',              // Reduced from w-30 to w-64 for smaller width
    height: 'h-80',             // Adjusted height to maintain proportion
    padding: 'p-3',             
    backgroundColor: 'bg-white',
    borderRadius: 'rounded-xl',  
    shadow: 'shadow-md',        
    border: 'border border-gray-100',
    
    transition: 'transition-all duration-300',
    hover: {
      scale: 'hover:scale-102',  // Reduced scale effect
      translate: 'hover:-translate-y-1',
      shadow: 'hover:shadow-lg'  // Reduced shadow effect
    }
  },

  // Image styling
  image: {
    height: 'h-48',             // Reduced height for the image
    objectFit: 'object-cover',
    borderRadius: 'rounded-t-xl'
  },

  // Rest of the config remains the same...
  overlay: {
    gradient: 'bg-gradient-to-t from-black/60 to-transparent',
    opacity: 'opacity-100'
  },

  title: {
    fontSize: 'text-lg',        // Reduced font size
    fontWeight: 'font-semibold',
    color: 'text-gray-800',
    lineClamp: 'line-clamp-2',
    marginBottom: 'mb-2'        // Reduced margin
  },

  details: {
    fontSize: 'text-sm',
    color: 'text-gray-600',
    iconSize: 'w-4 h-4',
    spacing: 'gap-3'            // Reduced gap
  }
};


/**
 * RecipeCard Component
 * 
 * @param {Object} recipe - Recipe data object containing id, title, readyInMinutes, servings, image
 * @param {Object} config - Configuration object to override default styling
 * @param {string} className - Additional CSS classes to apply to the component
 */
const RecipeCard = ({
  recipe,
  config = defaultConfig,
  className = ''
}) => {
  const {
    id,
    title,
    readyInMinutes,
    servings,
    image
  } = recipe;

  // Merge provided config with defaults to allow partial override
  const finalConfig = {
    ...defaultConfig,
    ...config,
    card: {
      ...defaultConfig.card,
      ...config.card
    }
  };

  return (
    // Wrap entire card in Link component for navigation
    <Link 
      to={`/recipe/${id}`}
      className={`
        block
        ${finalConfig.card.width}
        ${finalConfig.card.transition}
        ${finalConfig.card.hover.scale}
        ${finalConfig.card.hover.translate}
        ${finalConfig.card.hover.shadow}
        ${className}
      `}
    >
      {/* Main card article container */}
      <article 
        className={`
          relative 
          overflow-hidden
          ${finalConfig.card.height}
          ${finalConfig.card.backgroundColor}
          ${finalConfig.card.borderRadius}
          ${finalConfig.card.shadow}
          ${finalConfig.card.border}
        `}
      >
        {/* Image container with gradient overlay */}
        <div className="relative">
          <div className={finalConfig.image.height}>
            <img
              src={image}
              alt={title}
              className={`
                w-full h-full
                ${finalConfig.image.objectFit}
                ${finalConfig.image.borderRadius}
              `}
            />
          </div>
          {/* Gradient overlay for better text visibility */}
          <div className={`
            absolute inset-0
            ${finalConfig.overlay.gradient}
            ${finalConfig.overlay.opacity}
          `} />
        </div>

        {/* Content section (title and details) */}
        <div className={finalConfig.card.padding}>
          {/* Recipe title */}
          <h3 className={`
            ${finalConfig.title.fontSize}
            ${finalConfig.title.fontWeight}
            ${finalConfig.title.color}
            ${finalConfig.title.lineClamp}
            ${finalConfig.title.marginBottom}
          `}>
            {title}
          </h3>
          
          {/* Recipe details (cooking time and servings) */}
          <div className={`
            flex items-center
            ${finalConfig.details.spacing}
            ${finalConfig.details.color}
          `}>
            {/* Cooking time */}
            <div className="flex items-center gap-1">
              <Clock className={finalConfig.details.iconSize} />
              <span className={finalConfig.details.fontSize}>
                {readyInMinutes} min
              </span>
            </div>
            {/* Servings */}
            <div className="flex items-center gap-1">
              <Users className={finalConfig.details.iconSize} />
              <span className={finalConfig.details.fontSize}>
                {servings} servings
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

// PropTypes for type checking and documentation
RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    readyInMinutes: PropTypes.number.isRequired,
    servings: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    imageType: PropTypes.string
  }).isRequired,
  config: PropTypes.object,
  className: PropTypes.string
};

export default RecipeCard;