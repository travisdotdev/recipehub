import React from 'react';

const HeroSection = ({
  title = "Discover Delicious Recipes",
  subtitle = "Find and share the best recipes from around the world",
  backgroundImage = '',
  children,
  isVisible = true,
  className = ''
}) => {
  return (
    <section className={`relative mt-16 z-0 min-h-screen ${className}`}>
      {/* Background */}
      <div 
        className={`
          absolute inset-0 bg-cover bg-center bg-no-repeat z-0
          transition-transform duration-1000 ease-out
          ${isVisible ? 'scale-100' : 'scale-105'}
        `}
        style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}
      >
        <div className="absolute inset-0 bg-black/10" />
      </div>
      
      {/* Content */}
      <div className="relative h-full z-10 px-4 py-8 md:py-12 lg:py-16 flex flex-col justify-between">
        {/* Text Content */}
        <div className={`
          mx-auto w-full max-w-7xl
          transition-all duration-1000 delay-300
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <div className="max-w-2xl text-left">
            <h1 className={`
              text-4xl font-bold sm:text-5xl lg:text-6xl
              transition-all duration-700 delay-500
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              {title}
            </h1>
            <p className={`
              mt-6 text-lg sm:text-xl
              transition-all duration-700 delay-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Featured Content (e.g., Recipe Carousel) */}
        <div className={`
          w-full
          transition-all duration-1000 delay-1000
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;