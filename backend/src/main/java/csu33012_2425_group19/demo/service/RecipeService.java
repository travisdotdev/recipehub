package csu33012_2425_group19.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import csu33012_2425_group19.demo.dto.ParsedInstruction;
import csu33012_2425_group19.demo.dto.RecipeDTO;
import csu33012_2425_group19.demo.entity.Recipe;
import csu33012_2425_group19.demo.repository.RecipeRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {
    private final SpoonacularService spoonacularService;
    private final RecipeRepository recipeRepository;

    /**
     * Get recipe by ID - checks database first, then Spoonacular API
     */
    @Transactional
    public Recipe getRecipeById(Long id) {
        // First check our database
        Recipe recipe = recipeRepository.findBySpoonacularId(id);
        if (recipe != null) {
            return recipe;
        }

        // If not in database, fetch from API and save
        RecipeDTO recipeDTO = spoonacularService.getRecipeById(id);
        return saveRecipeFromDTO(recipeDTO);
    }

    /**
     * Search recipes by ingredients
     */
    @Transactional
    public List<Recipe> searchByIngredients(String ingredients, int number, int ranking, boolean ignorePantry) {
        // Get recipes from API
        List<RecipeDTO> recipeDTOs = spoonacularService.searchByIngredients(
            ingredients, number, ranking, ignorePantry);
        
        // Save and return recipes
        return recipeDTOs.stream()
            .map(this::saveRecipeFromDTO)
            .collect(Collectors.toList());
    }

    /**
     * Complex recipe search
     */
    @Transactional
    public List<Recipe> complexSearch(String query) {
        // First check database
        List<Recipe> localResults = recipeRepository.findByTitleContainingIgnoreCase(query);
        if (!localResults.isEmpty()) {
            return localResults;
        }

        // If no local results, search API
        List<RecipeDTO> recipeDTOs = spoonacularService.complexSearch(query);
        return recipeDTOs.stream()
            .map(this::saveRecipeFromDTO)
            .collect(Collectors.toList());
    }

    /**
     * Get recipe instructions
     */
    public List<ParsedInstruction> getRecipeInstructions(Long id) {
        return spoonacularService.getRecipeInstructions(id);
    }

    /**
     * Helper method to convert DTO to entity and save
     */
    @Transactional
    private Recipe saveRecipeFromDTO(RecipeDTO dto) {
        // Check if recipe already exists
        if (dto.getId() != null) {
            Recipe existingRecipe = recipeRepository.findBySpoonacularId(dto.getId());
            if (existingRecipe != null) {
                return existingRecipe;
            }
        }

        // Convert DTO to entity with null checks
        Recipe recipe = new Recipe();
        recipe.setSpoonacularId(dto.getId());
        recipe.setTitle(dto.getTitle() != null ? dto.getTitle() : "Untitled Recipe");
        recipe.setReadyInMinutes(dto.getReadyInMinutes());
        recipe.setServings(dto.getServings() != null ? dto.getServings() : 1); // Default to 1 serving if null
        recipe.setImage(dto.getImage());
        recipe.setImageType(dto.getImageType());
        recipe.setSummary(dto.getSummary());
        recipe.setSourceUrl(dto.getSourceUrl());
        
        if (dto.getCuisines() != null && !dto.getCuisines().isEmpty()) {
            recipe.setCuisineType(dto.getCuisines().get(0));
        }
        
        // Save to database
        return recipeRepository.save(recipe);
    }
}