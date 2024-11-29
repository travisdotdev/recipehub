import { recipeService } from '../../../src/pages/RecipeSearch';

global.fetch = jest.fn();

describe('Recipe Search Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        global.cache = new Map();
        //expected error so we suppress
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    describe('searchRecipes', () => {
        it('search recipes with query', async () => {
            const mockRecipes = [{ id: 1, title: 'Chicken Recipe' }];
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockRecipes
            });

            const result = await recipeService.searchRecipes('chicken');
            expect(result).toEqual(mockRecipes);
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/recipes/complexSearch?query=chicken'),
                expect.any(Object)
            );
        });

        it('should hanle search errors with fallback', async () => {
            fetch.mockRejectedValueOnce(new Error('API Error'));

            const result = await recipeService.searchRecipes('invalid');
            expect(result[0]).toEqual(expect.objectContaining({
                title: 'Temporary Recipe 1'
            }));
        });
    });

    describe('searchByIngredients', () => {
        it('should search recipes by ingredients', async () => {
            const mockResponse = [{
                id: 1,
                title: 'Recipe with Ingredients',
                readyInMinutes: undefined,
                servings: undefined
            }];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const result = await recipeService.searchByIngredients('tomato,cheese');
            expect(result[0]).toEqual(expect.objectContaining({
                readyInMinutes: 30,
                servings: 4
            }));
        });

        it('should use default values for missing properties', async () => {
            const mockResponse = [{ id: 1, title: 'Test Recipe' }];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const result = await recipeService.searchByIngredients('tomato');
            expect(result[0]).toEqual(expect.objectContaining({
                readyInMinutes: 30,
                servings: 4,
                image: '/api/placeholder/400/300',
                imageType: 'jpg'
            }));
        });
    });

    describe('getRecipeById', () => {
        it('should fetch single reciphe by id', async () => {
            const mockRecipe = { id: 1, title: 'Test Recipe' };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockRecipe
            });

            const result = await recipeService.getRecipeById(1);
            expect(result).toEqual(mockRecipe);
        });

        it('should return first fallback recipe on error', async () => {
            fetch.mockRejectedValueOnce(new Error('API Error'));

            const result = await recipeService.getRecipeById(999);
            expect(result).toEqual(expect.objectContaining({
                title: 'Temporary Recipe 1'
            }));
        });

        it('should use cachce for repeated requests', async () => {
            const mockRecipe = { id: 1, title: 'Test Recipe' };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockRecipe
            });

            await recipeService.getRecipeById(1);
            fetch.mockClear();

            const result = await recipeService.getRecipeById(1);
            expect(result).toEqual(mockRecipe);
            expect(fetch).not.toHaveBeenCalled();
        });
    });
});