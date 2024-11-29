package csu33012_2425_group19.demo.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Arrays;

public class RecipeDTOTest {
    
    @Test
    void testBasicRecipeProperties() {
        // Arrange
        RecipeDTO recipe = new RecipeDTO();
        
        // Act
        recipe.setId(1L);
        recipe.setTitle("Spaghetti");
        recipe.setReadyInMinutes(30);
        recipe.setServings(4);
        
        // Assert
        assertEquals(1L, recipe.getId());
        assertEquals("Spaghetti", recipe.getTitle());
        assertEquals(30, recipe.getReadyInMinutes());
        assertEquals(4, recipe.getServings());
    }

    @Test
    void testExtendedIngredient() {
        // Arrange
        RecipeDTO.ExtendedIngredient ingredient = new RecipeDTO.ExtendedIngredient();
        
        // Act
        ingredient.setId(1L);
        ingredient.setName("Tomato");
        ingredient.setAmount(2.0);
        ingredient.setUnit("pieces");
        
        // Assert
        assertEquals(1L, ingredient.getId());
        assertEquals("Tomato", ingredient.getName());
        assertEquals(2.0, ingredient.getAmount());
        assertEquals("pieces", ingredient.getUnit());
    }

    @Test
    void testAnalyzedInstruction() {
        // Arrange
        RecipeDTO.AnalyzedInstruction instruction = new RecipeDTO.AnalyzedInstruction();
        RecipeDTO.AnalyzedInstruction.Step step = new RecipeDTO.AnalyzedInstruction.Step();
        
        // Act
        step.setNumber(1);
        step.setStep("Boil water");
        instruction.setSteps(Arrays.asList(step));
        
        // Assert
        assertNotNull(instruction.getSteps());
        assertEquals(1, instruction.getSteps().size());
        assertEquals("Boil water", instruction.getSteps().get(0).getStep());
        assertEquals(1, instruction.getSteps().get(0).getNumber());
    }
}