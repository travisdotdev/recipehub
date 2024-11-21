import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import RecipeCarousel from '../components/RecipeCarousel';

/**
 * Helper function to import all images from a directory
 * @param {require.context} r - Webpack require.context
 * @returns {Object} Object with image paths as keys and imported images as values
 */
const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => { 
    images[item.replace('./', '')] = r(item); 
  });
  return images;
};

// Import all images from assets directory
const images = importAll(require.context('../assets/images', false, /\.(png|jpe?g|svg)$/));

/**
 * Default configuration object for styling and behavior
 * Modify these values to change the appearance of different sections
 */
const defaultConfig = {
  // Hero section configuration
  hero: {
    backgroundImage: '',         // Hero background image URL
    backgroundColor: 'bg-white-100', // Background color when no image
    backgroundOverlay: 'bg-black/10', // Overlay opacity - e.g., 'bg-black/20' for darker
    minHeight: 'min-h-screen',   // Section height - e.g., 'min-h-[600px]' for fixed height
    containerWidth: 'max-w-7xl', // Maximum content width
    padding: 'px-4 py-8 md:py-12 lg:py-16', // Responsive padding
    contentWidth: 'max-w-2xl',   // Maximum text content width
    contentAlignment: 'text-left', // Text alignment - e.g., 'text-center'
    textColor: 'text-black-100', // Text color
    animate: true,               // Enable/disable animations
    initialLoadDelay: 500,       // Animation delay in milliseconds
    spacing: 'space-y-12'        // Vertical spacing between elements
  },

  // Section configurations
  sections: {
    // Default section style
    default: {
      backgroundColor: 'bg-white', // Section background color
      padding: 'py-12 px-4 sm:px-6 lg:px-8', // Responsive padding
      maxWidth: 'max-w-7xl',     // Maximum content width
      spacing: 'space-y-12'      // Vertical spacing between elements
    },
    // Alternate section style (e.g., for striped appearance)
    alternate: {
      backgroundColor: 'bg-gray-50',
      padding: 'py-16 px-4 sm:px-6 lg:px-8',
      maxWidth: 'max-w-7xl',
      spacing: 'space-y-12'
    }
  }
};

// Section component for better organization
const Section = ({ 
  variant = 'default',
  config = defaultConfig.sections.default,
  className = '',
  children 
}) => {
  return (
    <section className={`
      ${config.backgroundColor}
      ${config.padding}
      ${className}
    `}>
      <div className={`
        mx-auto
        ${config.maxWidth}
      `}>
        {children}
      </div>
    </section>
  );
};

const Home = ({
  config = defaultConfig,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Featured recipes for hero section
  const featuredRecipes = [
    {
      id: 1,
      title: "BBQ Pizza",
      readyInMinutes: 30,
      servings: 4,
      image: images["bbqPizza.png"],
      imageType: "png"
    },
    {
      id: 2,
      title: "Classic Cheesecake",
      readyInMinutes: 60,
      servings: 8,
      image: images["cheesecake.png"],
      imageType: "png"
    },
    {
      id: 3,
      title: "Greek Salad",
      readyInMinutes: 15,
      servings: 2,
      image: images["greekSalad.png"],
      imageType: "png"
    },
    {
      id: 4,
      title: "Spaghetti Carbonara",
      readyInMinutes: 25,
      servings: 4,
      image: images["spaghettiCarbonara.png"],
      imageType: "png"
    },
    {
      id: 5,
      title: "Ramen Bowl",
      readyInMinutes: 45,
      servings: 2,
      image: images["ramen.png"],
      imageType: "png"
    }
  ];
  
  // Sample recipes for other sections
  const popularRecipes = [
    {
      id: 6,
      title: "Greek Salad",
      readyInMinutes: 15,
      servings: 2,
      image: "/assets/images/greekSalad.png",
      imageType: "png"
    },
    {
      id: 7,
      title: "Spaghetti Carbonara",
      readyInMinutes: 25,
      servings: 4,
      image: "/assets/images/spaghettiCarbonara.png",
      imageType: "png"
    },
    {
      id: 8,
      title: "Ramen Bowl",
      readyInMinutes: 45,
      servings: 2,
      image: "/assets/images/ramen.png",
      imageType: "png"
    }
  ];

  const latestRecipes = [
    {
      id: 9,
      title: "BBQ Pizza",
      readyInMinutes: 30,
      servings: 4,
      image: "/assets/images/bbqPizza.png",
      imageType: "png"
    },
    {
      id: 10,
      title: "Classic Cheesecake",
      readyInMinutes: 60,
      servings: 8,
      image: "/assets/images/cheesecake.png",
      imageType: "png"
    }
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, config.hero.initialLoadDelay);
    
    return () => clearTimeout(timer);
  }, [config.hero.initialLoadDelay]);

  return (
    <main className={`relative ${className}`}>
      {/* Hero Section with Featured Recipes */}
      <section className={`
        relative mt-16 z-0
        ${config.hero.minHeight}
        ${config.hero.backgroundColor}
      `}>
        {/* Hero Background */}
        <div 
          className={`
            absolute inset-0 bg-cover bg-center bg-no-repeat z-0
            ${config.hero.animate ? 'transition-transform duration-1000 ease-out' : ''}
            ${isVisible ? 'scale-100' : 'scale-105'}
          `}
          style={{ backgroundImage: `url(${config.hero.backgroundImage})` }}
        >
          <div className={`absolute inset-0 ${config.hero.backgroundOverlay}`} />
        </div>
        
        {/* Hero Content */}
        <div className={`
          relative h-full z-10
          ${config.hero.padding}
          flex flex-col justify-between
        `}>
          {/* Title Section */}
          <div className={`
            mx-auto w-full
            ${config.hero.containerWidth}
            ${config.hero.animate ? 'transition-all duration-1000 delay-300' : ''}
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className={`
              ${config.hero.contentWidth}
              ${config.hero.contentAlignment}
              ${config.hero.textColor}
            `}>
              <h1 className={`
                text-4xl font-bold sm:text-5xl lg:text-6xl
                ${config.hero.animate ? 'transition-all duration-700 delay-500' : ''}
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}>
                Discover Delicious Recipes
              </h1>
              <p className={`
                mt-6 text-lg sm:text-xl
                ${config.hero.animate ? 'transition-all duration-700 delay-700' : ''}
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}>
                Find and share the best recipes from around the world
              </p>
            </div>
          </div>

          {/* Featured Recipes Carousel */}
          <div className={`
            w-full
            ${config.hero.animate ? 'transition-all duration-1000 delay-1000' : ''}
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <h2 className="text-3xl font-bold text-black mt-10 mb-0 max-w-7x1 mx-auto px-0">
              Featured Recipes
            </h2>
            <RecipeCarousel>
              {featuredRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe}
                  config={{
                    card: {
                      backgroundColor: 'bg-white/95',
                      shadow: 'shadow-xl'
                    }
                  }}
                />
              ))}
            </RecipeCarousel>
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <Section 
        variant="alternate"
        className="bg-gray-50"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Popular Recipes
        </h2>
        <RecipeCarousel>
          {popularRecipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe}
            />
          ))}
        </RecipeCarousel>
      </Section>

      {/* Latest Recipes Section */}
      <Section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Latest Recipes
        </h2>
        <RecipeCarousel>
          {latestRecipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe}
            />
          ))}
        </RecipeCarousel>
      </Section>
    </main>
  );
};

export default Home;