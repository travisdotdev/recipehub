package csu33012_2425_group19.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "recipes")
public class Recipe {
    
    @Column(name = "spoonacular_id", unique = true)
    private Long spoonacularId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 3, max = 255)
    @Column(nullable = false)
    private String title;

    @Column(name = "ready_in_minutes")
    private Integer readyInMinutes;

    @Column
    private Integer servings;

    @Size(max = 255)
    private String image;

    @Column(name = "image_type", length = 10)
    private String imageType;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "source_url")
    private String sourceUrl;

    @Column(name = "cuisine_type")
    private String cuisineType;

    @Column(name = "difficulty_level")
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "aggregate_likes")
    private Integer aggregateLikes;

    @Column(name = "health_score")
    private Double healthScore;

    @Column(name = "spoonacular_score")
    private Double spoonacularScore;

    @Column(name = "price_per_serving")
    private Double pricePerServing;

    @Column(name = "is_popular")
    private Boolean isPopular = false;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "popularity_rank")
    private Integer popularityRank;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(name = "last_api_sync")
    private LocalDateTime lastApiSync;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "data_version")
    private Integer dataVersion = 1;

    public enum DifficultyLevel {
        EASY, MEDIUM, HARD
    }

    @PrePersist
    protected void onCreate() {
        lastApiSync = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dataVersion++;
    }

    public boolean needsUpdate() {
        return lastApiSync == null || 
               lastApiSync.isBefore(LocalDateTime.now().minusHours(24));
    }
}