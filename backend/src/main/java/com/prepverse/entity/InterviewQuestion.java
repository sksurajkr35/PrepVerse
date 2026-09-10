package com.prepverse.entity;

import com.prepverse.converter.StringListConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;

/** HR / Technical / Behavioral / Project interview question with guidance. */
@Entity
@Table(name = "interview_questions")
public class InterviewQuestion {

    @Id
    private String id;

    @Column(nullable = false)
    private String category;

    @Column(name = "subject_or_role", nullable = false)
    private String subjectOrRole;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(name = "sample_answer", columnDefinition = "TEXT")
    private String sampleAnswer;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT", nullable = false)
    private List<String> tips;

    @Column(nullable = false)
    private String difficulty;

    @Column(nullable = false)
    private int position;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubjectOrRole() { return subjectOrRole; }
    public void setSubjectOrRole(String subjectOrRole) { this.subjectOrRole = subjectOrRole; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getSampleAnswer() { return sampleAnswer; }
    public void setSampleAnswer(String sampleAnswer) { this.sampleAnswer = sampleAnswer; }

    public List<String> getTips() { return tips; }
    public void setTips(List<String> tips) { this.tips = tips; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
}
