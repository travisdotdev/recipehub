package csu33012_2425_group19.demo.model;

import java.util.List;
import lombok.Data;

@Data
public class ParsedInstruction {
    private String name;
    private List<Step> steps;

    @Data
    public static class Step {
        private int number;
        private String step;
        private List<Ingredient> ingredients;
        private List<Equipment> equipment;
    }

    @Data
    public static class Ingredient {
        private int id;
        private String name;
        private String localizedName;
        private String image;
    }

    @Data
    public static class Equipment {
        private int id;
        private String name;
        private String localizedName;
        private String image;
    }
}
