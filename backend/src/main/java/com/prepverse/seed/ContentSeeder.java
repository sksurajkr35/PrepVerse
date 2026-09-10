package com.prepverse.seed;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prepverse.entity.AptitudeQuestion;
import com.prepverse.entity.Company;
import com.prepverse.entity.CoreSubject;
import com.prepverse.entity.InterviewQuestion;
import com.prepverse.entity.MockTest;
import com.prepverse.repository.AptitudeQuestionRepository;
import com.prepverse.repository.CompanyRepository;
import com.prepverse.repository.CoreSubjectRepository;
import com.prepverse.repository.InterviewQuestionRepository;
import com.prepverse.repository.MockTestRepository;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Loads the reference banks from classpath JSON (resources/content/*.json,
 * extracted verbatim from the original frontend dataset). Each bank seeds
 * once; display order follows the source files.
 */
@Component
public class ContentSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ContentSeeder.class);

    private final AptitudeQuestionRepository aptitude;
    private final MockTestRepository mockTests;
    private final CompanyRepository companies;
    private final CoreSubjectRepository coreSubjects;
    private final InterviewQuestionRepository interview;
    private final ObjectMapper mapper;

    public ContentSeeder(AptitudeQuestionRepository aptitude,
                         MockTestRepository mockTests,
                         CompanyRepository companies,
                         CoreSubjectRepository coreSubjects,
                         InterviewQuestionRepository interview,
                         ObjectMapper mapper) {
        this.aptitude = aptitude;
        this.mockTests = mockTests;
        this.companies = companies;
        this.coreSubjects = coreSubjects;
        this.interview = interview;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedAptitude();
        seedMockTests();
        seedCompanies();
        seedCoreSubjects();
        seedInterview();
    }

    private List<Map<String, Object>> load(String name) {
        try (InputStream in = new ClassPathResource("content/" + name).getInputStream()) {
            return mapper.readValue(in, new TypeReference<List<Map<String, Object>>>() {});
        } catch (IOException e) {
            throw new IllegalStateException("Missing content/" + name, e);
        }
    }

    private static String str(Map<String, Object> row, String key) {
        Object v = row.get(key);
        return v == null ? null : String.valueOf(v);
    }

    private static int intOr(Map<String, Object> row, String key, int fallback) {
        Object v = row.get(key);
        return v instanceof Number n ? n.intValue() : fallback;
    }

    private static Integer intOrNull(Map<String, Object> row, String key) {
        Object v = row.get(key);
        return v instanceof Number n ? n.intValue() : null;
    }

    private List<String> strList(Map<String, Object> row, String key) {
        Object v = row.get(key);
        if (v == null) {
            return List.of();
        }
        return mapper.convertValue(v, new TypeReference<List<String>>() {});
    }

    private List<Map<String, Object>> mapList(Map<String, Object> row, String key) {
        Object v = row.get(key);
        if (v == null) {
            return List.of();
        }
        return mapper.convertValue(v, new TypeReference<List<Map<String, Object>>>() {});
    }

    private void seedAptitude() {
        if (aptitude.count() > 0) {
            return;
        }
        List<Map<String, Object>> rows = load("aptitude.json");
        int pos = 0;
        for (Map<String, Object> r : rows) {
            AptitudeQuestion q = new AptitudeQuestion();
            q.setId(str(r, "id"));
            q.setCategory(str(r, "category"));
            q.setTopic(str(r, "topic"));
            q.setQuestion(str(r, "question"));
            q.setOptions(strList(r, "options"));
            q.setCorrectAnswerIndex(intOr(r, "correctAnswerIndex", 0));
            q.setExplanation(str(r, "explanation"));
            q.setPosition(pos++);
            aptitude.save(q);
        }
        log.info("Seeded {} aptitude questions.", rows.size());
    }

    private void seedMockTests() {
        if (mockTests.count() > 0) {
            return;
        }
        List<Map<String, Object>> rows = load("mock-tests.json");
        int pos = 0;
        for (Map<String, Object> r : rows) {
            MockTest t = new MockTest();
            t.setId(str(r, "id"));
            t.setTitle(str(r, "title"));
            t.setType(str(r, "type"));
            t.setQuestionsCount(intOr(r, "questionsCount", 0));
            t.setDurationMinutes(intOr(r, "durationMinutes", 0));
            t.setDifficulty(str(r, "difficulty"));
            t.setBestScore(intOrNull(r, "bestScore"));
            t.setTotalMarks(intOr(r, "totalMarks", 0));
            t.setCompanyName(str(r, "companyName"));
            t.setDescription(str(r, "description"));
            t.setQuestions(mapList(r, "questions"));
            t.setPosition(pos++);
            mockTests.save(t);
        }
        log.info("Seeded {} mock tests.", rows.size());
    }

    private void seedCompanies() {
        if (companies.count() > 0) {
            return;
        }
        List<Map<String, Object>> rows = load("companies.json");
        int pos = 0;
        for (Map<String, Object> r : rows) {
            Company c = new Company();
            c.setId(str(r, "id"));
            c.setName(str(r, "name"));
            c.setLogoUrl(str(r, "logoUrl"));
            c.setTier(str(r, "tier"));
            c.setAveragePackage(str(r, "averagePackage"));
            c.setOverview(str(r, "overview"));
            c.setHiringProcess(strList(r, "hiringProcess"));
            c.setExamPattern(mapList(r, "examPattern"));
            c.setImportantTopics(strList(r, "importantTopics"));
            c.setTechnicalQuestions(strList(r, "technicalQuestions"));
            c.setHrQuestions(strList(r, "hrQuestions"));
            c.setRolesHiring(strList(r, "rolesHiring"));
            c.setPosition(pos++);
            companies.save(c);
        }
        log.info("Seeded {} companies.", rows.size());
    }

    private void seedCoreSubjects() {
        if (coreSubjects.count() > 0) {
            return;
        }
        List<Map<String, Object>> rows = load("core-subjects.json");
        int pos = 0;
        for (Map<String, Object> r : rows) {
            CoreSubject s = new CoreSubject();
            s.setId(str(r, "id"));
            s.setName(str(r, "name"));
            s.setShortName(str(r, "shortName"));
            s.setIconName(str(r, "iconName"));
            s.setProgressPercent(intOr(r, "progressPercent", 0));
            s.setDescription(str(r, "description"));
            s.setTopics(mapList(r, "topics"));
            s.setMcqs(mapList(r, "mcqs"));
            s.setInterviewQuestions(strList(r, "interviewQuestions"));
            s.setPosition(pos++);
            coreSubjects.save(s);
        }
        log.info("Seeded {} core subjects.", rows.size());
    }

    private void seedInterview() {
        if (interview.count() > 0) {
            return;
        }
        List<Map<String, Object>> rows = load("interview.json");
        int pos = 0;
        for (Map<String, Object> r : rows) {
            InterviewQuestion q = new InterviewQuestion();
            q.setId(str(r, "id"));
            q.setCategory(str(r, "category"));
            q.setSubjectOrRole(str(r, "subjectOrRole"));
            q.setQuestion(str(r, "question"));
            q.setSampleAnswer(str(r, "sampleAnswer"));
            q.setTips(strList(r, "tips"));
            q.setDifficulty(str(r, "difficulty"));
            q.setPosition(pos++);
            interview.save(q);
        }
        log.info("Seeded {} interview questions.", rows.size());
    }
}
