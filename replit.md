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

**Core Game Flow:**
1. **Disaster Prep (World 1 - Town):** Learn about disaster types, gather correct items, and perform prep tasks. Concludes with a lesson and quiz on if/else statements.
2. **Marine Ecosystem Survey & Cleanup (World 2 - Ocean):** Survey marine life, identify environmental issues, and clean up chemical spills. Integrates lessons and quizzes on for/while loops.
3. **Factory Order Fulfillment (World 3 - Factory):** Operate machines to fulfill a manufacturing order, learning about functions. Followed by a functions practice quiz.
4. **Search Algorithm Game (World 4 - Psychic Shop):** Engage in a guessing game across three rounds (random, linear, binary search) to learn about algorithm efficiency. Concludes with a lesson and 8-question practice quiz on binary search (PsychicPracticeQuizUI).

## External Dependencies
- **React:** Frontend library.
- **TypeScript:** For type-safe JavaScript.
- **React Three Fiber:** React renderer for Three.js.
- **@react-three/drei:** Collection of useful helpers for React Three Fiber.
- **Zustand:** State management library.
- **Express:** Backend server framework.
- **PostgreSQL:** Database for user authentication.
- **Bcrypt:** Password hashing library.
- **Express-session:** Middleware for managing user sessions.
- **Connect-pg-simple:** PostgreSQL session store for express-session.