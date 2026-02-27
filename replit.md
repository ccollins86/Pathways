# Disaster Prep Quest - 3D Educational Game

## Overview
A 3D educational game built with React Three Fiber where players learn about natural disaster preparedness. Players navigate a town, talk to NPCs, and learn how to prepare for hurricanes, wildfires, and earthquakes.

## Recent Changes
- 2026-02-27: Added Ocean World programming lessons - after cleanup quest completion, two lesson overlays appear: (1) For Loops lesson connecting ecosystem survey to for-each loops, (2) While Loops lesson connecting sludge cleanup to while loops; oceanLessonPhase state (0=none,1=forLoop,2=whileLoop,3=done); HUD hides during lessons
- 2026-02-27: Polish pass 3 - fish/turtle rotation smoothing (lerped angle fixes atan2 discontinuity spinning), dialogue E key uses capture phase + stopImmediatePropagation to block dock handler, GameHUD task list toggleable, trash debris redesigned as colorful recognizable items (red can, blue bottle, plastic bag, etc.), marine plants (Seaweed/KelpStalk/SeagrassClump) made larger/more detailed, survey→cleanup auto-transition (Josh combines survey congrats with cleanup quest start)
- 2026-02-27: Polish pass 2 - smaller/better seahorse model, fixed turtle spinning, trapped fish count in animal totals, toggleable task HUD, boat dock E key no longer triggers during dialogue close
- 2026-02-27: Polish pass - separated Kelp Forest and Seagrass Meadow positions, added trapped fish struggling in fishing nets, enlarged/improved seahorse with emissive glow (no more spinning), made sludge patches much larger/brighter, Josh dialogue uses "while" language without exact sludge counts, HUD shows progress bar without numbers
- 2026-02-27: Added chemical spill cleanup quest - after survey completion, Josh assigns cleanup task, player boards boat with vacuum, drives to 8 green glowing sludge patches and vacuums them up, returns to Josh
- 2026-02-27: Enhanced ocean ecosystems - much more detailed fish/marine life models, moved ecosystems deeper into the ocean and further apart, added diving suit mechanic (suit station on beach, player must equip before entering water, visual change to wetsuit), player sinks slightly underwater
- 2026-02-27: Added Ocean World marine ecosystem survey quest - 4 ecosystems (Coral Reef, Kelp Forest, Tide Pool, Seagrass Meadow) with marine life, environmental issues, SurveyUI for counting animals/plants/identifying issues, Josh NPC quest dialogue flow
- 2026-02-26: Added Ocean World (World 2) - beach environment with ocean, palm trees, building, and NPC Josh; accessible via portal after quest + quiz
- 2026-02-26: Added portal feature - glowing portal appears after quest + practice quiz completion, leads to Ocean World
- 2026-02-16: Created modular game-template/ directory - config-driven copy for building new educational games
- 2026-02-16: Added Practice Station booth with 8 if/else-if/else quiz questions, unlocked after quest completion + lesson
- 2026-02-16: Replaced earthquake "books in bag" task with "shut off gas lines with wrench"
- 2026-02-16: Added wrong-choice failure mechanic - all items from all disasters now spawn, using wrong items fails the quest
- 2026-02-16: Initial build of the game with full quest flow, NPC interactions, and dialogue system

## Project Architecture
- **Frontend**: React + TypeScript + React Three Fiber
- **Backend**: Express server (serves frontend)
- **State Management**: Zustand stores (`useGame.tsx`, `useAudio.tsx`)
- **3D Engine**: @react-three/fiber with @react-three/drei helpers

### Key Files
- `client/src/App.tsx` - Main app with start screen, Canvas, HUD, and dialogue UI
- `client/src/lib/stores/useGame.tsx` - Game state: phase, quest progress, dialogue management, random disaster selection
- `client/src/components/game/Game.tsx` - Main game component with all NPCs, dialogue logic, quest flow
- `client/src/components/game/Player.tsx` - WASD movement player character with boat mode
- `client/src/components/game/NPC.tsx` - Reusable NPC component with proximity detection and E-key interaction
- `client/src/components/game/DialogueUI.tsx` - Dialogue box overlay
- `client/src/components/game/GameHUD.tsx` - Objective tracker and quest progress
- `client/src/components/game/USCStand.tsx` - USC apparel stand 3D model
- `client/src/components/game/Ground.tsx` - Grass terrain
- `client/src/components/game/Environment.tsx` - Trees, bushes, rocks, roads
- `client/src/components/game/FollowCamera.tsx` - Third-person follow camera
- `client/src/components/game/Lights.tsx` - Scene lighting
- `client/src/components/game/Sky.tsx` - Sky color and fog

### Key Files (continued)
- `client/src/components/game/WorldItem.tsx` - Pickupable items with unique IDs, consumed tracking
- `client/src/components/game/InteractionTarget.tsx` - Use-item-at-location targets with correct/wrong item handling
- `client/src/components/game/House.tsx` - House with interior, exports HOUSE_POS constant
- `client/src/components/game/PracticeBooth.tsx` - Interactive booth for programming practice quiz
- `client/src/components/game/PracticeQuizUI.tsx` - 8 multiple-choice questions on if/else-if/else branching
- `client/src/components/game/Portal.tsx` - Glowing portal ring that appears after quest + quiz completion
- `client/src/components/game/MarineEcosystem.tsx` - 3D ecosystem zones with marine animals, plants, and environmental issues
- `client/src/components/game/SurveyUI.tsx` - Survey popup for counting animals/plants and identifying environmental issues
- `client/src/components/game/OceanWorld.tsx` - Ocean World with beach, boat dock, chemical sludge patches, and cleanup quest

### Chemical Spill Cleanup Quest Flow
1. After surveying all 4 ecosystems, return to Josh
2. Josh reports emergency chemical spill -> calls startCleanupQuest
3. 8 green glowing sludge patches appear scattered across the ocean
4. Boat dock appears near the shore at [-12, 0, -2]
5. Walk to dock, press E to board cleanup boat (player transforms into boat model)
6. Boat moves on water surface at faster speed (12 vs 8)
7. Drive to sludge patches, press E near them to vacuum up
8. After all 8 cleaned, return to Josh -> congratulations dialogue
9. Quest complete

### Ocean World Quest Flow
1. Player enters Ocean World via portal
2. Talk to Josh at Beach Station -> he assigns marine survey task + calls startOceanQuest
3. 4 ecosystem zones appear: Coral Reef, Kelp Forest, Tide Pool, Seagrass Meadow
4. Walk to each ecosystem, press E to open SurveyUI
5. Count animals, count plants, identify environmental issue (trash/nets/oil_spill)
6. After all 4 surveyed, return to Josh -> congratulations dialogue
7. Talk to Josh again -> chemical spill cleanup quest begins

### Game Flow
1. Start screen -> click "Start Game"
2. Player talks to Dan at USC stand -> Dan explains disaster prep instructions for 3 types
3. Player finds Bob -> Bob reveals which random disaster is coming
4. Player reports back to Dan -> Dan gives specific prep instructions
5. ALL items from ALL disasters spawn around the house
6. Player must pick correct items and use them at correct targets
7. Using wrong items or doing wrong disaster prep = quest failure
8. Completing all correct tasks = quest success
9. Programming lesson screen shows if/else-if/else analogy to disaster prep choices
10. "Continue Playing" button unlocks the Practice Station booth
11. Player visits booth and takes 8-question quiz on branching statements (10 pts each)
12. After finishing all quiz questions, a glowing portal appears at [0, 0, -15]
13. Walking into the portal transitions to Ocean World (World 2)

### NPCs
- **Dan** (USC stand) - Quest giver, disaster prep instructions
- **Bob** (east side) - Reveals which disaster is coming (random)
- **Sara** - Hints and flavor dialogue
- **Mike** - Hints and flavor dialogue
- **Lisa** - General disaster prep education
- **Josh** (Ocean World) - Marine research boss, assigns ecosystem survey quest and chemical spill cleanup quest
