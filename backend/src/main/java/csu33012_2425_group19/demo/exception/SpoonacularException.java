package csu33012_2425_group19.demo.exception;

import org.springframework.http.HttpStatus;

public class SpoonacularException extends RuntimeException {
    private final HttpStatus status;
    private final String errorCode;

    public SpoonacularException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public SpoonacularException(String message, HttpStatus status) {
        this(message, status, "SPOONACULAR_API_ERROR");
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorCode() {
        return errorCode;
    }
}