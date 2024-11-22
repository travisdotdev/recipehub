package csu33012_2425_group19.demo.model;

import csu33012_2425_group19.demo.entity.Recipe;
import lombok.Data;
import java.util.List;

@Data
public class RecipeSearchResponse {
    private List<Recipe> results;
    private int offset;
    private int number;
    private int totalResults;
}