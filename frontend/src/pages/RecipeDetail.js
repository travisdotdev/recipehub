import React from 'react';

function RecipeDetail({ recipe }) {
  if (!recipe) {
    return <p style={{ color: 'red' }}>No recipe details available.</p>;
  }

  //extract segmented ingredients and instructions
  const ingredients = recipe.extendedIngredients || [];
  const instructions =
      recipe.analyzedInstructions?.length > 0
          ? recipe.analyzedInstructions[0].steps
          : [];

  return (
      <div style={styles.background}>
        <div style={styles.recipeCard}>
          <h2 style={styles.title}>{recipe.title || "Unknown Recipe"}</h2>
          {recipe.image && (
              <img
                  src={recipe.image}
                  alt={recipe.title}
                  style={{ width: "100%", borderRadius: "8px", marginBottom: "15px" }}
              />
          )}
          <p style={styles.cookTime}>
            Cook Time: {recipe.readyInMinutes || "N/A"} minutes
          </p>
          <div style={styles.recipeInfo}>
            {/* Render Ingredients */}
            <h3 style={styles.sectionTitle}>What You Need:</h3>
            {ingredients.length > 0 ? (
                <ul style={styles.ingredientsList}>
                  {ingredients.map((ingredient, index) => {
                    const name = ingredient.name || ingredient.original || "Unknown Ingredient";
                    const amount = ingredient.amount?.us?.value || "N/A";
                    const unit = ingredient.amount?.us?.unit || "";
                    return (
                        <li key={index} style={styles.ingredient}>
                          {`${amount} ${unit} ${name}`}
                        </li>
                    );
                  })}
                </ul>
            ) : (
                <p>No ingredients available for this recipe.</p>
            )}

            {/* Render Instructions */}
            <h3 style={styles.sectionTitle}>How to:</h3>
            {instructions.length > 0 ? (
                <ol style={styles.instructionsList}>
                  {instructions.map((step, index) => (
                      <li key={index} style={styles.instruction}>
                        {step.step || "Unknown Step"}
                      </li>
                  ))}
                </ol>
            ) : (
                <p>No instructions available for this recipe.</p>
            )}
          </div>
        </div>
      </div>
  );
}

const styles = {
  background: {
    minHeight: '100vh',
    backgroundImage:
        'url(https://st4.depositphotos.com/1000875/26566/v/450/depositphotos_265662920-stock-illustration-young-woman-chef-in-retro.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px',
    paddingTop: '80px',
  },
  recipeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    overflow: 'auto',
    maxHeight: '90vh',
    marginTop: '20px',
  },
  title: {
    fontSize: '1.8rem',
    color: '#333',
    margin: '10px 0',
  },
  cookTime: {
    fontSize: '1rem',
    color: '#777',
    marginBottom: '15px',
  },
  recipeInfo: {
    textAlign: 'left',
    marginTop: '15px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#444',
    borderBottom: '1px solid #ddd',
    paddingBottom: '8px',
    marginBottom: '10px',
  },
  ingredientsList: {
    listStyleType: 'none',
    padding: '0',
    color: '#555',
    marginBottom: '20px',
  },
  ingredient: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '5px',
  },
  instructionsList: {
    listStyleType: 'decimal',
    paddingLeft: '20px',
    color: '#333',
    lineHeight: '1.6',
  },
  instruction: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
};

export default RecipeDetail;
