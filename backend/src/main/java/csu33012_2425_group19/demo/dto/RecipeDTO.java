package csu33012_2425_group19.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecipeDTO {
    private Long id;
    private String title;
    private Integer readyInMinutes;
    private Integer servings;
    private String image;
    private String imageType;
    private String summary;
    private String sourceUrl;
    private String sourceName;
    private String creditsText;
    
    // Dietary information
    private Boolean vegetarian;
    private Boolean vegan;
    private Boolean glutenFree;
    private Boolean dairyFree;
    private Boolean veryHealthy;
    private Boolean cheap;
    private Boolean veryPopular;
    private Boolean sustainable;
    private Boolean lowFodmap;
    
    // Scores and metrics
    private Integer weightWatcherSmartPoints;
    private Integer healthScore;
    private Integer aggregateLikes;
    private Double spoonacularScore;
    private Double pricePerServing;
    
    // Recipe categorization
    private List<String> cuisines;
    private List<String> dishTypes;
    private List<String> diets;
    private List<String> occasions;
    
    // Recipe content
    private String instructions;
    private List<AnalyzedInstruction> analyzedInstructions;
    private List<ExtendedIngredient> extendedIngredients;
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ExtendedIngredient {
        private Long id;
        private String aisle;
        private String image;
        private String consistency;
        private String name;
        private String nameClean;
        private String original;
        private String originalName;
        private Double amount;
        private String unit;
        private List<String> meta;
        private Measures measures;
        
        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Measures {
            private Measure us;
            private Measure metric;
            
            @Data
            @JsonIgnoreProperties(ignoreUnknown = true)
            public static class Measure {
                private Double amount;
                private String unitShort;
                private String unitLong;
            }
        }
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AnalyzedInstruction {
        private String name;
        private List<Step> steps;
        
        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Step {
            private Integer number;
            private String step;
            private List<Ingredient> ingredients;
            private List<Equipment> equipment;
            private Length length;
            
            @Data
            @JsonIgnoreProperties(ignoreUnknown = true)
            public static class Length {
                private Integer number;
                private String unit;
            }
        }
        
        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Ingredient {
            private Long id;
            private String name;
            private String localizedName;
            private String image;
        }
        
        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Equipment {
            private Long id;
            private String name;
            private String localizedName;
            private String image;
        }
    }
}