package csu33012_2425_group19.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import csu33012_2425_group19.demo.entity.Recipe;
import csu33012_2425_group19.demo.model.RecipeSearchResponse;
import csu33012_2425_group19.demo.model.ParsedInstruction;
import csu33012_2425_group19.demo.service.RecipeService;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    // Endpoint to search recipes by ingredients
    //https://spoonacular.com/food-api/docs#Search-Recipes-by-Ingredients
    //just set default values below. would have to finetune in meeting

    @GetMapping("/searchByIngredients")
    public List<Recipe> searchByIngredients(
            @RequestParam String ingredients,
            @RequestParam(defaultValue = "10") int number,
            @RequestParam(defaultValue = "1") int ranking,
            @RequestParam(defaultValue = "true") boolean ignorePantry) {
        return recipeService.searchRecipesByIngredients(ingredients, number, ranking, ignorePantry);
    }

    // Search by name. Using complex query because i cant find a simple name api
    //https://spoonacular.com/food-api/docs#Search-Recipes-Complex
    //Can further extend this by adding filters/making grid boxes of possibilites?
    @GetMapping("/complexSearch")
    public RecipeSearchResponse searchByName(@RequestParam String query) {
        return recipeService.complexSearch(query);
    }

    // Endpoint for step-by-step instructions
    //https://spoonacular.com/food-api/docs#Analyze-Recipe-Instructions
    @GetMapping("/{id}/instructions")
    public List<ParsedInstruction> getRecipeInstructions(@PathVariable Long id) {
        return recipeService.getRecipeInstructions(id);
    }


}
