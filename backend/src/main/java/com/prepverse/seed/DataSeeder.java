package com.prepverse.seed;

import com.prepverse.entity.User;
import com.prepverse.repository.UserRepository;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds demo + leaderboard users on first run (only when users table is empty).
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (users.count() > 0) {
            return;
        }

        User demo = base("usr_demo", "Demo Student", "demo@prepverse.com", "demo1234",
            "Delhi Technological University (DTU)", 742, 74, 1286, 7, 18, 12, 4850, 14);
        demo.setSolvedProblemIds(new java.util.HashSet<>(Set.of("p1", "p2", "p3", "p4", "p5", "p7", "p9")));
        users.save(demo);

        User surya = base("usr_001", "Surya Rastogi", "surya@dtu.ac.in", "password123",
            "Delhi Technological University (DTU)", 742, 74, 1286, 127, 18, 12, 4850, 14);
        surya.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
        surya.setGithubUrl("https://github.com/suryarastogi");
        surya.setLeetcodeUrl("https://leetcode.com/suryarastogi");
        surya.setLinkedinUrl("https://linkedin.com/in/suryarastogi");
        surya.setCodechefUrl("https://codechef.com/users/suryarastogi");
        users.save(surya);

        users.save(base("usr_l1", "Aarav Sharma", "aarav@iitd.ac.in", "password123",
            "IIT Delhi", 948, 94, 2145, 382, 40, 60, 9200, 22));
        users.save(base("usr_l2", "Ananya Verma", "ananya@iitb.ac.in", "password123",
            "IIT Bombay", 922, 92, 2080, 345, 36, 45, 8800, 21));
        users.save(base("usr_l3", "Rohan Gupta", "rohan@bits.ac.in", "password123",
            "BITS Pilani", 895, 89, 1982, 310, 30, 38, 8100, 20));
        users.save(base("usr_l4", "Sneha Patel", "sneha@dtu.ac.in", "password123",
            "DTU", 860, 86, 1850, 278, 25, 30, 7600, 19));
        users.save(base("usr_l5", "Vikram Singh", "vikram@nsut.ac.in", "password123",
            "NSUT", 738, 73, 1275, 122, 15, 10, 4200, 13));

        log.info("Seeded {} users. Demo login: demo@prepverse.com / demo1234", users.count());
    }

    private User base(String id, String name, String email, String rawPassword, String college,
                      int score, int readiness, int rating, int solved, int tests,
                      int streak, int xp, int level) {
        User u = new User();
        u.setId(id);
        u.setName(name);
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(rawPassword));
        u.setCollege(college);
        u.setBranch("Computer Science & Engineering");
        u.setGraduationYear(2026);
        u.setTargetRole("Software Development Engineer (SDE-1)");
        u.setPreferredLanguage("C++");
        u.setPrepVerseScore(score);
        u.setPlacementReadiness(readiness);
        u.setCodingRating(rating);
        u.setProblemsSolved(solved);
        u.setMockTestsTaken(tests);
        u.setStreakDays(streak);
        u.setXp(xp);
        u.setLevel(level);
        u.setRole("student");
        return u;
    }
}
