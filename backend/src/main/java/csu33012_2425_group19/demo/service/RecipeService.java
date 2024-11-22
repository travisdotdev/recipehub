package csu33012_2425_group19.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;

import csu33012_2425_group19.demo.entity.Recipe;
import csu33012_2425_group19.demo.model.RecipeSearchResponse;
import csu33012_2425_group19.demo.model.ParsedInstruction;

import java.util.List;



@Service
public class RecipeService {

    private final WebClient webClient;

    @Value("${spoonacular.api.key}")
    private String apiKey;

    public RecipeService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    //reformatted our string uri to make it easier to add complex queries. The base version we had would get messy with each arg so this cleans a bit
    //code is still a bit messy but this is just a proof
    public List<Recipe> searchRecipesByIngredients(String ingredients, int number, int ranking, boolean ignorePantry) {
        String uri = String.format(
                "https://api.spoonacular.com/recipes/findByIngredients?apiKey=%s&ingredients=%s&number=%d&ranking=%d&ignorePantry=%b",
                apiKey, ingredients, number, ranking, ignorePantry
        );

        return webClient.get()
                .uri(uri)
                .retrieve()
                .bodyToFlux(Recipe.class)
                .collectList()
                .block();
    }

    public RecipeSearchResponse complexSearch(String query) {
        String uri = String.format(
                "https://api.spoonacular.com/recipes/complexSearch?apiKey=%s&query=%s",
                apiKey, query
        );

        return webClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(RecipeSearchResponse.class)
                .block();
    }


    public List<ParsedInstruction> getRecipeInstructions(Long id) {
        String uri = String.format("https://api.spoonacular.com/recipes/%d/analyzedInstructions?apiKey=%s", id, apiKey);

        return webClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<ParsedInstruction>>() {})
                .block();
    }
}
