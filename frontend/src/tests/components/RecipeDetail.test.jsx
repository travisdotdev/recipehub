import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeDetail from '../../../src/pages/RecipeDetail';
import * as router from 'react-router-dom';
import DOMPurify from 'dompurify';

jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

jest.mock('dompurify', () => ({
    sanitize: jest.fn(content => content),
}));


describe('RecipeDetail Component', () => {
    const mockRecipe = {
        id: 1,
        title: 'Test Recipe',
        readyInMinutes: 30,
        servings: 4,
        image: 'test-image.jpg',
        instructions: '<p>Test instructions</p>',
        summary: '<p>Test summary</p>',
        sourceUrl: 'http://example.com',
        extendedIngredients: [
            {
                amount: 1,
                unit: 'cup',
                name: 'sugar',
                originalName: 'white sugar'
            }
        ]
    };

    const mockNavigate = jest.fn();
    global.fetch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        router.useParams.mockReturnValue({ id: '1' });
        router.useNavigate.mockReturnValue(mockNavigate);
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => mockRecipe
        });
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });


    test('render the recipe details after loading', async () => {
        await act(async () => {
            render(<RecipeDetail />);
        });

        await waitFor(() => {
            expect(screen.getByText('Test Recipe')).toBeInTheDocument();
        });

        expect(screen.getByText('30 minutes')).toBeInTheDocument();
        expect(screen.getByText('4 servings')).toBeInTheDocument();
        expect(screen.getByText(/1 cup/)).toBeInTheDocument();
        expect(screen.getByText(/white sugar/)).toBeInTheDocument();
        expect(screen.getByText('View Original Recipe')).toHaveAttribute('href', 'http://example.com');
    });

    test('handles fetch error correctly', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

        await act(async () => {
            render(<RecipeDetail />);
        });

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
        });
    });

    test('handles API error response correctly', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        await act(async () => {
            render(<RecipeDetail />);
        });

        await waitFor(() => {
            expect(screen.getByText(/Recipe not found/)).toBeInTheDocument();
        });
    });

    test('handles back button click', async () => {
        const mockHistoryBack = jest.fn();
        Object.defineProperty(window, 'history', {
            value: { back: mockHistoryBack },
            writable: true
        });

        await act(async () => {
            render(<RecipeDetail />);
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Back'));
        });

        expect(mockHistoryBack).toHaveBeenCalled();
    });

    test('add ingredients to shopping list', async () => {
        await act(async () => {
            render(<RecipeDetail />);
        });

        await waitFor(() => {
            expect(screen.getByText('Add Ingredients to Shopping List')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Add Ingredients to Shopping List'));
        });

        expect(mockNavigate).toHaveBeenCalledWith('/shopping-list', {
            state: {
                ingredients: ['1 cup sugar']
            }
        });
    });

    test('format ingredient amount correctly', async () => {
        const recipeWithDecimal = {
            ...mockRecipe,
            extendedIngredients: [
                {
                    amount: 1.5,
                    unit: 'cup',
                    name: 'sugar',
                    originalName: 'sugar'
                }
            ]
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => recipeWithDecimal
        });

        await act(async () => {
            render(<RecipeDetail />);
        });

        await waitFor(() => {
            expect(screen.getByText(/1.50 cup/)).toBeInTheDocument();
        });
    });

    test('sanitises HTML content', async () => {
        await act(async () => {
            render(<RecipeDetail />);
        });

        await waitFor(() => {
            expect(DOMPurify.sanitize).toHaveBeenCalledWith(mockRecipe.instructions);
        });
    });
});