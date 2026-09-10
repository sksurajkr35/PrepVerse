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

/**
 * Core CS subject kit (notes, MCQs, interview Qs). progressPercent is a
 * seeded placeholder until per-user subject progress lands.
 */
@Entity
@Table(name = "core_subjects")
public class CoreSubject {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "short_name", nullable = false)
    private String shortName;

    @Column(name = "icon_name", nullable = false)
    private String iconName;

    @Column(name = "progress_percent", nullable = false)
    private int progressPercent;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Convert(converter = ObjectListConverter.class)
    @Column(columnDefinition = "TEXT", nullable = false)
    private List<Map<String, Object>> topics;

    @Convert(converter = ObjectListConverter.class)
    @Column(columnDefinition = "TEXT", nullable = false)
    private List<Map<String, Object>> mcqs;

    @Convert(converter = StringListConverter.class)
    @Column(name = "interview_questions", columnDefinition = "TEXT", nullable = false)
    private List<String> interviewQuestions;

    @Column(nullable = false)
    private int position;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }

    public int getProgressPercent() { return progressPercent; }
    public void setProgressPercent(int progressPercent) { this.progressPercent = progressPercent; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Map<String, Object>> getTopics() { return topics; }
    public void setTopics(List<Map<String, Object>> topics) { this.topics = topics; }

    public List<Map<String, Object>> getMcqs() { return mcqs; }
    public void setMcqs(List<Map<String, Object>> mcqs) { this.mcqs = mcqs; }

    public List<String> getInterviewQuestions() { return interviewQuestions; }
    public void setInterviewQuestions(List<String> interviewQuestions) { this.interviewQuestions = interviewQuestions; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
}
