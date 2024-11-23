import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import Navbar from './components/Navbar'; // Import Navbar
import Home from './pages/Home';
import RecipeSearch from './pages/RecipeSearch'; 
import RecipeDetail from './pages/RecipeDetail';
import ShoppingList from './pages/ShoppingList';
import AboutUs from './pages/AboutUs';
import TailNavbar from './components/TailNavbar';

function App() {
  return (
    <Router>
      <div className="App">
        <TailNavbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<RecipeSearch />} /> 
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

