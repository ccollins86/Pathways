# Game Template - Build Your Own 3D Educational Game

This template lets you create a new 3D educational game with the same structure as Disaster Prep Quest. Everything is driven by a single configuration file — just edit `gameConfig.ts` to create a completely different educational experience.

## How to Use This Template

### 1. Copy the Template
Copy the entire `game-template/` directory into a new project's `client/src/` folder (replacing the existing source files).

### 2. Edit `gameConfig.ts`
This is the **only file you need to change** to create a new game. It controls:

#### Game Identity
- `title` — The game's title shown on the start screen
- `subtitle` — Description shown on the start screen
- `instructions` — Control hints shown on the start screen

#### Scenarios (like "disasters" in the original)
Define 2-5 scenarios. One is randomly selected each playthrough:
```ts
scenarios: [
  {
    id: "scenario_a",        // Unique ID
    name: "Scenario A",       // Display name
    tasks: ["task_a1", "task_a2"],  // Which task IDs belong to this scenario
    description: "Do X and Y.",     // Instructions shown to the player
  },
]
```

#### NPCs
Define characters with specific roles:
- `quest_giver` — Starts the quest, gives instructions (exactly 1)
- `info_revealer` — Tells the player which scenario is active (exactly 1)
- `hint` — Gives helpful hints based on quest progress (any number)
- `educator` — Shares general educational info (any number)

```ts
npcs: [
  {
    name: "Guide",
    position: [6, 0, -3.5],      // [x, y, z] in the 3D world
    bodyColor: "#990000",
    shirtColor: "#FFC72C",
    role: "quest_giver",
  },
]
```

#### Items
Objects the player picks up. All items from all scenarios spawn — only the right ones should be used:
```ts
items: [
  {
    id: "item_a1",             // Unique ID
    itemType: "tool_a1",       // Type name (used to match with task targets)
    label: "Tool A1",          // Display name
    position: [5, 0, 10],
    color: "#795548",
    shape: "box",              // "box", "cylinder", or "sphere"
    scale: [0.6, 0.6, 0.6],
    forScenario: "scenario_a", // Which scenario this item is for
  },
]
```

#### Task Targets
Locations where items are used. Using the wrong item = quest failure:
```ts
taskTargets: [
  {
    id: "task_a1",                  // Must match a task ID in a scenario
    position: [0, 0.1, 6],
    label: "Use Tool A1 here",
    requiredItem: "tool_a1",        // Must match an item's itemType
    completedLabel: "Task A1 done!",
    forScenario: "scenario_a",
  },
]
```

#### Programming Lesson
Shown after quest completion. Teaches a programming concept:
```ts
lesson: {
  title: "Programming Concept: Branching",
  subtitle: "Just like choosing the right approach...",
  codeExample: `if (condition) { ... }`,
  explanation: "Each branch runs only when its condition is true.",
  footnote: "Only one branch executes.",
}
```

#### Quiz Questions
Practice questions shown at the Practice Station booth:
```ts
quizQuestions: [
  {
    id: 1,
    code: `let x = 5;\nif (x > 10) { ... }`,
    question: "What is result?",
    options: ['"big"', '"medium"', '"small"', 'undefined'],
    correctIndex: 1,
    explanation: 'x is 5, so result is "medium".',
  },
]
```

### 3. Set Names
Make sure these match your NPC names:
```ts
questGiverName: "Guide",      // Must match the quest_giver NPC's name
infoRevealerName: "Scout",    // Must match the info_revealer NPC's name
```

## Game Flow (Automatic)
1. Start screen with your title/subtitle
2. Player talks to quest giver NPC
3. Player finds info revealer NPC (learns which scenario)
4. Player reports back to quest giver
5. All items from all scenarios spawn
6. Player picks correct items, uses them at correct targets
7. Wrong item or wrong scenario task = quest failure
8. All correct tasks done = quest complete
9. Programming lesson screen
10. "Continue Playing" unlocks Practice Station
11. Player takes quiz at booth (10 points per correct answer)

## Reusable Components (No Changes Needed)
- `Player.tsx` — WASD movement
- `NPC.tsx` — Proximity detection + E-key interaction
- `WorldItem.tsx` — Pickupable items
- `InteractionTarget.tsx` — Use-item-at-location targets
- `DialogueUI.tsx` — Dialogue box overlay
- `PracticeBooth.tsx` — Interactive quiz booth
- `House.tsx`, `Ground.tsx`, `Environment.tsx`, `Sky.tsx`, `Lights.tsx` — World visuals

## Tips
- Keep NPC positions spread apart (at least 8-10 units between them)
- Place items near the house (positions relative to HOUSE_POS work well)
- Put task targets around the house perimeter
- The Practice Booth is at [20, 0, 8] — change its position in Game.tsx if needed
