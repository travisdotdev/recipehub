package csu33012_2425_group19.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import csu33012_2425_group19.demo.dto.ParsedInstruction;
import csu33012_2425_group19.demo.service.SpoonacularService;
import csu33012_2425_group19.demo.dto.RecipeDTO;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private SpoonacularService spoonacularService;

    @GetMapping("/searchByIngredients")
    public ResponseEntity<List<RecipeDTO>> searchByIngredients(
            @RequestParam String ingredients,
            @RequestParam(defaultValue = "5") int number,
            @RequestParam(defaultValue = "1") int ranking,
            @RequestParam(defaultValue = "true") boolean ignorePantry) {
        try {
            List<RecipeDTO> recipes = spoonacularService.searchByIngredients(ingredients, number, ranking, ignorePantry);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/complexSearch")
    public ResponseEntity<List<RecipeDTO>> complexSearch(@RequestParam String query) {
        try {
            List<RecipeDTO> recipes = spoonacularService.complexSearch(query);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDTO> getRecipeById(@PathVariable Long id) {
        try {
            RecipeDTO recipe = spoonacularService.getRecipeById(id);
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/instructions")
    public ResponseEntity<List<ParsedInstruction>> getRecipeInstructions(@PathVariable Long id) {
        try {
            List<ParsedInstruction> instructions = spoonacularService.getRecipeInstructions(id);
            return ResponseEntity.ok(instructions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/information")
    public ResponseEntity<RecipeDTO> getRecipeInformation(@PathVariable Long id) {
        try {
            RecipeDTO recipe = spoonacularService.getRecipeById(id);
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/ingredients")
    public ResponseEntity<List<RecipeDTO.ExtendedIngredient>> getRecipeIngredients(@PathVariable Long id) {
        try {
            RecipeDTO recipe = spoonacularService.getRecipeById(id);
            if (recipe != null && recipe.getExtendedIngredients() != null) {
                return ResponseEntity.ok(recipe.getExtendedIngredients());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/random")
    public ResponseEntity<List<RecipeDTO>> getRandomRecipes(
            @RequestParam(defaultValue = "1") Integer number,
            @RequestParam(required = false) String includeTags,
            @RequestParam(required = false) String excludeTags,
            @RequestParam(defaultValue = "false") boolean includeNutrition) {
        try {
            List<RecipeDTO> recipes = spoonacularService.getRandomRecipes(number, includeTags, excludeTags, includeNutrition);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}