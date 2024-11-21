import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

/**
 * Default configuration object for the RecipeCard component.
 * Modify these values to change the appearance of the card.
 */
const defaultConfig = {
  // Card container styling
  card: {
    width: 'w-30',              // Card width - Change to 'w-80', 'w-96' etc for different widths
    height: 'h-70',             // Card height - Change to 'h-80', 'h-[400px]' etc for different heights
    padding: 'p-3',             // Internal padding - e.g., 'p-6' for more spacing
    backgroundColor: 'bg-white', // Background color - e.g., 'bg-gray-50' for different background
    borderRadius: 'rounded-xl',  // Border radius - e.g., 'rounded-2xl' for more rounded corners
    shadow: 'shadow-md',        // Shadow effect - e.g., 'shadow-lg' for stronger shadow
    border: 'border border-gray-100', // Border style - e.g., 'border-2' for thicker border
    
    // Hover animation properties
    transition: 'transition-all duration-300', // Animation speed - e.g., 'duration-500' for slower
    hover: {
      scale: 'hover:scale-105',           // Hover zoom effect - e.g., 'hover:scale-110' for more zoom
      translate: 'hover:-translate-y-1',   // Hover lift effect - e.g., 'hover:-translate-y-2' for more lift
      shadow: 'hover:shadow-xl'           // Hover shadow - e.g., 'hover:shadow-2xl' for stronger shadow
    }
  },

  // Recipe image styling
  image: {
    height: 'h-100',             // Image height - e.g., 'h-52' for taller image
    objectFit: 'object-cover',  // Image fitting - e.g., 'object-contain' to show full image
    borderRadius: 'rounded-t-xl' // Image border radius - should match card's borderRadius
  },

  // Image overlay styling (darkens image for better text visibility)
  overlay: {
    gradient: 'bg-gradient-to-t from-black/60 to-transparent', // Gradient opacity and direction
    opacity: 'opacity-100'      // Overlay opacity - e.g., 'opacity-75' for lighter overlay
  },

  // Recipe title styling
  title: {
    fontSize: 'text-xl',        // Title size - e.g., 'text-2xl' for larger text
    fontWeight: 'font-semibold', // Title weight - e.g., 'font-bold' for bolder text
    color: 'text-gray-800',     // Title color - e.g., 'text-gray-900' for darker text
    lineClamp: 'line-clamp-2',  // Number of lines before truncating - e.g., 'line-clamp-3' for 3 lines
    marginBottom: 'mb-3'        // Spacing below title - e.g., 'mb-4' for more space
  },

  // Recipe details (cooking time, servings) styling
  details: {
    fontSize: 'text-sm',        // Details text size - e.g., 'text-base' for larger text
    color: 'text-gray-600',     // Details text color - e.g., 'text-gray-700' for darker text
    iconSize: 'w-4 h-4',        // Icon size - e.g., 'w-5 h-5' for larger icons
    spacing: 'gap-4'            // Spacing between details - e.g., 'gap-6' for more space
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