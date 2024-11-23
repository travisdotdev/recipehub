package csu33012_2425_group19.demo.repository;

import csu33012_2425_group19.demo.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByTitleContainingIgnoreCase(String title);
    boolean existsBySpoonacularId(Long spoonacularId);
    Recipe findBySpoonacularId(Long spoonacularId);
}