package csu33012_2425_group19.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import csu33012_2425_group19.demo.dto.RecipeDTO;
import csu33012_2425_group19.demo.dto.ParsedInstruction;
import csu33012_2425_group19.demo.entity.Recipe;
import csu33012_2425_group19.demo.repository.RecipeRepository;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Arrays;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
public class RecipeServiceTest {

    @Mock
    private SpoonacularService spoonacularService;
    
    @Mock
    private RecipeRepository recipeRepository;

    private RecipeService recipeService;

    @BeforeEach
    void setUp() {
        recipeService = new RecipeService(spoonacularService, recipeRepository);
    }

    @Test
    void testGetPopularRecipes() {
        // Arrange
        int number = 2;
        RecipeDTO dto = new RecipeDTO();
        dto.setId(1L);
        dto.setTitle("Popular Recipe");

        when(recipeRepository.findPopularRecipes(PageRequest.of(0, number)))
            .thenReturn(Arrays.asList());
        when(spoonacularService.getPopularRecipes(number))
            .thenReturn(Arrays.asList(dto));
        when(recipeRepository.save(any(Recipe.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        List<Recipe> result = recipeService.getPopularRecipes(number);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals("Popular Recipe", result.get(0).getTitle());
    }

    @Test
    void testGetRecipeByIdFromCache() {
        // Arrange
        Long recipeId = 1L;
        Recipe existingRecipe = new Recipe();
        existingRecipe.setSpoonacularId(recipeId);
        existingRecipe.setTitle("Cached Recipe");
        existingRecipe.setLastApiSync(LocalDateTime.now());

        when(recipeRepository.findBySpoonacularId(recipeId))
            .thenReturn(existingRecipe);

        // Act
        Recipe result = recipeService.getRecipeById(recipeId);

        // Assert
        assertNotNull(result);
        assertEquals("Cached Recipe", result.getTitle());
        verify(spoonacularService, never()).getRecipeById(anyLong());
    }

    @Test
    void testGetRecipeByIdWithUpdate() {
        // Arrange
        Long recipeId = 1L;
        Recipe existingRecipe = new Recipe();
        existingRecipe.setSpoonacularId(recipeId);
        existingRecipe.setTitle("Old Recipe");
        existingRecipe.setLastApiSync(LocalDateTime.now().minusDays(2));

        RecipeDTO updatedDto = new RecipeDTO();
        updatedDto.setId(recipeId);
        updatedDto.setTitle("Updated Recipe");

        when(recipeRepository.findBySpoonacularId(recipeId))
            .thenReturn(existingRecipe);
        when(spoonacularService.getRecipeById(recipeId))
            .thenReturn(updatedDto);
        when(recipeRepository.save(any(Recipe.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Recipe result = recipeService.getRecipeById(recipeId);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Recipe", result.getTitle());
    }

    @Test
    void testComplexSearch() {
        // Arrange
        String query = "pasta";
        RecipeDTO dto = new RecipeDTO();
        dto.setId(1L);
        dto.setTitle("Pasta Recipe");

        when(recipeRepository.findByTitleContainingIgnoreCase(query))
            .thenReturn(Arrays.asList());
        when(spoonacularService.complexSearch(any()))
            .thenReturn(Arrays.asList(dto));
        when(recipeRepository.save(any(Recipe.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        List<Recipe> results = recipeService.complexSearch(query);

        // Assert
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals("Pasta Recipe", results.get(0).getTitle());
    }

    @Test
    void testSearchByIngredients() {
        // Arrange
        String ingredients = "tomato,cheese";
        RecipeDTO dto = new RecipeDTO();
        dto.setId(1L);
        dto.setTitle("Pizza");

        when(spoonacularService.searchByIngredients(eq(ingredients), anyInt(), anyInt(), anyBoolean()))
            .thenReturn(Arrays.asList(dto));
        when(recipeRepository.save(any(Recipe.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        List<Recipe> results = recipeService.searchByIngredients(ingredients, 10, 2, false);

        // Assert
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals("Pizza", results.get(0).getTitle());
    }

    @Test
    void testGetRecipeInstructions() {
        // Arrange
        Long recipeId = 1L;
        ParsedInstruction instruction = new ParsedInstruction();
        ParsedInstruction.Step step = new ParsedInstruction.Step();
        step.setStep("Cook pasta");
        instruction.setSteps(Arrays.asList(step));

        when(spoonacularService.getRecipeInstructions(recipeId))
            .thenReturn(Arrays.asList(instruction));

        // Act
        List<ParsedInstruction> results = recipeService.getRecipeInstructions(recipeId);

        // Assert
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals("Cook pasta", results.get(0).getSteps().get(0).getStep());
    }
}