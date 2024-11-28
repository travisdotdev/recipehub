import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Default configuration object for the RecipeCarousel component.
 * Modify these values to change the appearance and behavior of the carousel.
 */
const defaultConfig = {
  // Container styling and behavior
  container: {
    padding: 'px-4 py-6',       // Internal padding - e.g., 'px-6 py-8' for more spacing
    gap: 'gap-6',              // Space between items - e.g., 'gap-8' for more space
    scrollBehavior: 'scroll-smooth', // Scroll animation - 'auto' for instant scroll
    snapType: 'snap-x snap-mandatory' // Snap behavior - Remove for free scrolling
  },

  // Navigation buttons styling and positioning
  navigation: {
    button: {
      // Base button styles
      base: 'absolute top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-all duration-200',
      size: 'h-10 w-10',        // Button size - e.g., 'h-12 w-12' for larger buttons
      color: 'text-gray-800',   // Arrow color - e.g., 'text-blue-600' for blue arrows
      disabled: 'opacity-100 cursor-not-allowed' // Disabled state styling
    },
    // Button positioning
    position: {
      left: '-left-5',          // Left button position - e.g., '-left-8' to move further left
      right: '-right-5'         // Right button position - e.g., '-right-8' to move further right
    }
  },

  // Scrollbar visibility
  scrollbar: {
    hide: 'scrollbar-hide'      // Hides scrollbar - Remove this to show scrollbar
  }
};

/**
 * RecipeCarousel Component
 * A horizontal scrolling carousel with navigation buttons and snap scrolling.
 * 
 * @param {React.ReactNode} children - Carousel items (typically RecipeCard components)
 * @param {Object} config - Configuration object to override default styling
 * @param {string} className - Additional CSS classes to apply to the component
 */
const RecipeCarousel = ({
  children,
  config = defaultConfig,
  className = ''
}) => {
  // Reference to the scrollable container
  const carouselRef = useRef(null);
  
  // State for tracking scroll position and button visibility
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /**
   * Updates the visibility state of navigation buttons based on scroll position
   * Called on scroll events and resize
   */
  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      // Show left button if not at start
      setCanScrollLeft(scrollLeft > 0);
      // Show right button if not at end (with 5px threshold for browser rounding)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  // Set up resize observer and initial button states
  useEffect(() => {
    updateScrollButtons();
    
    // Create resize observer to update buttons when container size changes
    const observer = new ResizeObserver(updateScrollButtons);
    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }
    
    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  /**
   * Handles scrolling in either direction
   * @param {string} direction - Either 'left' or 'right'
   */
  const scroll = (direction) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      // Scroll 80% of container width
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Handles scroll events to update button visibility
   */
  const handleScroll = () => {
    updateScrollButtons();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Left Navigation Button */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`
          ${config.navigation.button.base}
          ${config.navigation.button.size}
          ${config.navigation.position.left}
          ${!canScrollLeft ? config.navigation.button.disabled : ''}
        `}
        aria-label="Scroll left"
      >
        <ChevronLeft className={config.navigation.button.color} />
      </button>

      {/* Main Carousel Container */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className={`
          flex overflow-x-auto
          ${config.container.padding}
          ${config.container.gap}
          ${config.container.scrollBehavior}
          ${config.container.snapType}
          ${config.scrollbar.hide}
        `}
      >
        {/* Wrap each child in a container for snap scrolling */}
        {React.Children.map(children, (child) => (
          <div className="flex-none snap-start">
            {child}
          </div>
        ))}
      </div>

      {/* Right Navigation Button */}
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`
          ${config.navigation.button.base}
          ${config.navigation.button.size}
          ${config.navigation.position.right}
          ${!canScrollRight ? config.navigation.button.disabled : ''}
        `}
        aria-label="Scroll right"
      >
        <ChevronRight className={config.navigation.button.color} />
      </button>
    </div>
  );
};

// PropTypes for type checking and documentation
RecipeCarousel.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.shape({
    container: PropTypes.shape({
      padding: PropTypes.string,
      gap: PropTypes.string,
      scrollBehavior: PropTypes.string,
      snapType: PropTypes.string
    }),
    navigation: PropTypes.shape({
      button: PropTypes.shape({
        base: PropTypes.string,
        size: PropTypes.string,
        color: PropTypes.string,
        disabled: PropTypes.string
      }),
      position: PropTypes.shape({
        left: PropTypes.string,
        right: PropTypes.string
      })
    }),
    scrollbar: PropTypes.shape({
      hide: PropTypes.string
    })
  }),
  className: PropTypes.string
};

export default RecipeCarousel;