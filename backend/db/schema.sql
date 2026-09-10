-- =====================================================================
-- PrepVerse MySQL schema (reference).
-- Tables are auto-created by Hibernate (ddl-auto=update), this file shows
-- exactly what the Java @Entity classes map to. Run it manually if you
-- prefer to create tables yourself (then set ddl-auto=validate).
-- =====================================================================
CREATE DATABASE IF NOT EXISTS prepverse
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE prepverse;

CREATE TABLE IF NOT EXISTS users (
  id                VARCHAR(255)  NOT NULL PRIMARY KEY,
  name              VARCHAR(255)  NOT NULL,
  email             VARCHAR(255)  NOT NULL UNIQUE,
  password_hash     VARCHAR(255),
  college           VARCHAR(255),
  branch            VARCHAR(255),
  graduation_year   INT,
  target_role       VARCHAR(255),
  preferred_language VARCHAR(255),
  avatar_url        VARCHAR(512),
  prep_verse_score  INT           NOT NULL DEFAULT 0,
  placement_readiness INT         NOT NULL DEFAULT 0,
  coding_rating     INT           NOT NULL DEFAULT 0,
  problems_solved   INT           NOT NULL DEFAULT 0,
  mock_tests_taken  INT           NOT NULL DEFAULT 0,
  streak_days       INT           NOT NULL DEFAULT 0,
  xp                INT           NOT NULL DEFAULT 0,
  level             INT           NOT NULL DEFAULT 1,
  role              VARCHAR(255)  NOT NULL DEFAULT 'student',
  github_url        VARCHAR(255),
  leetcode_url      VARCHAR(255),
  linkedin_url      VARCHAR(255),
  codechef_url      VARCHAR(255),
  created_at        DATETIME,
  updated_at        DATETIME
);

CREATE TABLE IF NOT EXISTS user_solved_problems (
  user_id     VARCHAR(255) NOT NULL,
  problem_id  VARCHAR(255),
  PRIMARY KEY (user_id, problem_id),
  CONSTRAINT fk_solved_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS submissions (
  id            VARCHAR(255) NOT NULL PRIMARY KEY,
  user_id       VARCHAR(255) NOT NULL,
  problem_id    VARCHAR(255) NOT NULL,
  problem_title VARCHAR(255),
  language      VARCHAR(255),
  status        VARCHAR(255),
  runtime       VARCHAR(255),
  memory        VARCHAR(255),
  code          TEXT,
  submitted_at  DATETIME,
  INDEX idx_sub_user (user_id),
  CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS test_attempts (
  id              BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id         VARCHAR(255)  NOT NULL,
  test_id         VARCHAR(255),
  score           INT           NOT NULL DEFAULT 0,
  total_marks     INT           NOT NULL DEFAULT 0,
  accuracy        DOUBLE        NOT NULL DEFAULT 0,
  correct_answers INT           NOT NULL DEFAULT 0,
  wrong_answers   INT           NOT NULL DEFAULT 0,
  skipped         INT           NOT NULL DEFAULT 0,
  percentile      DOUBLE        NOT NULL DEFAULT 0,
  completed_at    DATETIME,
  INDEX idx_attempt_user (user_id),
  CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS test_attempt_topics (
  attempt_id   BIGINT       NOT NULL,
  topic        VARCHAR(255) NOT NULL,
  topic_score  INT,
  PRIMARY KEY (attempt_id, topic),
  CONSTRAINT fk_topic_attempt FOREIGN KEY (attempt_id) REFERENCES test_attempts (id)
);
