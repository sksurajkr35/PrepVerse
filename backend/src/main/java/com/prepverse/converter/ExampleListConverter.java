package com.prepverse.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prepverse.entity.ProblemExample;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.List;

/** Stores visible problem examples as a JSON TEXT column. */
@Converter
public class ExampleListConverter implements AttributeConverter<List<ProblemExample>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<ProblemExample> attribute) {
        try {
            return attribute == null ? "[]" : MAPPER.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to serialize examples", e);
        }
    }

    @Override
    public List<ProblemExample> convertToEntityAttribute(String dbData) {
        try {
            if (dbData == null || dbData.isBlank()) {
                return List.of();
            }
            return MAPPER.readValue(dbData, new TypeReference<List<ProblemExample>>() {});
        } catch (Exception e) {
            throw new IllegalStateException("Failed to deserialize examples", e);
        }
    }
}
