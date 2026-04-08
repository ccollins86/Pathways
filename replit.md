# Disaster Prep Quest - 3D Educational Game

## Overview
Disaster Prep Quest is a 3D educational game built with React Three Fiber, designed to teach players about natural disaster preparedness and foundational programming concepts. Players explore various themed worlds, interact with NPCs, complete quests, and engage in interactive lessons and quizzes. The game aims to provide an engaging learning experience by integrating educational content directly into gameplay, covering topics from disaster readiness to algorithms and programming logic. The project envisions expanding into a modular template for creating diverse educational games, targeting a broad audience interested in interactive learning.

## User Preferences
No specific user preferences were provided in the original document.

## System Architecture
The game is built using React with TypeScript and leverages React Three Fiber for 3D rendering. State management is handled by Zustand. The frontend is served by an Express backend, which also manages user authentication and sessions.

**UI/UX Decisions:**
- **3D Environment:** Immersive 3D worlds (Town, Ocean, Factory, Psychic Shop) with interactive elements and NPCs.
- **HUDs:** Context-sensitive Head-Up Displays (HUDs) for objectives, progress, and game state.
- **Dialogue System:** Interactive dialogue boxes for NPC communication and quest progression.
- **Instructional Overlays:** Dedicated UI components for lessons and quizzes, integrating educational content seamlessly.
- **Interaction Cues:** Visual cues (e.g., glowing objects, E-key prompts) for interactive elements.

**Technical Implementations & Feature Specifications:**
- **Player Controller:** WASD movement, third-person follow camera, and specialized modes (e.g., boat mode, diving suit).
- **NPC System:** Reusable NPC component with proximity detection, E-key interaction, and dynamic dialogue.
- **Quest System:** Multi-stage quests with objective tracking, item collection, and interaction targets.
- **Modular Worlds:** Each world (e.g., Ocean World, Factory World, Psychic Shop) is a self-contained module with unique quests, lessons, and NPCs.
- **Programming Lessons:** Integrated lessons on control flow (if/else), loops (for/while), functions, and search algorithms (random, linear, binary search), followed by interactive practice quizzes.
- **Item Interaction:** Pickupable items, correct/wrong item handling for disaster prep, and machine interaction for manufacturing.
- **Authentication System:** User registration/login with PostgreSQL, bcrypt for password hashing, and express-session for persistent sessions.
- **Progress Persistence:** Server-side PostgreSQL storage of player progress at meaningful checkpoints (quest completion, practice quiz completion, world transitions, lesson phase completion). Progress is saved as a JSON blob in `user_progress` table using atomic upserts. Loaded automatically on login. Logout triggers full page reload to prevent cross-user state leakage. Key files: `server/storage.ts`, `server/routes.ts` (GET/POST `/api/progress`), `shared/schema.ts` (`userProgress` table + `progressDataSchema`).

**Core Game Flow:**
1. **Disaster Prep (World 1 - Town):** Learn about disaster types, gather correct items, and perform prep tasks. Concludes with a lesson and quiz on if/else statements.
2. **Marine Ecosystem Survey & Cleanup (World 2 - Ocean):** Survey marine life, identify environmental issues, and clean up chemical spills. Integrates lessons and quizzes on for/while loops.
3. **Factory Order Fulfillment (World 3 - Factory):** Operate machines to fulfill a manufacturing order, learning about functions. Followed by a functions practice quiz.
4. **Search Algorithm Game (World 4 - Psychic Shop):** Engage in a guessing game across three rounds (random, linear, binary search) to learn about algorithm efficiency. Concludes with a lesson and 8-question practice quiz on binary search using PracticeQuizBase (same layout/scoring as other worlds, purple theme). Lesson UI shows "Test Your Understanding" button; quiz replaces the lesson UI while active. After quiz completion, lesson returns with "Back to Town" button.
5. **Game Completion:** After finishing all 4 worlds, clicking "Back to Town" uses `returnToTown()` which sets `gameCompleted: true`, moves the player back to the town world, and saves progress. The player keeps their full score and all completion flags. The HUD shows a congratulations message and "Adventure Complete" with all 4 worlds checked off. Players can still explore town freely. Use "Reset Progress" from the settings menu to start over.

## LLM-Generated Quiz Questions
The game dynamically generates quiz questions using OpenAI (via Replit AI Integrations) with hardcoded fallback.

**Architecture:**
- **Server:** `server/questionGenerator.ts` generates questions via OpenAI `gpt-5-mini` model with world-specific prompts. Endpoint at `POST /api/generate-questions` accepts `worldId` and `count`.
- **Client Store:** `client/src/lib/stores/useQuestionPrefetch.ts` (Zustand) manages prefetched questions per world/quiz-type. Validates each question (distinct options, proper schema) and replaces invalid ones with random hardcoded fallbacks.
- **Prefetch Triggers:** Questions are prefetched on world entry (Town on game start, Ocean/Factory/Psychic via portal actions in `useGame.tsx`).
- **Hardcoded Questions:** Extracted to separate files (`townQuestions.ts`, `factoryQuestions.ts`, `oceanQuestions.ts`, `psychicQuestions.ts`) and serve as fallback when LLM generation hasn't completed or fails.
- **Quiz Components:** `PracticeQuizUI`, `FactoryPracticeQuizUI`, `OceanPracticeQuizUI`, `PsychicPracticeQuizUI`, and GameHUD lesson quiz all read from the prefetch store, falling back to hardcoded arrays seamlessly.

## External Dependencies
- **React:** Frontend library.
- **TypeScript:** For type-safe JavaScript.
- **React Three Fiber:** React renderer for Three.js.
- **@react-three/drei:** Collection of useful helpers for React Three Fiber.
- **Zustand:** State management library.
- **Express:** Backend server framework.
- **PostgreSQL:** Database for user authentication and progress persistence.
- **Bcrypt:** Password hashing library.
- **Express-session:** Middleware for managing user sessions.
- **Connect-pg-simple:** PostgreSQL session store for express-session.
- **OpenAI SDK:** (via Replit AI Integrations) for LLM-generated quiz questions.
