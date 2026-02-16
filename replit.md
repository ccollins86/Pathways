# Disaster Prep Quest - 3D Educational Game

## Overview
A 3D educational game built with React Three Fiber where players learn about natural disaster preparedness. Players navigate a town, talk to NPCs, and learn how to prepare for hurricanes, wildfires, and earthquakes.

## Recent Changes
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
- `client/src/components/game/Player.tsx` - WASD movement player character
- `client/src/components/game/NPC.tsx` - Reusable NPC component with proximity detection and E-key interaction
- `client/src/components/game/DialogueUI.tsx` - Dialogue box overlay
- `client/src/components/game/GameHUD.tsx` - Objective tracker and quest progress
- `client/src/components/game/USCStand.tsx` - USC apparel stand 3D model
- `client/src/components/game/Ground.tsx` - Grass terrain
- `client/src/components/game/Environment.tsx` - Trees, bushes, rocks, roads
- `client/src/components/game/FollowCamera.tsx` - Third-person follow camera
- `client/src/components/game/Lights.tsx` - Scene lighting
- `client/src/components/game/Sky.tsx` - Sky color and fog

### Game Flow
1. Start screen -> click "Start Game"
2. Player talks to Dan at USC stand -> Dan explains disaster prep instructions for 3 types
3. Player finds Bob -> Bob reveals which random disaster is coming
4. Player reports back to Dan -> Dan gives specific prep instructions

### NPCs
- **Dan** (USC stand) - Quest giver, disaster prep instructions
- **Bob** (east side) - Reveals which disaster is coming (random)
- **Sara** - Hints and flavor dialogue
- **Mike** - Hints and flavor dialogue
- **Lisa** - General disaster prep education
