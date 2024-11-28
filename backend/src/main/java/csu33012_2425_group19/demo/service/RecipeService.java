package csu33012_2425_group19.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import csu33012_2425_group19.demo.dto.ParsedInstruction;
import csu33012_2425_group19.demo.dto.RecipeDTO;
import csu33012_2425_group19.demo.entity.Recipe;
import csu33012_2425_group19.demo.repository.RecipeRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecipeService {
    private final SpoonacularService spoonacularService;
    private final RecipeRepository recipeRepository;

    @Transactional(readOnly = true)
    public List<Recipe> getFeaturedRecipes(int number) {
        List<Recipe> cachedRecipes = recipeRepository.findFeaturedRecipes(PageRequest.of(0, number));
        
        if (cachedRecipes.size() >= number) {
            return cachedRecipes;
        }

        List<RecipeDTO> apiRecipes = spoonacularService.getFeaturedRecipes(number);
        return apiRecipes.stream()
            .map(dto -> {
                Recipe recipe = saveRecipeFromDTO(dto);
                recipe.setIsFeatured(true);
                return recipeRepository.save(recipe);
            })
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Recipe> getPopularRecipes(int number) {
        List<Recipe> cachedRecipes = recipeRepository.findPopularRecipes(PageRequest.of(0, number));
        
        if (cachedRecipes.size() >= number) {
            return cachedRecipes;
        }

        List<RecipeDTO> apiRecipes = spoonacularService.getPopularRecipes(number);
        return apiRecipes.stream()
            .map(dto -> {
                Recipe recipe = saveRecipeFromDTO(dto);
                recipe.setIsPopular(true);
                return recipeRepository.save(recipe);
            })
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Recipe> getLatestRecipes(int number) {
        List<Recipe> cachedRecipes = recipeRepository.findLatestRecipes(PageRequest.of(0, number));
        
        if (cachedRecipes.size() >= number) {
            return cachedRecipes;
        }

        List<RecipeDTO> apiRecipes = spoonacularService.getLatestRecipes(number);
        return apiRecipes.stream()
            .map(this::saveRecipeFromDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public Recipe getRecipeById(Long id) {
        Recipe recipe = recipeRepository.findBySpoonacularId(id);
        
        if (recipe != null && !recipe.needsUpdate()) {
            return recipe;
        }

        RecipeDTO recipeDTO = spoonacularService.getRecipeById(id);
        return saveRecipeFromDTO(recipeDTO);
    }

    @Transactional
    public List<Recipe> searchByIngredients(String ingredients, int number, int ranking, boolean ignorePantry) {
        List<RecipeDTO> recipeDTOs = spoonacularService.searchByIngredients(
            ingredients, number, ranking, ignorePantry);
        
        return recipeDTOs.stream()
            .map(this::saveRecipeFromDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public List<Recipe> complexSearch(String query) {
        List<Recipe> localResults = recipeRepository.findByTitleContainingIgnoreCase(query);
        
        if (!localResults.isEmpty()) {
            return localResults;
        }

        List<RecipeDTO> recipeDTOs = spoonacularService.complexSearch(
            SpoonacularService.ComplexSearchParams.builder()
                .query(query)
                .build()
        );
        
        return recipeDTOs.stream()
            .map(this::saveRecipeFromDTO)
            .collect(Collectors.toList());
    }

    public List<ParsedInstruction> getRecipeInstructions(Long id) {
        return spoonacularService.getRecipeInstructions(id);
    }

    public List<RecipeDTO> getRandomRecipes(Integer number, String includeTags, 
            String excludeTags, boolean includeNutrition) {
        return spoonacularService.getRandomRecipes(number, includeTags, 
            excludeTags, includeNutrition);
    }

    @Transactional
    protected Recipe saveRecipeFromDTO(RecipeDTO dto) {
        if (dto.getId() != null) {
            Recipe existingRecipe = recipeRepository.findBySpoonacularId(dto.getId());
            if (existingRecipe != null && !existingRecipe.needsUpdate()) {
                return existingRecipe;
            }
        }

        Recipe recipe = new Recipe();
        recipe.setSpoonacularId(dto.getId());
        recipe.setTitle(dto.getTitle() != null ? dto.getTitle() : "Untitled Recipe");
        recipe.setReadyInMinutes(dto.getReadyInMinutes());
        recipe.setServings(dto.getServings() != null ? dto.getServings() : 1);
        recipe.setImage(dto.getImage());
        recipe.setImageType(dto.getImageType());
        recipe.setSummary(dto.getSummary());
        recipe.setSourceUrl(dto.getSourceUrl());
        recipe.setAggregateLikes(dto.getAggregateLikes());
        recipe.setHealthScore(dto.getHealthScore() != null ? dto.getHealthScore().doubleValue() : null);
        recipe.setSpoonacularScore(dto.getSpoonacularScore());
        recipe.setPricePerServing(dto.getPricePerServing());
        
        if (dto.getCuisines() != null && !dto.getCuisines().isEmpty()) {
            recipe.setCuisineType(dto.getCuisines().get(0));
        }

        recipe.setLastApiSync(LocalDateTime.now());
        
        return recipeRepository.save(recipe);
    }

    @Scheduled(cron = "0 0 */4 * * *")
    @Transactional
    public void updateOutdatedRecipes() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);
        List<Recipe> outdatedRecipes = recipeRepository.findOutdatedRecipes(threshold);
        log.info("Found {} outdated recipes to update", outdatedRecipes.size());
        
        for (Recipe recipe : outdatedRecipes) {
            try {
                RecipeDTO updated = spoonacularService.getRecipeById(recipe.getSpoonacularId());
                saveRecipeFromDTO(updated);
                log.debug("Updated recipe: {}", recipe.getTitle());
            } catch (Exception e) {
                log.error("Failed to update recipe {}: {}", recipe.getTitle(), e.getMessage());
            }
        }
    }
}