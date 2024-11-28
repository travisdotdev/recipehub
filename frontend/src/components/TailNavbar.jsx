import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Menu, Search, X } from 'lucide-react';

const TailNavbar = ({ brandName = "RecipeHub" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const navigate = useNavigate();
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&type=${searchType}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Search Recipes', path: '/search' },
    { name: 'Shopping List', path: '/shopping-list' },
    { name: 'About Us', path: '/about-us' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <ChefHat className="h-8 w-8 text-gray-800 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-xl font-bold text-gray-800">
                {brandName}
              </span>
            </Link>
          </div>

          <div className="flex-grow"></div>

          <div className="flex items-center space-x-4">
            <div ref={searchRef} className="relative flex items-center">
              <div className={`transition-all duration-200 ${
                isSearchOpen ? 'w-64' : 'w-8'
              }`}>
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="flex flex-col w-full">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={searchType === 'ingredients' ? "Enter ingredients..." : "Search recipes..."}
                          className="w-full px-4 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                          autoFocus
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="ml-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex gap-2 mt-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setSearchType('name')}
                          className={`px-2 py-1 rounded ${
                            searchType === 'name' 
                              ? 'bg-gray-200 text-gray-800' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          Search by name
                        </button>
                        <button
                          type="button"
                          onClick={() => setSearchType('ingredients')}
                          className={`px-2 py-1 rounded ${
                            searchType === 'ingredients' 
                              ? 'bg-gray-200 text-gray-800' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          Search by ingredients
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    aria-label="Open search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div 
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-60 transform transition-all duration-200 origin-top-right ${
                  isDropdownOpen 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="py-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TailNavbar;