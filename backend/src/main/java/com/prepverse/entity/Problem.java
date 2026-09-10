package com.prepverse.entity;

import com.prepverse.converter.ExampleListConverter;
import com.prepverse.converter.StringListConverter;
import com.prepverse.converter.StringMapConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * A DSA problem in the MySQL question bank.
 * Judging test cases live in the separate {@code test_cases} table
 * (hidden cases are NEVER sent to the frontend).
 */
@Entity
@Table(name = "problems")
public class Problem {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String difficulty;

    private double acceptanceRate;
    private String topic;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> companies;

    /** Canonical bank status; the frontend overlays the user's real status. */
    @Column(nullable = false)
    private String status = "Unsolved";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Convert(converter = ExampleListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<ProblemExample> examples;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> constraints;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> hints;

    private String expectedTimeComplexity;
    private String expectedSpaceComplexity;

    /** language id -> full-program starter template (stdin/stdout style). */
    @Convert(converter = StringMapConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, String> starterCode;

    private int displayOrder;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public double getAcceptanceRate() { return acceptanceRate; }
    public void setAcceptanceRate(double acceptanceRate) { this.acceptanceRate = acceptanceRate; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public List<String> getCompanies() { return companies; }
    public void setCompanies(List<String> companies) { this.companies = companies; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<ProblemExample> getExamples() { return examples; }
    public void setExamples(List<ProblemExample> examples) { this.examples = examples; }

    public List<String> getConstraints() { return constraints; }
    public void setConstraints(List<String> constraints) { this.constraints = constraints; }

    public List<String> getHints() { return hints; }
    public void setHints(List<String> hints) { this.hints = hints; }

    public String getExpectedTimeComplexity() { return expectedTimeComplexity; }
    public void setExpectedTimeComplexity(String v) { this.expectedTimeComplexity = v; }

    public String getExpectedSpaceComplexity() { return expectedSpaceComplexity; }
    public void setExpectedSpaceComplexity(String v) { this.expectedSpaceComplexity = v; }

    public Map<String, String> getStarterCode() { return starterCode; }
    public void setStarterCode(Map<String, String> starterCode) { this.starterCode = starterCode; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
