package csu33012_2425_group19.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "spoonacular.api")
public class SpoonacularConfig {
    private String key;
    private String baseUrl = "https://api.spoonacular.com";
    private RateLimit rateLimit = new RateLimit();

    // Getters and Setters
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
    public RateLimit getRateLimit() { return rateLimit; }
    public void setRateLimit(RateLimit rateLimit) { this.rateLimit = rateLimit; }

    public static class RateLimit {
        private int requestsPerDay = 150;
        private int requestsPerMinute = 10;

        public int getRequestsPerDay() { return requestsPerDay; }
        public void setRequestsPerDay(int requestsPerDay) { this.requestsPerDay = requestsPerDay; }
        public int getRequestsPerMinute() { return requestsPerMinute; }
        public void setRequestsPerMinute(int requestsPerMinute) { this.requestsPerMinute = requestsPerMinute; }
    }
}