import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard';

// Helper function to render RecipeCard with Router context
const renderRecipeCard = (props) => {
  return render(
    <BrowserRouter>
      <RecipeCard {...props} />
    </BrowserRouter>
  );
};

describe('RecipeCard', () => {
  // Sample recipe data for testing
  const mockRecipe = {
    id: 1,
    title: 'Spaghetti Carbonara',
    readyInMinutes: 30,
    servings: 4,
    image: 'test-image.jpg'
  };

  test('renders recipe title', () => {
    renderRecipeCard({ recipe: mockRecipe });
    expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
  });

  test('renders cooking time', () => {
    renderRecipeCard({ recipe: mockRecipe });
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  test('renders servings', () => {
    renderRecipeCard({ recipe: mockRecipe });
    expect(screen.getByText('4 servings')).toBeInTheDocument();
  });

  test('links to correct recipe page', () => {
    renderRecipeCard({ recipe: mockRecipe });
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/recipe/1');
  });

  test('displays recipe image with correct alt text', () => {
    renderRecipeCard({ recipe: mockRecipe });
    const image = screen.getByAltText('Spaghetti Carbonara');
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });
});