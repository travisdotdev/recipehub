import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

const defaultConfig = {
  card: {
    width: 'w-60',
    height: 'h-auto', // Changed from fixed height to auto
    padding: 'p-3',             
    backgroundColor: 'bg-white',
    borderRadius: 'rounded-xl',  
    shadow: 'shadow-md',        
    border: 'border border-gray-100',
    transition: 'transition-all duration-300',
    hover: {
      scale: 'hover:scale-102',
      translate: 'hover:-translate-y-2',
      shadow: 'hover:shadow-lg'
    }
  },

  image: {
    aspectRatio: 'aspect-[4/3]', // Added aspect ratio container
    objectFit: 'object-cover',
    borderRadius: 'rounded-t-xl'
  },

  overlay: {
    gradient: 'bg-gradient-to-t from-black/60 to-transparent',
    opacity: 'opacity-100'
  },

  title: {
    fontSize: 'text-lg',
    fontWeight: 'font-semibold',
    color: 'text-gray-800',
    lineClamp: 'line-clamp-2',
    marginBottom: 'mb-2'
  },

  details: {
    fontSize: 'text-sm',
    color: 'text-gray-600',
    iconSize: 'w-4 h-4',
    spacing: 'gap-3'
  }
};

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

  // Merge provided config with defaults
  const finalConfig = {
    ...defaultConfig,
    ...config,
    card: {
      ...defaultConfig.card,
      ...config.card,
      hover: {
        ...defaultConfig.card.hover,
        ...(config.card?.hover || {})
      }
    },
    image: {
      ...defaultConfig.image,
      ...config.image
    },
    overlay: {
      ...defaultConfig.overlay,
      ...config.overlay
    },
    title: {
      ...defaultConfig.title,
      ...config.title
    },
    details: {
      ...defaultConfig.details,
      ...config.details
    }
  };

  return (
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
      <article 
        className={`
          relative 
          overflow-hidden
          ${finalConfig.card.backgroundColor}
          ${finalConfig.card.borderRadius}
          ${finalConfig.card.shadow}
          ${finalConfig.card.border}
        `}
      >
        <div className="relative">
          <div className={finalConfig.image.aspectRatio}>
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
          <div className={`
            absolute inset-0
            ${finalConfig.overlay.gradient}
            ${finalConfig.overlay.opacity}
          `} />
        </div>

        <div className={finalConfig.card.padding}>
          <h3 className={`
            ${finalConfig.title.fontSize}
            ${finalConfig.title.fontWeight}
            ${finalConfig.title.color}
            ${finalConfig.title.lineClamp}
            ${finalConfig.title.marginBottom}
          `}>
            {title}
          </h3>
          
          <div className={`
            flex items-center
            ${finalConfig.details.spacing}
            ${finalConfig.details.color}
          `}>
            <div className="flex items-center gap-1">
              <Clock className={finalConfig.details.iconSize} />
              <span className={finalConfig.details.fontSize}>
                {readyInMinutes} min
              </span>
            </div>
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