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
  theme             VARCHAR(8)    NOT NULL DEFAULT 'dark',
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
  output        TEXT,
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

CREATE TABLE IF NOT EXISTS problems (
  id                      VARCHAR(255) NOT NULL PRIMARY KEY,
  title                   VARCHAR(255) NOT NULL,
  difficulty              VARCHAR(255) NOT NULL,
  acceptance_rate         DOUBLE       NOT NULL DEFAULT 0,
  topic                   VARCHAR(255),
  companies               TEXT,
  status                  VARCHAR(255) NOT NULL DEFAULT 'Unsolved',
  description             TEXT,
  examples                TEXT,
  constraints             TEXT,
  hints                   TEXT,
  expected_time_complexity VARCHAR(255),
  expected_space_complexity VARCHAR(255),
  starter_code            TEXT,
  display_order           INT          NOT NULL DEFAULT 0,
  created_at              DATETIME,
  updated_at              DATETIME
);

CREATE TABLE IF NOT EXISTS test_cases (
  id              BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  problem_id      VARCHAR(255) NOT NULL,
  input           TEXT,
  expected_output TEXT,
  hidden          TINYINT(1)   NOT NULL DEFAULT 0,
  position        INT          NOT NULL DEFAULT 0,
  INDEX idx_case_problem (problem_id),
  CONSTRAINT fk_case_problem FOREIGN KEY (problem_id) REFERENCES problems (id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          VARCHAR(255) NOT NULL PRIMARY KEY,
  user_id     VARCHAR(255) NOT NULL,
  token_hash  VARCHAR(64)  NOT NULL UNIQUE,
  expires_at  DATETIME     NOT NULL,
  revoked     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME,
  INDEX idx_rt_user (user_id),
  CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS aptitude_questions (
  id                    VARCHAR(255) NOT NULL PRIMARY KEY,
  category              VARCHAR(255) NOT NULL,
  topic                 VARCHAR(255) NOT NULL,
  question              TEXT         NOT NULL,
  options               TEXT         NOT NULL,
  correct_answer_index  INT          NOT NULL,
  explanation           TEXT,
  position              INT          NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mock_tests (
  id                VARCHAR(255) NOT NULL PRIMARY KEY,
  title             VARCHAR(255) NOT NULL,
  type              VARCHAR(255) NOT NULL,
  questions_count   INT          NOT NULL,
  duration_minutes  INT          NOT NULL,
  difficulty        VARCHAR(255) NOT NULL,
  best_score        INT,
  total_marks       INT          NOT NULL,
  company_name      VARCHAR(255),
  description       TEXT,
  questions         TEXT         NOT NULL,
  position          INT          NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS companies (
  id                  VARCHAR(255) NOT NULL PRIMARY KEY,
  name                VARCHAR(255) NOT NULL,
  logo_url            VARCHAR(255),
  tier                VARCHAR(255) NOT NULL,
  average_package     VARCHAR(255),
  overview            TEXT,
  hiring_process      TEXT         NOT NULL,
  exam_pattern        TEXT         NOT NULL,
  important_topics    TEXT         NOT NULL,
  technical_questions TEXT         NOT NULL,
  hr_questions        TEXT         NOT NULL,
  roles_hiring        TEXT         NOT NULL,
  position            INT          NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS core_subjects (
  id                  VARCHAR(255) NOT NULL PRIMARY KEY,
  name                VARCHAR(255) NOT NULL,
  short_name          VARCHAR(255) NOT NULL,
  icon_name           VARCHAR(255) NOT NULL,
  progress_percent    INT          NOT NULL DEFAULT 0,
  description         TEXT,
  topics              TEXT         NOT NULL,
  mcqs                TEXT         NOT NULL,
  interview_questions TEXT         NOT NULL,
  position            INT          NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS interview_questions (
  id              VARCHAR(255) NOT NULL PRIMARY KEY,
  category        VARCHAR(255) NOT NULL,
  subject_or_role VARCHAR(255) NOT NULL,
  question        TEXT         NOT NULL,
  sample_answer   TEXT,
  tips            TEXT         NOT NULL,
  difficulty      VARCHAR(255) NOT NULL,
  position        INT          NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_activity (
  user_id       VARCHAR(255) NOT NULL,
  activity_date DATE         NOT NULL,
  PRIMARY KEY (user_id, activity_date),
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS resume_profiles (
  user_id    VARCHAR(255) NOT NULL PRIMARY KEY,
  data       TEXT,
  updated_at DATETIME,
  CONSTRAINT fk_resume_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS study_plans (
  user_id    VARCHAR(255) NOT NULL PRIMARY KEY,
  data       TEXT,
  updated_at DATETIME,
  CONSTRAINT fk_plan_user FOREIGN KEY (user_id) REFERENCES users (id)
);
