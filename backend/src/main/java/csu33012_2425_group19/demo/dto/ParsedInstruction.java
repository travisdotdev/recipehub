package csu33012_2425_group19.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class ParsedInstruction {
    private String name;
    private List<Step> steps;

    @Data
    public static class Step {
        private Integer number;
        private String step;
        private List<Ingredient> ingredients;
        private List<Equipment> equipment;
    }

    @Data
    public static class Ingredient {
        private Long id;
        private String name;
        private String localizedName;
        private String image;
    }

    @Data
    public static class Equipment {
        private Long id;
        private String name;
        private String localizedName;
        private String image;
    }
}