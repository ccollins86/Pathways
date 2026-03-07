# Disaster Prep Quest - 3D Educational Game

## Overview
A 3D educational game built with React Three Fiber where players learn about natural disaster preparedness. Players navigate a town, talk to NPCs, and learn how to prepare for hurricanes, wildfires, and earthquakes.

## Testing
- **Framework**: Vitest (configured in `vitest.config.ts`)
- **Run tests**: `npx vitest run`
- **Watch mode**: `npx vitest`
- **Test files**: `client/src/lib/stores/useGame.test.ts` (125 tests covering game store logic)
- **Coverage**: Phase transitions, disaster selection, NPC interactions, dialogue system, inventory, quest completion (all 3 disaster types), quest failure, practice quizzes, world transitions, ocean/cleanup quests, factory order validation, product workflow, lesson phases, and full restart reset

## Recent Changes
- 2026-03-07: Added lesson quiz - 3 questions after main quest programming lesson (same style as practice: must answer correctly, expandable hint, explanation on correct); "View Lesson" toggle during quiz preserves progress; quiz completion required before "Continue Playing"
- 2026-03-07: Practice quiz improvements - players must answer correctly before advancing to next question; hints hidden until wrong answer, then expandable (not the answer); explanation only shown on correct answer; applied to all 3 quizzes (PracticeQuizUI, OceanPracticeQuizUI, FactoryPracticeQuizUI)
- 2026-03-07: Quest failure no longer restarts game - retryQuest function resets task state/items, respawns player near house; quest progress (NPC conversations, disaster knowledge) preserved
- 2026-03-05: Added Factory World functions lesson + practice quiz - FactoryLessonUI (2-page overlay: page 1 explains functions as machines with parameters/return values, page 2 shows full order as 3 function calls); FactoryPracticeBooth at [-15,0,20] (unlocks after lesson, glowing booth with E-key interaction); FactoryPracticeQuizUI (8 questions on functions); World3HUD hides during lesson/quiz; factoryLessonPhase state (0=none, 1=intro, 2=grouping)
- 2026-03-05: Added Olympic Village order fulfillment to Factory World - George assigns order (2 large hats, 3 medium t-shirts, 5 large jackets) with specific colors/lettering; MachineSettingsUI popup (quantity stepper, size dropdown, color dropdowns, lettering text input); machines produce output boxes (bobbing/highlighted); player picks up products, boxes at PackingTable, loads onto ShippingTruck (UPS-style with open back); per-machine state tracking (idle→produced→picked_up→boxed→loaded); World3HUD shows detailed order progress; carrying indicator overlay
- 2026-03-05: Added Factory World (World 3) - manufacturing plant with NPC George (floor manager), 3 labeled machines (Hat Maker, T-Shirt Maker, Jacket Maker) with animated arms/conveyor belts/product displays, factory environment (walls, ceiling, windows, beams, light fixtures, barrels, crates, forklifts, safety signs, control room, floor markings); portal appears in Ocean World after completing practice quiz; World 3 dialogue system (world3Dialogue), World3HUD, World3DialogueUI; GameWorld type extended to "factory"
- 2026-02-27: Added Ocean Practice Station - 3D booth in OceanWorld at [-8,0,14], unlocked after lessons complete (oceanLessonPhase=3), 8 quiz questions on for/while loops, confetti + success.mp3 on correct answers, score tracking (10 pts each), OceanPracticeQuizUI component, store state (oceanPracticeUnlocked/Active/Score/Completed)
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

### Factory World (World 3) Flow
1. After completing ocean practice quiz, a portal appears in Ocean World at [0, 0, 10]
2. Walking into the portal transitions to Factory World
3. Talk to George (floor manager) -> he assigns the Olympic Village order
4. Order: 2 large hats (white top, green brim, red "Italy"), 3 medium t-shirts (red sleeves, blue body, white "USA"), 5 large jackets (black sleeves, red body, yellow "Germany")
5. Press E near each machine -> MachineSettingsUI popup with quantity, size, color, lettering fields
6. Submit order -> products appear at conveyor output end (bobbing/highlighted boxes)
7. Press E near output -> pick up products (carryingProduct state)
8. Walk to packing table [0,0,10] -> press E to box products (carryingBox state)
9. Walk to shipping truck [20,0,25] -> press E to load box onto truck
10. Repeat for all 3 product types -> factoryOrderComplete when all loaded

### Key Files (World 3)
- `client/src/components/game/FactoryWorld.tsx` - Factory World with walls, ceiling, machines, George NPC, product pickup, packing table, shipping truck, factory decor
- `client/src/components/game/MachineSettingsUI.tsx` - Machine configuration popup (quantity stepper, size dropdown, color dropdowns, lettering text input)

### NPCs
- **Dan** (USC stand) - Quest giver, disaster prep instructions
- **Bob** (east side) - Reveals which disaster is coming (random)
- **Sara** - Hints and flavor dialogue
- **Mike** - Hints and flavor dialogue
- **Lisa** - General disaster prep education
- **Josh** (Ocean World) - Marine research boss, assigns ecosystem survey quest and chemical spill cleanup quest
- **George** (Factory World) - Floor manager, introduces the manufacturing plant and machines
