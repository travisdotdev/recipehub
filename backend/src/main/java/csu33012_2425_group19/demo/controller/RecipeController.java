package csu33012_2425_group19.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import csu33012_2425_group19.demo.dto.ParsedInstruction;
import csu33012_2425_group19.demo.service.SpoonacularService;
import csu33012_2425_group19.demo.dto.RecipeDTO;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private static final Logger logger = LoggerFactory.getLogger(RecipeController.class);

    @Autowired
    private SpoonacularService spoonacularService;

    @GetMapping("/featured")
    public ResponseEntity<List<RecipeDTO>> getFeaturedRecipes(
            @RequestParam(defaultValue = "10") int number) {
        try {
            List<RecipeDTO> recipes = spoonacularService.getFeaturedRecipes(number);
            logger.info("Retrieved {} featured recipes", recipes.size());
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            logger.error("Error getting featured recipes", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/popular")
    public ResponseEntity<List<RecipeDTO>> getPopularRecipes(
            @RequestParam(defaultValue = "10") int number) {
        try {
            List<RecipeDTO> recipes = spoonacularService.getPopularRecipes(number);
            logger.info("Retrieved {} popular recipes", recipes.size());
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            logger.error("Error getting popular recipes", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<List<RecipeDTO>> getLatestRecipes(
            @RequestParam(defaultValue = "10") int number) {
        try {
            List<RecipeDTO> recipes = spoonacularService.getLatestRecipes(number);
            logger.info("Retrieved {} latest recipes", recipes.size());
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            logger.error("Error getting latest recipes", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/searchByIngredients")
    public ResponseEntity<List<RecipeDTO>> searchByIngredients(
            @RequestParam String ingredients,
            @RequestParam(defaultValue = "5") int number,
            @RequestParam(defaultValue = "2") int ranking,
            @RequestParam(defaultValue = "true") boolean ignorePantry) {
        try {
            List<RecipeDTO> recipes = spoonacularService.searchByIngredients(
                ingredients, number, ranking, ignorePantry);
            
            // Log the response for debugging
            logger.info("Search by ingredients response size: {}", recipes.size());
            if (!recipes.isEmpty()) {
                RecipeDTO firstRecipe = recipes.get(0);
                logger.info("First recipe details - ID: {}, Title: {}, Image: {}", 
                    firstRecipe.getId(), 
                    firstRecipe.getTitle(), 
                    firstRecipe.getImage());
            }

            // Ensure all required fields are present
            recipes.forEach(recipe -> {
                if (recipe.getImage() == null) {
                    recipe.setImage("/api/placeholder/400/300");
                }
                if (recipe.getImageType() == null) {
                    recipe.setImageType("jpg");
                }
                if (recipe.getReadyInMinutes() == null) {
                    recipe.setReadyInMinutes(30);
                }
                if (recipe.getServings() == null) {
                    recipe.setServings(4);
                }
            });

            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            logger.error("Error searching recipes by ingredients", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/complexSearch")
    public ResponseEntity<List<RecipeDTO>> complexSearch(
            @RequestParam String query,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) String diet,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String sortDirection,
            @RequestParam(required = false) Integer minRating,
            @RequestParam(required = false) Integer maxReadyTime,
            @RequestParam(required = false) Integer offset,
            @RequestParam(defaultValue = "10") Integer number) {
        try {
            SpoonacularService.ComplexSearchParams params = SpoonacularService.ComplexSearchParams.builder()
                .query(query)
                .cuisine(cuisine)
                .diet(diet)
                .type(type)
                .sort(sort)
                .sortDirection(sortDirection)
                .minRating(minRating)
                .maxReadyTime(maxReadyTime)
                .offset(offset)
                .number(number)
                .addRecipeInformation(true)
                .fillIngredients(true)
                .build();
            
            List<RecipeDTO> recipes = spoonacularService.complexSearch(params);
            logger.info("Complex search response size: {}", recipes.size());
            
            // Ensure all required fields are present
            recipes.forEach(recipe -> {
                if (recipe.getImage() == null) {
                    recipe.setImage("/api/placeholder/400/300");
                }
                if (recipe.getImageType() == null) {
                    recipe.setImageType("jpg");
                }
                if (recipe.getReadyInMinutes() == null) {
                    recipe.setReadyInMinutes(30);
                }
                if (recipe.getServings() == null) {
                    recipe.setServings(4);
                }
            });

            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            logger.error("Error performing complex search", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDTO> getRecipeById(@PathVariable Long id) {
        try {
            RecipeDTO recipe = spoonacularService.getRecipeById(id);
            logger.info("Retrieved recipe by ID: {}", recipe.getTitle());
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            logger.error("Error getting recipe by ID", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/instructions")
    public ResponseEntity<List<ParsedInstruction>> getRecipeInstructions(@PathVariable Long id) {
        try {
            List<ParsedInstruction> instructions = spoonacularService.getRecipeInstructions(id);
            logger.info("Retrieved {} instruction sets for recipe ID: {}", instructions.size(), id);
            return ResponseEntity.ok(instructions);
        } catch (Exception e) {
            logger.error("Error getting recipe instructions", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/information")
    public ResponseEntity<RecipeDTO> getRecipeInformation(@PathVariable Long id) {
        try {
            RecipeDTO recipe = spoonacularService.getRecipeById(id);
            logger.info("Retrieved recipe information for ID: {}", id);
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            logger.error("Error getting recipe information", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/ingredients")
    public ResponseEntity<List<RecipeDTO.ExtendedIngredient>> getRecipeIngredients(@PathVariable Long id) {
        try {
            RecipeDTO recipe = spoonacularService.getRecipeById(id);
            if (recipe != null && recipe.getExtendedIngredients() != null) {
                logger.info("Retrieved {} ingredients for recipe ID: {}", 
                    recipe.getExtendedIngredients().size(), id);
                return ResponseEntity.ok(recipe.getExtendedIngredients());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error getting recipe ingredients", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/random")
    public ResponseEntity<List<RecipeDTO>> getRandomRecipes(
            @RequestParam(defaultValue = "20") Integer number,
            @RequestParam(required = false) String includeTags,
            @RequestParam(required = false) String excludeTags,
            @RequestParam(defaultValue = "false") boolean includeNutrition) {
        try {
            List<RecipeDTO> recipes = spoonacularService.getRandomRecipes(
                number, includeTags, excludeTags, includeNutrition);
            logger.info("Retrieved {} random recipes", recipes.size());
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            logger.error("Error getting random recipes", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}