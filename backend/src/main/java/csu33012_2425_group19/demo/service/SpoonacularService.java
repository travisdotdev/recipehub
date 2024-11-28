package csu33012_2425_group19.demo.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;  
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import csu33012_2425_group19.demo.config.SpoonacularConfig;
import csu33012_2425_group19.demo.dto.RecipeDTO;
import csu33012_2425_group19.demo.dto.ParsedInstruction;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.time.Duration;
import com.fasterxml.jackson.annotation.JsonProperty;

@Service
public class SpoonacularService {
    private static final Logger logger = LoggerFactory.getLogger(SpoonacularService.class);
    private final WebClient webClient;
    private final SpoonacularConfig config;
    
    // Cache for recipes
    private final Map<String, CacheEntry<List<RecipeDTO>>> listCache = new ConcurrentHashMap<>();
    private final Map<Long, CacheEntry<RecipeDTO>> recipeCache = new ConcurrentHashMap<>();
    private static final Duration CACHE_DURATION = Duration.ofMinutes(2);

    @Getter
    @Builder
    public static class ComplexSearchParams {
        private String query;
        private String cuisine;
        private String diet;
        private String type;
        private String sort;
        private String sortDirection;
        private Integer minRating;
        private Integer maxReadyTime;
        private Integer offset;
        private Integer number;
        private Boolean addRecipeInformation;
        private Boolean fillIngredients;
        private String includeIngredients;
    }

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
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RandomRecipeResponse {
        @JsonProperty("recipes")
        private List<RecipeDTO> recipes;
    }

    private static class CacheEntry<T> {
        final T data;
        final LocalDateTime timestamp;

        CacheEntry(T data) {
            this.data = data;
            this.timestamp = LocalDateTime.now();
        }

        boolean isExpired() {
            return LocalDateTime.now().isAfter(timestamp.plus(CACHE_DURATION));
        }
    }

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

    private synchronized void checkRateLimits() {
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
                "Rate limit exceeded. Please try again later.");
        }
        if (dayRequests.get() >= config.getRateLimit().getRequestsPerDay()) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, 
                "Daily rate limit exceeded. Please try again tomorrow.");
        }

        minuteRequests.incrementAndGet();
        dayRequests.incrementAndGet();
    }

    private <T> Optional<T> getFromCache(String key, Map<String, CacheEntry<T>> cache) {
        CacheEntry<T> entry = cache.get(key);
        if (entry != null && !entry.isExpired()) {
            return Optional.of(entry.data);
        }
        cache.remove(key);
        return Optional.empty();
    }

    public List<RecipeDTO> complexSearch(ComplexSearchParams params) {
        String cacheKey = "search-" + params.toString();
        Optional<List<RecipeDTO>> cached = getFromCache(cacheKey, listCache);
        if (cached.isPresent()) {
            return cached.get();
        }

        checkRateLimits();
        
        try {
            Map<String, String> queryParams = new HashMap<>();
            if (params.getQuery() != null) queryParams.put("query", params.getQuery());
            if (params.getCuisine() != null) queryParams.put("cuisine", params.getCuisine());
            if (params.getDiet() != null) queryParams.put("diet", params.getDiet());
            if (params.getType() != null) queryParams.put("type", params.getType());
            if (params.getSort() != null) queryParams.put("sort", params.getSort());
            if (params.getSortDirection() != null) queryParams.put("sortDirection", params.getSortDirection());
            if (params.getMinRating() != null) queryParams.put("minRating", params.getMinRating().toString());
            if (params.getMaxReadyTime() != null) queryParams.put("maxReadyTime", params.getMaxReadyTime().toString());
            if (params.getOffset() != null) queryParams.put("offset", params.getOffset().toString());
            if (params.getIncludeIngredients() != null) queryParams.put("includeIngredients", params.getIncludeIngredients());
            
            queryParams.put("number", String.valueOf(params.getNumber() != null ? params.getNumber() : 10));
            queryParams.put("addRecipeInformation", String.valueOf(true));
            queryParams.put("fillIngredients", String.valueOf(true));

            ComplexSearchResponse response = webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/recipes/complexSearch");
                    queryParams.forEach(uriBuilder::queryParam);
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(ComplexSearchResponse.class)
                .block();

            List<RecipeDTO> recipes = response != null && response.getResults() != null ? 
                response.getResults() : Collections.emptyList();

            recipes.forEach(this::setDefaultValues);
            listCache.put(cacheKey, new CacheEntry<>(recipes));
            return recipes;

        } catch (Exception e) {
            logger.error("Error in complexSearch: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error searching recipes", e);
        }
    }

    public List<RecipeDTO> searchByIngredients(String ingredients, int number, int ranking, boolean ignorePantry) {
        return complexSearch(ComplexSearchParams.builder()
            .includeIngredients(ingredients)
            .number(number)
            .build());
    }

    public List<RecipeDTO> getRandomRecipes(Integer number, String includeTags, String excludeTags, boolean includeNutrition) {
        String cacheKey = String.format("random-%d-%s-%s-%b", number, includeTags, excludeTags, includeNutrition);
        Optional<List<RecipeDTO>> cached = getFromCache(cacheKey, listCache);
        if (cached.isPresent()) {
            return cached.get();
        }

        checkRateLimits();
        
        try {
            RandomRecipeResponse response = webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/recipes/random")
                        .queryParam("number", Math.min(number, 100))
                        .queryParam("addRecipeInformation", true);
                    
                    if (includeTags != null && !includeTags.isEmpty()) {
                        uriBuilder.queryParam("tags", includeTags);
                    }
                    if (excludeTags != null && !excludeTags.isEmpty()) {
                        uriBuilder.queryParam("excludeTags", excludeTags);
                    }
                    
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(RandomRecipeResponse.class)
                .block();

            List<RecipeDTO> recipes = response != null && response.getRecipes() != null ? 
                response.getRecipes() : Collections.emptyList();

            recipes.forEach(this::setDefaultValues);
            listCache.put(cacheKey, new CacheEntry<>(recipes));
            return recipes;

        } catch (Exception e) {
            logger.error("Error in getRandomRecipes: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching random recipes", e);
        }
    }

    public List<RecipeDTO> getPopularRecipes(int number) {
        return complexSearch(ComplexSearchParams.builder()
            .sort("popularity")
            .sortDirection("desc")
            .number(number)
            .addRecipeInformation(true)
            .fillIngredients(true)
            .build());
    }

    public List<RecipeDTO> getFeaturedRecipes(int number) {
        return complexSearch(ComplexSearchParams.builder()
            .sort("rating")
            .sortDirection("desc")
            .minRating(85)
            .maxReadyTime(45)
            .number(number)
            .addRecipeInformation(true)
            .fillIngredients(true)
            .build());
    }

    public List<RecipeDTO> getLatestRecipes(int number) {
        return complexSearch(ComplexSearchParams.builder()
            .sort("time")
            .sortDirection("desc")
            .number(number)
            .addRecipeInformation(true)
            .fillIngredients(true)
            .build());
    }

    public List<RecipeDTO> getRandomRecipes(Integer number) {
        return getRandomRecipes(number, null, null, false);
    }

    public RecipeDTO getRecipeById(Long id) {
        Optional<RecipeDTO> cached = Optional.ofNullable(recipeCache.get(id))
            .filter(entry -> !entry.isExpired())
            .map(entry -> entry.data);
        if (cached.isPresent()) {
            return cached.get();
        }
    
        checkRateLimits();
        
        try {
            RecipeDTO recipe = webClient.get()
                .uri("/recipes/{id}/information", id)
                .retrieve()
                .bodyToMono(RecipeDTO.class)
                .block();
    
            if (recipe != null) {
                setDefaultValues(recipe);
                recipeCache.put(id, new CacheEntry<>(recipe));
                return recipe;
            }
    
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found");
        } catch (Exception e) {
            logger.error("Error in getRecipeById: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching recipe", e);
        }
    }

    public List<ParsedInstruction> getRecipeInstructions(Long id) {
        checkRateLimits();
        try {
            List<ParsedInstruction> instructions = webClient.get()
                .uri("/recipes/{id}/analyzedInstructions", id)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<ParsedInstruction>>() {})
                .block();

            return instructions != null ? instructions : Collections.emptyList();
        } catch (Exception e) {
            logger.error("Error in getRecipeInstructions: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching instructions", e);
        }
    }

    private void setDefaultValues(RecipeDTO recipe) {
        if (recipe.getReadyInMinutes() == null) recipe.setReadyInMinutes(30);
        if (recipe.getServings() == null) recipe.setServings(4);
        if (recipe.getImage() == null) recipe.setImage("/api/placeholder/400/300");
        if (recipe.getImageType() == null) recipe.setImageType("jpg");
    }
}