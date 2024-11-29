package csu33012_2425_group19.demo.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import csu33012_2425_group19.demo.service.SpoonacularService;
import csu33012_2425_group19.demo.dto.RecipeDTO;
import csu33012_2425_group19.demo.dto.ParsedInstruction;

import java.util.Arrays;
import java.util.List;
import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class RecipeControllerTest {

    @Mock
    private SpoonacularService spoonacularService;

    @InjectMocks
    private RecipeController recipeController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getFeaturedRecipes_Success() {
        // Arrange
        List<RecipeDTO> mockRecipes = Arrays.asList(
            createMockRecipe(1L, "Recipe 1"),
            createMockRecipe(2L, "Recipe 2")
        );
        when(spoonacularService.getFeaturedRecipes(10)).thenReturn(mockRecipes);

        // Act
        ResponseEntity<List<RecipeDTO>> response = recipeController.getFeaturedRecipes(10);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals(2, response.getBody().size());
        verify(spoonacularService).getFeaturedRecipes(10);
    }

    @Test
    void getFeaturedRecipes_Error() {
        // Arrange
        when(spoonacularService.getFeaturedRecipes(10)).thenThrow(new RuntimeException("API Error"));

        // Act
        ResponseEntity<List<RecipeDTO>> response = recipeController.getFeaturedRecipes(10);

        // Assert
        assertTrue(response.getStatusCode().is5xxServerError());
        verify(spoonacularService).getFeaturedRecipes(10);
    }

    @Test
    void getPopularRecipes_Success() {
        // Arrange
        List<RecipeDTO> mockRecipes = Arrays.asList(createMockRecipe(1L, "Popular Recipe"));
        when(spoonacularService.getPopularRecipes(10)).thenReturn(mockRecipes);

        // Act
        ResponseEntity<List<RecipeDTO>> response = recipeController.getPopularRecipes(10);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals(1, response.getBody().size());
        verify(spoonacularService).getPopularRecipes(10);
    }

    @Test
    void getLatestRecipes_Success() {
        // Arrange
        List<RecipeDTO> mockRecipes = Arrays.asList(createMockRecipe(1L, "Latest Recipe"));
        when(spoonacularService.getLatestRecipes(10)).thenReturn(mockRecipes);

        // Act
        ResponseEntity<List<RecipeDTO>> response = recipeController.getLatestRecipes(10);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals(1, response.getBody().size());
        verify(spoonacularService).getLatestRecipes(10);
    }

    @Test
    void searchByIngredients_Success() {
        // Arrange
        List<RecipeDTO> mockRecipes = Arrays.asList(createMockRecipe(1L, "Recipe with Ingredients"));
        when(spoonacularService.searchByIngredients("tomato,basil", 5, 2, true))
            .thenReturn(mockRecipes);

        // Act
        ResponseEntity<List<RecipeDTO>> response = recipeController.searchByIngredients(
            "tomato,basil", 5, 2, true);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals(1, response.getBody().size());
        verify(spoonacularService).searchByIngredients("tomato,basil", 5, 2, true);
    }

    @Test
    void complexSearch_Success() {
        // Arrange
        List<RecipeDTO> mockRecipes = Arrays.asList(createMockRecipe(1L, "Complex Search Recipe"));
        SpoonacularService.ComplexSearchParams expectedParams = SpoonacularService.ComplexSearchParams.builder()
            .query("pasta")
            .cuisine("italian")
            .diet("vegetarian")
            .number(10)
            .build();
        when(spoonacularService.complexSearch(any())).thenReturn(mockRecipes);

        // Act
        ResponseEntity<List<RecipeDTO>> response = recipeController.complexSearch(
            "pasta", "italian", "vegetarian", null, null, null, null, null, null, 10);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals(1, response.getBody().size());
        verify(spoonacularService).complexSearch(any());
    }

    @Test
    void getRecipeById_Success() {
        // Arrange
        RecipeDTO mockRecipe = createMockRecipe(1L, "Single Recipe");
        when(spoonacularService.getRecipeById(1L)).thenReturn(mockRecipe);

        // Act
        ResponseEntity<RecipeDTO> response = recipeController.getRecipeById(1L);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("Single Recipe", response.getBody().getTitle());
        verify(spoonacularService).getRecipeById(1L);
    }

    @Test
    void getRecipeInstructions_Success() {
        // Arrange
        List<ParsedInstruction> mockInstructions = Arrays.asList(createMockInstruction());
        when(spoonacularService.getRecipeInstructions(1L)).thenReturn(mockInstructions);

        // Act
        ResponseEntity<List<ParsedInstruction>> response = recipeController.getRecipeInstructions(1L);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals(1, response.getBody().size());
        verify(spoonacularService).getRecipeInstructions(1L);
    }

    @Test
    void getRandomRecipes_Success() {
        // Arrange
        List<RecipeDTO> mockRecipes = Arrays.asList(createMockRecipe(1L, "Random Recipe"));
        when(spoonacularService.getRandomRecipes(20, "vegetarian", "dessert", false))
            .thenReturn(mockRecipes);

        // Act
        ResponseEntity<List<RecipeDTO>> response = recipeController.getRandomRecipes(
            20, "vegetarian", "dessert", false);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals(1, response.getBody().size());
        verify(spoonacularService).getRandomRecipes(20, "vegetarian", "dessert", false);
    }

    // Helper methods to create mock objects
    private RecipeDTO createMockRecipe(Long id, String title) {
        RecipeDTO recipe = new RecipeDTO();
        recipe.setId(id);
        recipe.setTitle(title);
        recipe.setReadyInMinutes(30);
        recipe.setServings(4);
        recipe.setImage("test-image.jpg");
        return recipe;
    }

    private ParsedInstruction createMockInstruction() {
        ParsedInstruction instruction = new ParsedInstruction();
        ParsedInstruction.Step step = new ParsedInstruction.Step();
        step.setNumber(1);
        step.setStep("Test step");
        instruction.setSteps(Collections.singletonList(step));
        return instruction;
    }
}