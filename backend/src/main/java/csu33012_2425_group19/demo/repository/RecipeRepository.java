package csu33012_2425_group19.demo.repository;

import csu33012_2425_group19.demo.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByTitleContainingIgnoreCase(String title);
    
    boolean existsBySpoonacularId(Long spoonacularId);
    
    Recipe findBySpoonacularId(Long spoonacularId);
    
    @Query("SELECT r FROM Recipe r WHERE r.isPopular = true ORDER BY r.popularityRank DESC")
    List<Recipe> findPopularRecipes(Pageable pageable);
    
    @Query("SELECT r FROM Recipe r WHERE r.isFeatured = true ORDER BY r.rating DESC")
    List<Recipe> findFeaturedRecipes(Pageable pageable);
    
    @Query("SELECT r FROM Recipe r ORDER BY r.createdAt DESC")
    List<Recipe> findLatestRecipes(Pageable pageable);
    
    @Query("SELECT r FROM Recipe r WHERE r.lastApiSync < :threshold")
    List<Recipe> findRecipesNeedingUpdate(LocalDateTime threshold);
    
    List<Recipe> findByCuisineType(String cuisineType);
    
    @Query("SELECT r FROM Recipe r WHERE r.rating >= :minRating")
    List<Recipe> findByMinimumRating(Double minRating);
    
    @Query("SELECT r FROM Recipe r WHERE r.readyInMinutes <= :maxTime")
    List<Recipe> findByMaxReadyTime(Integer maxTime);
    
    @Query("SELECT r FROM Recipe r ORDER BY r.aggregateLikes DESC")
    List<Recipe> findTopByLikes(Pageable pageable);
    
    @Query("SELECT r FROM Recipe r ORDER BY r.healthScore DESC")
    List<Recipe> findTopByHealthScore(Pageable pageable);
    
    @Query("SELECT r FROM Recipe r WHERE r.lastApiSync < :threshold")
    List<Recipe> findOutdatedRecipes(@Param("threshold") LocalDateTime threshold);
}