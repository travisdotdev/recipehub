package csu33012_2425_group19.demo.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.Getter;
import lombok.RequiredArgsConstructor;  
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import csu33012_2425_group19.demo.config.SpoonacularConfig;
import csu33012_2425_group19.demo.dto.RecipeDTO;
import csu33012_2425_group19.demo.dto.ParsedInstruction;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;


@Service
public class SpoonacularService {
    private static final Logger logger = LoggerFactory.getLogger(SpoonacularService.class);
    private final WebClient webClient;
    private final SpoonacularConfig config;
    
    // Response classes for different endpoints
    @Getter
    @RequiredArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ComplexSearchResponse {
        private final List<RecipeDTO> results;
        private final int offset;
        private final int number;
        private final int totalResults;
    }

    @Getter
    @RequiredArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RandomRecipeResponse {
        private final List<RecipeDTO> recipes;
    }

    @Getter
    @RequiredArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FindByIngredientsResponse extends RecipeDTO {
        private final List<MissedIngredient> missedIngredients;
        private final List<UsedIngredient> usedIngredients;
        private final Double likes;
    }

    @Getter
    @RequiredArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MissedIngredient {
        private final Long id;
        private final String name;
        private final String original;
        private final String originalName;
    }

    @Getter
    @RequiredArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class UsedIngredient {
        private final Long id;
        private final String name;
        private final String original;
        private final String originalName;
    }

    // Rate limiting fields
    private final AtomicInteger minuteRequests = new AtomicInteger(0);
    private final AtomicInteger dayRequests = new AtomicInteger(0);
    private LocalDateTime lastMinuteReset = LocalDateTime.now();
    private LocalDateTime lastDayReset = LocalDateTime.now();

    public SpoonacularService(SpoonacularConfig config, WebClient.Builder webClientBuilder) {
        this.config = config;
        this.webClient = webClientBuilder
            .baseUrl(config.getBaseUrl())
            .defaultHeader("x-api-key", config.getKey())
            .build();
    }

    private void checkRateLimits() {
        LocalDateTime now = LocalDateTime.now();

        if (now.isAfter(lastMinuteReset.plusMinutes(1))) {
            minuteRequests.set(0);
            lastMinuteReset = now;
        }

        if (now.isAfter(lastDayReset.plusDays(1))) {
            dayRequests.set(0);
            lastDayReset = now;
        }

        if (minuteRequests.get() >= config.getRateLimit().getRequestsPerMinute()) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, 
                "Minute rate limit exceeded. Please wait before making more requests.");
        }

        if (dayRequests.get() >= config.getRateLimit().getRequestsPerDay()) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, 
                "Daily rate limit exceeded. Please try again tomorrow.");
        }

        minuteRequests.incrementAndGet();
        dayRequests.incrementAndGet();
    }

    /**
     * Search recipes by ingredients
     */
    public List<RecipeDTO> searchByIngredients(String ingredients, int number, int ranking, boolean ignorePantry) {
        checkRateLimits();
        
        logger.info("Searching recipes with ingredients: {}", ingredients);
        
        try {
            List<FindByIngredientsResponse> response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/recipes/findByIngredients")
                    .queryParam("ingredients", ingredients)
                    .queryParam("number", number)
                    .queryParam("ranking", ranking)
                    .queryParam("ignorePantry", ignorePantry)
                    .queryParam("addRecipeInformation", true)
                    .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<FindByIngredientsResponse>>() {})
                .doOnNext(recipes -> logger.info("Received {} recipes", recipes.size()))
                .doOnError(error -> logger.error("Error searching by ingredients: {}", error.getMessage()))
                .block();

            return response != null ? new ArrayList<>(response) : Collections.emptyList();
        } catch (Exception e) {
            logger.error("Error in searchByIngredients: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error searching recipes", e);
        }
    }

    /**
     * Complex search for recipes
     */
    public List<RecipeDTO> complexSearch(String query) {
        checkRateLimits();
        
        logger.info("Performing complex search with query: {}", query);
        
        try {
            ComplexSearchResponse response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/recipes/complexSearch")
                    .queryParam("query", query)
                    .queryParam("addRecipeInformation", true)
                    .queryParam("fillIngredients", true)
                    .queryParam("number", 10)
                    .build())
                .retrieve()
                .bodyToMono(ComplexSearchResponse.class)
                .doOnNext(searchResponse -> 
                    logger.info("Received {} recipes from complex search", 
                        searchResponse.getResults().size()))
                .block();

            return response != null ? response.getResults() : Collections.emptyList();
        } catch (Exception e) {
            logger.error("Error in complexSearch: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error searching recipes", e);
        }
    }

    /**
     * Get detailed recipe information
     */
    public RecipeDTO getRecipeById(Long id) {
        checkRateLimits();
        
        logger.info("Fetching recipe details for ID: {}", id);
        
        try {
            return webClient.get()
                .uri("/recipes/{id}/information", id)
                .retrieve()
                .bodyToMono(RecipeDTO.class)
                .doOnNext(recipe -> logger.info("Retrieved recipe: {}", recipe.getTitle()))
                .block();
        } catch (Exception e) {
            logger.error("Error in getRecipeById: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching recipe", e);
        }
    }

    /**
     * Get recipe instructions
     */
    public List<ParsedInstruction> getRecipeInstructions(Long id) {
        checkRateLimits();
        
        logger.info("Fetching instructions for recipe ID: {}", id);
        
        try {
            List<ParsedInstruction> instructions = webClient.get()
                .uri("/recipes/{id}/analyzedInstructions", id)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<ParsedInstruction>>() {})
                .doOnNext(instr -> logger.info("Retrieved {} instruction sets", instr.size()))
                .block();

            return instructions != null ? instructions : Collections.emptyList();
        } catch (Exception e) {
            logger.error("Error in getRecipeInstructions: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching instructions", e);
        }
    }

    /**
     * Get random recipes
     */
    public List<RecipeDTO> getRandomRecipes(Integer number) {
        checkRateLimits();
        
        logger.info("Fetching {} random recipes", number);
        
        try {
            RandomRecipeResponse response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/recipes/random")
                    .queryParam("number", number)
                    .build())
                .retrieve()
                .bodyToMono(RandomRecipeResponse.class)
                .doOnNext(randomResponse -> 
                    logger.info("Retrieved {} random recipes", 
                        randomResponse.getRecipes().size()))
                .block();

            return response != null ? response.getRecipes() : Collections.emptyList();
        } catch (Exception e) {
            logger.error("Error in getRandomRecipes: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching random recipes", e);
        }
    }
}