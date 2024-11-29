// src/__tests__/components/TailNavbar.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TailNavbar from '../../components/TailNavbar';

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <TailNavbar />
    </BrowserRouter>
  );
};

describe('TailNavbar', () => {
  test('renders brand name', () => {
    renderNavbar();
    expect(screen.getByText('RecipeHub')).toBeInTheDocument();
  });

  test('opens search bar when search icon is clicked', () => {
    renderNavbar();
    const searchButton = screen.getByLabelText('Open search');
    fireEvent.click(searchButton);
    expect(screen.getByPlaceholderText('Search recipes...')).toBeInTheDocument();
  });

  test('opens menu when menu icon is clicked', () => {
    renderNavbar();
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    expect(screen.getByText('Shopping List')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });
});