package csu33012_2425_group19.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class RecipeDTO {
    private Long id;
    private String title;
    private Integer readyInMinutes;
    private Integer servings;
    private String image;
    private String imageType;
    private String summary;
    private String sourceUrl;
    private List<String> cuisines;
    private List<String> dishTypes;
    private List<String> instructions;
    
    // Additional fields from Spoonacular API
    private Boolean vegetarian;
    private Boolean vegan;
    private Boolean glutenFree;
    private Boolean dairyFree;
}