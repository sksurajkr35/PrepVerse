# PrepVerse — Project Structure

Complete map of the repository: every tracked file, what it does, and how the
two halves (React frontend + Spring Boot backend) fit together.

> Generated from `git ls-files` — **179 tracked files, 39 directories**.
> Excluded: `.git/`, `node_modules/`, `target/`, `dist/` (all gitignored build output).

---

## 1. At a glance

```
PrepVerse/
├── backend/     Java 21 · Spring Boot 3 · MySQL 8      120 files
├── prepverse/   React 19 · TypeScript · Vite 6 · Tailwind 4   48 files
├── docs/        Report, demo script, viva Q&A            3 files
├── .github/     CI workflow                              1 file
├── .vscode/     Editor + task setup                      3 files
└── (root)       README, DEPLOY, VSCODE_SETUP, .gitignore 4 files
```

| | Count |
|---|---|
| Java main sources | 99 files · 5,704 LOC |
| Java tests | 7 files · 744 LOC |
| TS / TSX / CSS | 37 files · 7,074 LOC |
| Seed content (JSON) | 5 files · ~64 KB (single-line JSON) |

**Request flow**

```
Browser (React :5173) ──/api/*──▶ Spring Boot (:8080) ──▶ MySQL 8 (:3306)
        Vite dev proxy                  │
                                        ├──▶ Piston API   (real code execution)
                                        └──▶ Gemini 2.5   (AI mentor)
```

---

## 2. Full tree

```
.
├── .github
│   └── workflows
│       └── ci.yml
├── .vscode
│   ├── extensions.json
│   ├── settings.json
│   └── tasks.json
├── backend
│   ├── db
│   │   └── schema.sql
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com
│   │   │   │       └── prepverse
│   │   │   │           ├── config
│   │   │   │           │   ├── ActuatorConfig.java
│   │   │   │           │   ├── CorsConfig.java
│   │   │   │           │   ├── OpenApiConfig.java
│   │   │   │           │   ├── RestClientConfig.java
│   │   │   │           │   └── SecurityConfig.java
│   │   │   │           ├── controller
│   │   │   │           │   ├── AdminController.java
│   │   │   │           │   ├── AiMentorController.java
│   │   │   │           │   ├── AnalyticsController.java
│   │   │   │           │   ├── AuthController.java
│   │   │   │           │   ├── CompilerController.java
│   │   │   │           │   ├── ContentController.java
│   │   │   │           │   ├── HealthController.java
│   │   │   │           │   ├── LeaderboardController.java
│   │   │   │           │   ├── ProblemController.java
│   │   │   │           │   ├── ResumeController.java
│   │   │   │           │   ├── StudyPlanController.java
│   │   │   │           │   ├── SubmissionController.java
│   │   │   │           │   ├── TestAttemptController.java
│   │   │   │           │   └── UserController.java
│   │   │   │           ├── converter
│   │   │   │           │   ├── ExampleListConverter.java
│   │   │   │           │   ├── ObjectListConverter.java
│   │   │   │           │   ├── StringListConverter.java
│   │   │   │           │   └── StringMapConverter.java
│   │   │   │           ├── dto
│   │   │   │           │   ├── AdminProblemDetailDto.java
│   │   │   │           │   ├── AdminProblemRequest.java
│   │   │   │           │   ├── AdminStatsDto.java
│   │   │   │           │   ├── AiMentorRequest.java
│   │   │   │           │   ├── AiMentorResponse.java
│   │   │   │           │   ├── AnalyticsDto.java
│   │   │   │           │   ├── ApiError.java
│   │   │   │           │   ├── AuthResponse.java
│   │   │   │           │   ├── LeaderboardDto.java
│   │   │   │           │   ├── LoginRequest.java
│   │   │   │           │   ├── MarkSolvedRequest.java
│   │   │   │           │   ├── ProblemDto.java
│   │   │   │           │   ├── RefreshRequest.java
│   │   │   │           │   ├── RegisterRequest.java
│   │   │   │           │   ├── RunCodeRequest.java
│   │   │   │           │   ├── RunCodeResponse.java
│   │   │   │           │   ├── SubmissionDto.java
│   │   │   │           │   ├── SubmissionRequest.java
│   │   │   │           │   ├── SubmitRequest.java
│   │   │   │           │   ├── SubmitResponse.java
│   │   │   │           │   ├── TestAttemptDto.java
│   │   │   │           │   ├── TestAttemptRequest.java
│   │   │   │           │   ├── TestCaseDto.java
│   │   │   │           │   ├── UpdateProfileRequest.java
│   │   │   │           │   └── UserDto.java
│   │   │   │           ├── entity
│   │   │   │           │   ├── AptitudeQuestion.java
│   │   │   │           │   ├── Company.java
│   │   │   │           │   ├── CoreSubject.java
│   │   │   │           │   ├── InterviewQuestion.java
│   │   │   │           │   ├── MockTest.java
│   │   │   │           │   ├── Problem.java
│   │   │   │           │   ├── ProblemExample.java
│   │   │   │           │   ├── RefreshToken.java
│   │   │   │           │   ├── ResumeProfile.java
│   │   │   │           │   ├── StudyPlan.java
│   │   │   │           │   ├── Submission.java
│   │   │   │           │   ├── TestAttempt.java
│   │   │   │           │   ├── TestCase.java
│   │   │   │           │   ├── User.java
│   │   │   │           │   ├── UserActivity.java
│   │   │   │           │   └── UserActivityId.java
│   │   │   │           ├── exception
│   │   │   │           │   └── GlobalExceptionHandler.java
│   │   │   │           ├── repository
│   │   │   │           │   ├── AptitudeQuestionRepository.java
│   │   │   │           │   ├── CompanyRepository.java
│   │   │   │           │   ├── CoreSubjectRepository.java
│   │   │   │           │   ├── InterviewQuestionRepository.java
│   │   │   │           │   ├── MockTestRepository.java
│   │   │   │           │   ├── ProblemRepository.java
│   │   │   │           │   ├── RefreshTokenRepository.java
│   │   │   │           │   ├── ResumeProfileRepository.java
│   │   │   │           │   ├── StudyPlanRepository.java
│   │   │   │           │   ├── SubmissionRepository.java
│   │   │   │           │   ├── TestAttemptRepository.java
│   │   │   │           │   ├── TestCaseRepository.java
│   │   │   │           │   ├── UserActivityRepository.java
│   │   │   │           │   └── UserRepository.java
│   │   │   │           ├── security
│   │   │   │           │   ├── CustomUserDetailsService.java
│   │   │   │           │   ├── JwtAuthFilter.java
│   │   │   │           │   ├── JwtUtil.java
│   │   │   │           │   └── RateLimitFilter.java
│   │   │   │           ├── seed
│   │   │   │           │   ├── ContentSeeder.java
│   │   │   │           │   ├── DataSeeder.java
│   │   │   │           │   └── ProblemSeeder.java
│   │   │   │           ├── service
│   │   │   │           │   ├── AiMentorService.java
│   │   │   │           │   ├── AnalyticsService.java
│   │   │   │           │   ├── AuthService.java
│   │   │   │           │   ├── CompilerService.java
│   │   │   │           │   ├── JudgingService.java
│   │   │   │           │   ├── LeaderboardService.java
│   │   │   │           │   ├── ProblemService.java
│   │   │   │           │   ├── RefreshTokenService.java
│   │   │   │           │   ├── StreakService.java
│   │   │   │           │   ├── SubmissionService.java
│   │   │   │           │   ├── TestAttemptService.java
│   │   │   │           │   └── UserService.java
│   │   │   │           └── PrepverseApplication.java
│   │   │   └── resources
│   │   │       ├── content
│   │   │       │   ├── aptitude.json
│   │   │       │   ├── companies.json
│   │   │       │   ├── core-subjects.json
│   │   │       │   ├── interview.json
│   │   │       │   └── mock-tests.json
│   │   │       ├── application.properties
│   │   │       └── logback-spring.xml
│   │   └── test
│   │       └── java
│   │           └── com
│   │               └── prepverse
│   │                   ├── controller
│   │                   │   ├── AuthControllerTest.java
│   │                   │   └── ProblemControllerTest.java
│   │                   ├── security
│   │                   │   ├── JwtUtilTest.java
│   │                   │   └── RateLimitFilterTest.java
│   │                   └── service
│   │                       ├── JudgingServiceTest.java
│   │                       ├── RefreshTokenServiceTest.java
│   │                       └── StreakServiceTest.java
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── README.md
│   ├── docker-compose.yml
│   └── pom.xml
├── docs
│   ├── DEMO_SCRIPT.md
│   ├── PROJECT_REPORT.md
│   ├── PROJECT_STRUCTURE.md
│   └── VIVA_QA.md
├── prepverse
│   ├── src
│   │   ├── components
│   │   │   ├── AuthModal.tsx
│   │   │   ├── DailyChallengeCard.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PrepVerseScoreCard.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── context
│   │   │   └── AppContext.tsx
│   │   ├── data
│   │   │   └── mockData.ts
│   │   ├── pages
│   │   │   ├── AIMentorPage.tsx
│   │   │   ├── AdminPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── AptitudePage.tsx
│   │   │   ├── CodeArenaPage.tsx
│   │   │   ├── CompaniesPage.tsx
│   │   │   ├── CoreCSPage.tsx
│   │   │   ├── DSAPracticePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── InterviewPrepPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LeaderboardPage.tsx
│   │   │   ├── MockTestsPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── ResumeBuilderPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── StudyPlanPage.tsx
│   │   ├── services
│   │   │   ├── aiService.ts
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── compilerService.ts
│   │   │   ├── contentService.ts
│   │   │   ├── leaderboardService.ts
│   │   │   ├── problemService.ts
│   │   │   ├── storageService.ts
│   │   │   └── userDataService.ts
│   │   ├── types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── README.md
│   ├── index.html
│   ├── metadata.json
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
├── DEPLOY.md
├── README.md
└── VSCODE_SETUP.md

39 directories, 180 files
```

---

## 3. Frontend — `prepverse/`

React 19 + TypeScript + Vite 6 + Tailwind CSS 4. **No react-router** — navigation
is driven by an `activeTab` string in `AppContext`, switched in `App.tsx`.

### `src/` — application code (37 files)

| Path | Role |
|---|---|
| `main.tsx` | React root; mounts `<App />` |
| `App.tsx` | Layout shell + `activeTab` → page switch (17 cases) |
| `index.css` | Tailwind 4 entry, design tokens, aurora backdrop, dark mode |
| `types/index.ts` | Shared TS interfaces mirroring the backend DTOs |
| `context/AppContext.tsx` | Global state: auth, active tab, user, theme |
| `data/mockData.ts` | Fallback/demo data (largest frontend file, ~52 KB) |

**`components/` — 5 shared UI pieces**

| File | Purpose |
|---|---|
| `Navbar.tsx` | Top navigation bar |
| `Sidebar.tsx` | Collapsible side navigation |
| `AuthModal.tsx` | Login / register modal |
| `DailyChallengeCard.tsx` | Dashboard daily-problem widget |
| `PrepVerseScoreCard.tsx` | Score / streak summary card |

**`pages/` — 17 route targets**

| File | `activeTab` |
|---|---|
| `LandingPage.tsx` | `landing` (shown when unauthenticated) |
| `DashboardPage.tsx` | `dashboard` (default) |
| `DSAPracticePage.tsx` | `dsa` |
| `CodeArenaPage.tsx` | `compiler` |
| `AptitudePage.tsx` | `aptitude` |
| `MockTestsPage.tsx` | `mock-tests` |
| `CompaniesPage.tsx` | `companies` |
| `CoreCSPage.tsx` | `core-cs` |
| `InterviewPrepPage.tsx` | `interview` |
| `AIMentorPage.tsx` | `ai-mentor` |
| `StudyPlanPage.tsx` | `study-plan` |
| `ResumeBuilderPage.tsx` | `resume`, `resume-builder` |
| `LeaderboardPage.tsx` | `leaderboard` |
| `AnalyticsPage.tsx` | `analytics` |
| `ProfilePage.tsx` | `profile` |
| `SettingsPage.tsx` | `settings` |
| `AdminPage.tsx` | `admin` |

**`services/` — 9 API clients** (all talk to `/api/*`, proxied by Vite)

`api.ts` (fetch wrapper + auth headers) · `authService.ts` · `problemService.ts` ·
`compilerService.ts` · `contentService.ts` · `leaderboardService.ts` ·
`aiService.ts` · `userDataService.ts` · `storageService.ts` (localStorage persistence)

### Root config — 11 files

| File | Purpose |
|---|---|
| `package.json` | Scripts: `dev`, `build`, `preview`, `lint` (`tsc --noEmit`) |
| `package-lock.json` | Dependency lockfile (~112 KB) |
| `vite.config.ts` | React + Tailwind plugins, `@` alias, `0.0.0.0:5173`, `/api` → `:8080` proxy |
| `tsconfig.json` | TS compiler options |
| `index.html` | Vite HTML entry |
| `metadata.json` | App metadata |
| `Dockerfile` | Frontend image build |
| `nginx.conf` | Static serving config for the container |
| `.dockerignore` · `.env.example` · `README.md` | Container + env + docs |

Key deps: `react` 19, `recharts` (analytics charts), `motion` (animation),
`lucide-react` (icons), `canvas-confetti`, `tailwindcss` 4.

---

## 4. Backend — `backend/`

Java 21 · Spring Boot 3 · Spring Security (JWT) · Spring Data JPA · MySQL 8.
Package root: `com.prepverse`.

### Layered layout (99 main sources)

| Package | Files | Responsibility |
|---|---|---|
| `controller/` | 14 | REST endpoints, request/response wiring |
| `service/` | 12 | Business logic, judging, streaks, analytics |
| `repository/` | 14 | Spring Data JPA interfaces |
| `entity/` | 16 | JPA entities (+ `UserActivityId` composite key) |
| `dto/` | 25 | Request/response records, validation |
| `config/` | 5 | Security, CORS, OpenAPI, RestClient, Actuator |
| `security/` | 4 | JWT filter/util, user details, rate limiting |
| `converter/` | 4 | JPA `AttributeConverter`s for JSON-backed columns |
| `seed/` | 3 | Startup data loaders (problems + content) |
| `exception/` | 1 | `GlobalExceptionHandler` |
| *(root)* | 1 | `PrepverseApplication.java` |

### REST surface — 14 controllers

| Controller | Base path |
|---|---|
| `AuthController` | `/api/auth` |
| `UserController` | `/api/users` |
| `ProblemController` | `/api/problems` |
| `SubmissionController` | `/api/submissions` |
| `CompilerController` | `/api/compiler` |
| `ContentController` | `/api/content` |
| `TestAttemptController` | `/api/test-attempts` |
| `LeaderboardController` | `/api/leaderboard` |
| `AnalyticsController` | `/api/analytics` |
| `AiMentorController` | `/api/ai-mentor` |
| `StudyPlanController` | `/api/study-plan` |
| `ResumeController` | `/api/resume` |
| `AdminController` | `/api/admin` |
| `HealthController` | `/api/health` |

### Database — 14 mapped tables

`users` · `problems` · `test_cases` · `submissions` · `user_activity` ·
`refresh_tokens` · `aptitude_questions` · `mock_tests` · `test_attempts` ·
`companies` · `core_subjects` · `interview_questions` · `resume_profiles` ·
`study_plans`

DDL lives in `backend/db/schema.sql`; seed content in
`backend/src/main/resources/content/*.json` (`aptitude`, `companies`,
`core-subjects`, `interview`, `mock-tests`).

### Tests — `src/test/` (7 files)

| Package | Tests |
|---|---|
| `controller/` | `AuthControllerTest`, `ProblemControllerTest` |
| `security/` | `JwtUtilTest`, `RateLimitFilterTest` |
| `service/` | `JudgingServiceTest`, `RefreshTokenServiceTest`, `StreakServiceTest` |

### Root config

`pom.xml` (Maven build) · `docker-compose.yml` (app + MySQL) · `Dockerfile` ·
`.dockerignore` · `.env.example` · `README.md`

---

## 5. Repo-level files

| Path | Purpose |
|---|---|
| `README.md` | Overview, tech stack, setup, features |
| `DEPLOY.md` | Deployment guide (Docker / production) |
| `VSCODE_SETUP.md` | Extensions, one-click tasks, troubleshooting |
| `.gitignore` | Ignores `node_modules/`, `target/`, `dist/`, `.env`, IDE files |
| `.github/workflows/ci.yml` | CI: frontend typecheck/build + backend test |
| `.vscode/{extensions,settings,tasks}.json` | Shared editor + run-task config |
| `docs/PROJECT_REPORT.md` | Full project report |
| `docs/DEMO_SCRIPT.md` | Presentation walkthrough |
| `docs/VIVA_QA.md` | Viva / defence Q&A |
| `docs/PROJECT_STRUCTURE.md` | This file |

---

## 6. Ignored / generated (not in the tree above)

| Path | Produced by |
|---|---|
| `prepverse/node_modules/` | `npm install` |
| `prepverse/dist/` | `npm run build` |
| `backend/target/` | `mvn package` |
| `.env`, `.env.local` | Copied from `.env.example` |
| `*.log` | Runtime logs |

None of these are currently present in the workspace — this is a clean checkout.
