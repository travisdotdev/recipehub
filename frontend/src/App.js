import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import Navbar from './components/Navbar'; // Import Navbar
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import ShoppingList from './pages/ShoppingList';
import AboutUs from './pages/AboutUs';
import TailNavbar from './components/TailNavbar';
import Search from './pages/Search';

function App() {
  return (
    <Router>
      <div className="App">
        <TailNavbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

