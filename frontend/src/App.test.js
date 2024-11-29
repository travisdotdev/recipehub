import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the route components since we don't need to test their implementation
jest.mock('./pages/Home', () => () => <div>Home Page</div>);
jest.mock('./pages/RecipeDetail', () => () => <div>Recipe Detail Page</div>);
jest.mock('./pages/ShoppingList', () => () => <div>Shopping List Page</div>);
jest.mock('./pages/AboutUs', () => () => <div>About Us Page</div>);
jest.mock('./pages/Search', () => () => <div>Search Page</div>);
jest.mock('./components/TailNavbar', () => () => <div>Navigation Bar</div>);

describe('App', () => {
  test('renders navigation bar', () => {
    render(<App />);
    expect(screen.getByText('Navigation Bar')).toBeInTheDocument();
  });

  test('renders home page by default', () => {
    render(<App />);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});