package csu33012_2425_group19.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class SpoonacularResponse {
    private List<RecipeDTO> results;
    private int offset;
    private int number;
    private int totalResults;
}