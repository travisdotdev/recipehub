package csu33012_2425_group19.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import csu33012_2425_group19.demo.entity.Recipe;
import csu33012_2425_group19.demo.dto.ParsedInstruction;
import csu33012_2425_group19.demo.service.RecipeService;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @GetMapping("/search")
    public ResponseEntity<List<Recipe>> searchByIngredients(
            @RequestParam String ingredients,
            @RequestParam(defaultValue = "10") int number,
            @RequestParam(defaultValue = "1") int ranking,
            @RequestParam(defaultValue = "true") boolean ignorePantry) {
        try {
            List<Recipe> recipes = recipeService.searchByIngredients(ingredients, number, ranking, ignorePantry);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/complex-search")
    public ResponseEntity<List<Recipe>> searchByName(@RequestParam String query) {
        try {
            List<Recipe> recipes = recipeService.complexSearch(query);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        try {
            Recipe recipe = recipeService.getRecipeById(id);
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/instructions")
    public ResponseEntity<List<ParsedInstruction>> getRecipeInstructions(@PathVariable Long id) {
        try {
            List<ParsedInstruction> instructions = recipeService.getRecipeInstructions(id);
            return ResponseEntity.ok(instructions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}