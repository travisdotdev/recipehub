import React, { act } from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../src/pages/Home';
import { recipeService } from '../../../src/services/recipeService';


jest.mock('../../../src/assets/images/testBackground2k.jpg', () => 'test-image-mock');

//heroscection
jest.mock('../../../src/components/sections/HeroSection', () => {
    return function MockHeroSection({ children, title, subtitle, isVisible }) {
        return (
            <div data-testid="hero-section">
                <h1>{title}</h1>
                <p>{subtitle}</p>
                <div data-testid="hero-content" className={isVisible ? 'visible' : ''}>
                    {children}
                </div>
            </div>
        );
    };
});


jest.mock('../../../src/components/sections/RecipeSection', () => {
    return function MockRecipeSection({ recipes, isLoading, error, onRefresh }) {
        return (
            <div data-testid="recipe-section">
                {isLoading && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {recipes && (
                    <div>
                        {recipes.map((recipe, index) => (
                            <div key={index}>{recipe.title}</div>
                        ))}
                    </div>
                )}
                <button onClick={onRefresh}>Refresh</button>
            </div>
        );
    };
});


jest.mock('../../../src/services/recipeService', () => ({
    recipeService: {
        getRandomRecipes: jest.fn()
    }
}));

describe('Home Component', () => {
    const mockRecipes = [
        { id: 1, title: 'Recipe 1' },
        { id: 2, title: 'Recipe 2' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        recipeService.getRandomRecipes.mockResolvedValue(mockRecipes);
        //silence console.error for expected error cases as api does it for us
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test('rendes home page with correct initial elements', async () => {
        await act(async () => {
            render(<Home />);
            await Promise.resolve();
        });

        expect(screen.getByText('Discover Delicious Recipes')).toBeInTheDocument();
        expect(screen.getByText('Find and share the best recipes from around the world')).toBeInTheDocument();
        expect(screen.getByText('Featured Recipes')).toBeInTheDocument();
    });

    test('loads random recipes on init render', async () => {
        await act(async () => {
            render(<Home />);
            await Promise.resolve();
        });

        expect(recipeService.getRandomRecipes).toHaveBeenCalledWith(20);
        expect(screen.getByTestId('recipe-section')).toBeInTheDocument();
    });

    test('handle the loading state correctly', async () => {
        recipeService.getRandomRecipes.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve(mockRecipes), 100))
        );

        await act(async () => {
            render(<Home />);
            await Promise.resolve();
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await act(async () => {
            jest.advanceTimersByTime(100);
            await Promise.resolve();
        });

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    test('handle error state correctly', async () => {
        const errorMessage = 'Failed to load recipes';
        recipeService.getRandomRecipes.mockRejectedValueOnce(new Error(errorMessage));

        await act(async () => {
            render(<Home />);
            await Promise.resolve();
        });

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('refresh button trigger a new recipe load', async () => {
        await act(async () => {
            render(<Home />);
            await Promise.resolve();
        });

        expect(recipeService.getRandomRecipes).toHaveBeenCalledTimes(1);

        await act(async () => {
            fireEvent.click(screen.getByText('Refresh'));
            await Promise.resolve();
        });

        expect(recipeService.getRandomRecipes).toHaveBeenCalledTimes(2);
    });

    test('hero section become vible after delay', async () => {
        await act(async () => {
            render(<Home />);
            await Promise.resolve();
        });

        const heroContent = screen.getByTestId('hero-content');
        expect(heroContent).not.toHaveClass('visible');

        await act(async () => {
            jest.advanceTimersByTime(500);
            await Promise.resolve();
        });

        expect(heroContent).toHaveClass('visible');
    });
});