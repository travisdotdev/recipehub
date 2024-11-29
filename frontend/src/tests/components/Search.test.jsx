import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from '../../../src/pages/Search';
import { recipeService } from '../../../src/services/recipeService';
import * as router from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    useSearchParams: jest.fn(),
}));

jest.mock('../../../src/components/RecipeCard', () => {
    return function MockRecipeCard({ recipe }) {
        return (
            <div data-testid="recipe-card">
                {recipe.title}
            </div>
        );
    };
});

jest.mock('../../../src/services/recipeService', () => ({
    recipeService: {
        searchRecipes: jest.fn(),
        searchByIngredients: jest.fn(),
    }
}));


describe('Search Component', () => {
    const mockRecipes = [
        {
            id: 1,
            title: 'Test Recipe 1',
            readyInMinutes: 30,
            servings: 4,
            image: 'test-image-1.jpg'
        },
        {
            id: 2,
            title: 'Test Recipe 2',
            readyInMinutes: 45,
            servings: 6,
            image: 'test-image-2.jpg'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should display recipes after loading', async () => {
        const mockSearchParams = new URLSearchParams('?q=chicken');
        router.useSearchParams.mockReturnValue([mockSearchParams, jest.fn()]);
        recipeService.searchRecipes.mockResolvedValueOnce(mockRecipes);

        render(<Search />);

        await waitFor(() => {
            expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
            expect(screen.getByText('Test Recipe 2')).toBeInTheDocument();
        });
    });

    it('should handle no search query', async () => {
        const mockSearchParams = new URLSearchParams();
        router.useSearchParams.mockReturnValue([mockSearchParams, jest.fn()]);

        render(<Search />);

        expect(screen.getByText('Enter a search term to find recipes')).toBeInTheDocument();
    });

    it('should handle search error', async () => {
        const mockSearchParams = new URLSearchParams('?q=chicken');
        router.useSearchParams.mockReturnValue([mockSearchParams, jest.fn()]);
        recipeService.searchRecipes.mockRejectedValueOnce(new Error('API Error'));

        render(<Search />);

        await waitFor(() => {
            expect(screen.getByText('Failed to load recipes. Please try again.')).toBeInTheDocument();
        });
    });

    it('should handle ingredient search type', async () => {
        const mockSearchParams = new URLSearchParams('?q=tomato&type=ingredients');
        router.useSearchParams.mockReturnValue([mockSearchParams, jest.fn()]);
        recipeService.searchByIngredients.mockResolvedValueOnce(mockRecipes);

        render(<Search />);

        await waitFor(() => {
            expect(screen.getByText(/Recipes using ingredients/)).toBeInTheDocument();
        });
    });

});