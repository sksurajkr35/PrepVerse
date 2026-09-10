package com.prepverse.entity;

import com.prepverse.converter.ObjectListConverter;
import com.prepverse.converter.StringListConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;
import java.util.Map;

/** Company hiring kit (process, pattern, topics, Q&A). */
@Entity
@Table(name = "companies")
public class Company {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(nullable = false)
    private String tier;

    @Column(name = "average_package")
    private String averagePackage;

    @Column(columnDefinition = "TEXT")
    private String overview;

    @Convert(converter = StringListConverter.class)
    @Column(name = "hiring_process", columnDefinition = "TEXT", nullable = false)
    private List<String> hiringProcess;

    @Convert(converter = ObjectListConverter.class)
    @Column(name = "exam_pattern", columnDefinition = "TEXT", nullable = false)
    private List<Map<String, Object>> examPattern;

    @Convert(converter = StringListConverter.class)
    @Column(name = "important_topics", columnDefinition = "TEXT", nullable = false)
    private List<String> importantTopics;

    @Convert(converter = StringListConverter.class)
    @Column(name = "technical_questions", columnDefinition = "TEXT", nullable = false)
    private List<String> technicalQuestions;

    @Convert(converter = StringListConverter.class)
    @Column(name = "hr_questions", columnDefinition = "TEXT", nullable = false)
    private List<String> hrQuestions;

    @Convert(converter = StringListConverter.class)
    @Column(name = "roles_hiring", columnDefinition = "TEXT", nullable = false)
    private List<String> rolesHiring;

    @Column(nullable = false)
    private int position;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public String getAveragePackage() { return averagePackage; }
    public void setAveragePackage(String averagePackage) { this.averagePackage = averagePackage; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public List<String> getHiringProcess() { return hiringProcess; }
    public void setHiringProcess(List<String> hiringProcess) { this.hiringProcess = hiringProcess; }

    public List<Map<String, Object>> getExamPattern() { return examPattern; }
    public void setExamPattern(List<Map<String, Object>> examPattern) { this.examPattern = examPattern; }

    public List<String> getImportantTopics() { return importantTopics; }
    public void setImportantTopics(List<String> importantTopics) { this.importantTopics = importantTopics; }

    public List<String> getTechnicalQuestions() { return technicalQuestions; }
    public void setTechnicalQuestions(List<String> technicalQuestions) { this.technicalQuestions = technicalQuestions; }

    public List<String> getHrQuestions() { return hrQuestions; }
    public void setHrQuestions(List<String> hrQuestions) { this.hrQuestions = hrQuestions; }

    public List<String> getRolesHiring() { return rolesHiring; }
    public void setRolesHiring(List<String> rolesHiring) { this.rolesHiring = rolesHiring; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
}
