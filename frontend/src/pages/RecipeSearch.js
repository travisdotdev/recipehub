import React, { useState } from 'react';
import RecipeDetail from './RecipeDetail';

function RecipeSearch() {
  const [query, setQuery] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleChange = (setter) => (event) => setter(event.target.value);

  //options unused but leave in for now
  const fetchData = async (url, setter, options = {}) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setter(Array.isArray(data) ? data : data.results || []);
      setSelectedRecipe(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setter([]);
    }
  };

  const searchByName = (event) => {
    event.preventDefault();
    fetchData(`/api/recipes/complexSearch?query=${query}`, setRecipes);
  };

  const searchByIngredients = (event) => {
    event.preventDefault();
    fetchData(`/api/recipes/searchByIngredients?ingredients=${ingredients}`, setRecipes);
  };

  const handleRecipeClick = async (recipe) => {
    try {
      //fetches full recipe details
      const response = await fetch(`/api/recipes/${recipe.id}/information`);
      const recipeDetails = await response.json();

      //fetches analyzed instructions
      const instructionsResponse = await fetch(`/api/recipes/${recipe.id}/instructions`);
      const analyzedInstructions = await instructionsResponse.json();

      //fetches ingredient widget data
      const ingredientsResponse = await fetch(`/api/recipes/${recipe.id}/ingredients`);
      const ingredients = await ingredientsResponse.json();

      //combines all data
      setSelectedRecipe({
        ...recipeDetails,
        title: recipeDetails.title || recipe.title || "Unknown Recipe",
        image: recipeDetails.image || recipe.image || "",
        analyzedInstructions: analyzedInstructions || [], //ensure instructions are included
        extendedIngredients: ingredients.length ? ingredients : recipeDetails.extendedIngredients, //ensure ingredients are included
      });
    } catch (error) {
      console.error("Error fetching recipe details, instructions, or ingredients:", error); //should make each fetch have its own error but this works for now
      setSelectedRecipe(null);
    }
  };


  return (
      <div style={styles.container}>
        {!selectedRecipe ? (
            <div style={styles.content}>
              <h1 style={styles.heading}>Recipe Search</h1>
              <p style={styles.subheading}>Search by recipe name or by ingredients you have!</p>
              <form onSubmit={searchByName} style={styles.form}>
                <input
                    type="text"
                    value={query}
                    onChange={handleChange(setQuery)}
                    placeholder="Search for recipes by name..."
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Search by Name</button>
              </form>
              <form onSubmit={searchByIngredients} style={styles.form}>
                <input
                    type="text"
                    value={ingredients}
                    onChange={handleChange(setIngredients)}
                    placeholder="Enter ingredients (comma-separated)..."
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Search by Ingredients</button>
              </form>
              <ul style={styles.recipeList}>
                {recipes.map((recipe) => (
                    <li key={recipe.id} style={styles.recipeItem} onClick={() => handleRecipeClick(recipe)}>
                      <h3>{recipe.title}</h3>
                      <img src={recipe.image} alt={recipe.title} style={styles.image} />
                    </li>
                ))}
              </ul>
            </div>
        ) : (
          <RecipeDetail recipe={selectedRecipe} goBack={() => setSelectedRecipe(null)} />
        )}
      </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh', 
    backgroundImage: 'url(https://st4.depositphotos.com/1000875/26566/v/450/depositphotos_265662920-stock-illustration-young-woman-chef-in-retro.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px', 
    backgroundRepeat: 'no-repeat',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    padding: '2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '600px', 
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', 
  },
  heading: {
    color: 'white',
    fontSize: '2.5rem',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
  },
  subheading: {
    color: 'white',
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between', 
    marginBottom: '1rem',
  },
  input: {
    padding: '0.8rem',
    marginRight: '0.8rem',
    flex: 1, 
    borderRadius: '4px',
    border: 'none',
    fontSize: '1rem',
  },
  button: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#ff7f50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    width: '150px', 
  },
  recipeList: {
    listStyleType: 'none',
    padding: 0,
    color: 'white',
    display: 'flex',
    flexWrap: 'wrap',  
    justifyContent: 'center',
  },
  recipeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '10px',
    margin: '10px',  
    borderRadius: '5px',
    cursor: 'pointer',
    width: 'calc(33% - 20px)',  
    boxSizing: 'border-box',    
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    borderRadius: '5px',
    height: 'auto',
  },
  instructions: {
    marginTop: '20px',
    color: 'white',
    textAlign: 'left',
  },
};


export default RecipeSearch;
