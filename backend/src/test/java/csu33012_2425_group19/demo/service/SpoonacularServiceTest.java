package csu33012_2425_group19.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import csu33012_2425_group19.demo.config.SpoonacularConfig;
import csu33012_2425_group19.demo.dto.RecipeDTO;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.function.Function;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class SpoonacularServiceTest {
    
    @Mock
    private WebClient.Builder webClientBuilder;
    
    @Mock
    private WebClient webClient;
    
    private SpoonacularService spoonacularService;
    
    @BeforeEach
    void setUp() {
        SpoonacularConfig config = new SpoonacularConfig();
        config.setBaseUrl("https://api.spoonacular.com");
        config.setKey("test-key");
        
        SpoonacularConfig.RateLimit rateLimit = new SpoonacularConfig.RateLimit();
        rateLimit.setRequestsPerMinute(150);
        rateLimit.setRequestsPerDay(1500);
        config.setRateLimit(rateLimit);
        
        lenient().when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);
        lenient().when(webClientBuilder.defaultHeader(anyString(), anyString())).thenReturn(webClientBuilder);
        lenient().when(webClientBuilder.build()).thenReturn(webClient);
        
        spoonacularService = new SpoonacularService(config, webClientBuilder);
    }
    
    @Test
    void testGetRandomRecipes() {
        // Setup
        RecipeDTO recipe = new RecipeDTO();
        recipe.setId(1L);
        recipe.setTitle("Random Recipe");
        
        SpoonacularService.RandomRecipeResponse mockResponse = 
            new SpoonacularService.RandomRecipeResponse(List.of(recipe));
            
        WebClient.RequestHeadersUriSpec uriSpec = mock(WebClient.RequestHeadersUriSpec.class);
        WebClient.RequestHeadersSpec headersSpec = mock(WebClient.RequestHeadersSpec.class);
        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);
        
        when(webClient.get()).thenReturn(uriSpec);
        when(uriSpec.uri(any(Function.class))).thenReturn(headersSpec);
        when(headersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(SpoonacularService.RandomRecipeResponse.class))
            .thenReturn(Mono.just(mockResponse));
        
        // Test
        List<RecipeDTO> results = spoonacularService.getRandomRecipes(1);
        
        // Verify
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals("Random Recipe", results.get(0).getTitle());
    }
    
    @Test
    void testGetRecipeById() {
        // Setup
        Long recipeId = 1L;
        RecipeDTO mockRecipe = new RecipeDTO();
        mockRecipe.setId(recipeId);
        mockRecipe.setTitle("Test Recipe");
        
        WebClient.RequestHeadersUriSpec uriSpec = mock(WebClient.RequestHeadersUriSpec.class);
        WebClient.RequestHeadersSpec headersSpec = mock(WebClient.RequestHeadersSpec.class);
        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);
        
        when(webClient.get()).thenReturn(uriSpec);
        when(uriSpec.uri("/recipes/{id}/information", recipeId)).thenReturn(headersSpec);
        when(headersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(RecipeDTO.class)).thenReturn(Mono.just(mockRecipe));
        
        // Test
        RecipeDTO result = spoonacularService.getRecipeById(recipeId);
        
        // Verify
        assertNotNull(result);
        assertEquals("Test Recipe", result.getTitle());
    }
}