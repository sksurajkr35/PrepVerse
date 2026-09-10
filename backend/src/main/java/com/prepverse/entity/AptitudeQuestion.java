package com.prepverse.entity;

import com.prepverse.converter.StringListConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;

/** One aptitude MCQ (Quantitative / Logical / Verbal). */
@Entity
@Table(name = "aptitude_questions")
public class AptitudeQuestion {

    @Id
    private String id;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String topic;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT", nullable = false)
    private List<String> options;

    @Column(name = "correct_answer_index", nullable = false)
    private int correctAnswerIndex;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(nullable = false)
    private int position;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public int getCorrectAnswerIndex() { return correctAnswerIndex; }
    public void setCorrectAnswerIndex(int correctAnswerIndex) { this.correctAnswerIndex = correctAnswerIndex; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
}
