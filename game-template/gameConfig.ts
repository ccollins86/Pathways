export interface NPCConfig {
  name: string;
  position: [number, number, number];
  bodyColor: string;
  shirtColor: string;
  role: "quest_giver" | "info_revealer" | "hint" | "educator";
}

export interface ItemConfig {
  id: string;
  itemType: string;
  label: string;
  position: [number, number, number];
  color: string;
  shape: "box" | "cylinder" | "sphere";
  scale: [number, number, number];
  forScenario?: string;
}

export interface TaskTargetConfig {
  id: string;
  position: [number, number, number];
  label: string;
  requiredItem: string;
  completedLabel: string;
  forScenario: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface DialogueScript {
  npcName: string;
  condition: string;
  lines: DialogueLine[];
  onComplete?: string;
}

export interface ScenarioConfig {
  id: string;
  name: string;
  tasks: string[];
  description: string;
}

export interface QuizQuestion {
  id: number;
  code: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonConfig {
  title: string;
  subtitle: string;
  codeExample: string;
  explanation: string;
  footnote: string;
}

export interface GameConfig {
  title: string;
  subtitle: string;
  instructions: string;
  scenarios: ScenarioConfig[];
  npcs: NPCConfig[];
  items: ItemConfig[];
  taskTargets: TaskTargetConfig[];
  quizQuestions: QuizQuestion[];
  lesson: LessonConfig;
  questGiverName: string;
  infoRevealerName: string;
}

const EXAMPLE_CONFIG: GameConfig = {
  title: "Your Educational Game",
  subtitle: "An interactive 3D learning experience",
  instructions: "WASD / Arrow Keys to move | E to interact with NPCs",

  scenarios: [
    {
      id: "scenario_a",
      name: "Scenario A",
      tasks: ["task_a1", "task_a2"],
      description: "Complete Task A1 and Task A2.",
    },
    {
      id: "scenario_b",
      name: "Scenario B",
      tasks: ["task_b1", "task_b2"],
      description: "Complete Task B1 and Task B2.",
    },
    {
      id: "scenario_c",
      name: "Scenario C",
      tasks: ["task_c1", "task_c2"],
      description: "Complete Task C1 and Task C2.",
    },
  ],

  questGiverName: "Guide",
  infoRevealerName: "Scout",

  npcs: [
    {
      name: "Guide",
      position: [6, 0, -3.5],
      bodyColor: "#990000",
      shirtColor: "#FFC72C",
      role: "quest_giver",
    },
    {
      name: "Scout",
      position: [18, 0, -18],
      bodyColor: "#34495e",
      shirtColor: "#2196F3",
      role: "info_revealer",
    },
    {
      name: "Helper1",
      position: [8, 0, 14],
      bodyColor: "#e67e22",
      shirtColor: "#f39c12",
      role: "hint",
    },
    {
      name: "Helper2",
      position: [12, 0, 10],
      bodyColor: "#2ecc71",
      shirtColor: "#27ae60",
      role: "hint",
    },
    {
      name: "Teacher",
      position: [-5, 0, -22],
      bodyColor: "#4e342e",
      shirtColor: "#9c27b0",
      role: "educator",
    },
  ],

  items: [
    { id: "item_a1", itemType: "tool_a1", label: "Tool A1", position: [5, 0, 10], color: "#795548", shape: "box", scale: [0.6, 0.6, 0.6], forScenario: "scenario_a" },
    { id: "item_a2", itemType: "tool_a2", label: "Tool A2", position: [8, 0, 12], color: "#9e9e9e", shape: "cylinder", scale: [0.3, 0.8, 0.3], forScenario: "scenario_a" },
    { id: "item_b1", itemType: "tool_b1", label: "Tool B1", position: [-5, 0, 10], color: "#f44336", shape: "box", scale: [0.5, 0.5, 0.5], forScenario: "scenario_b" },
    { id: "item_b2", itemType: "tool_b2", label: "Tool B2", position: [-8, 0, 12], color: "#4caf50", shape: "sphere", scale: [0.4, 0.4, 0.4], forScenario: "scenario_b" },
    { id: "item_c1", itemType: "tool_c1", label: "Tool C1", position: [10, 0, -10], color: "#2196f3", shape: "box", scale: [0.6, 0.4, 0.6], forScenario: "scenario_c" },
    { id: "item_c2", itemType: "tool_c2", label: "Tool C2", position: [12, 0, -8], color: "#ff9800", shape: "cylinder", scale: [0.3, 0.6, 0.3], forScenario: "scenario_c" },
  ],

  taskTargets: [
    { id: "task_a1", position: [0, 0.1, 6], label: "Use Tool A1 here", requiredItem: "tool_a1", completedLabel: "Task A1 done!", forScenario: "scenario_a" },
    { id: "task_a2", position: [0, 0.1, -6], label: "Use Tool A2 here", requiredItem: "tool_a2", completedLabel: "Task A2 done!", forScenario: "scenario_a" },
    { id: "task_b1", position: [-7, 0.1, 0], label: "Use Tool B1 here", requiredItem: "tool_b1", completedLabel: "Task B1 done!", forScenario: "scenario_b" },
    { id: "task_b2", position: [7, 0.1, 0], label: "Use Tool B2 here", requiredItem: "tool_b2", completedLabel: "Task B2 done!", forScenario: "scenario_b" },
    { id: "task_c1", position: [-4, 0.1, -5], label: "Use Tool C1 here", requiredItem: "tool_c1", completedLabel: "Task C1 done!", forScenario: "scenario_c" },
    { id: "task_c2", position: [4, 0.1, -5], label: "Use Tool C2 here", requiredItem: "tool_c2", completedLabel: "Task C2 done!", forScenario: "scenario_c" },
  ],

  lesson: {
    title: "Programming Concept: Branching",
    subtitle: "Just like choosing the right approach, code uses if/else to make decisions!",
    codeExample: `if (condition_a) {
  doActionA();
} else if (condition_b) {
  doActionB();
} else {
  doDefaultAction();
}`,
    explanation: "Each branch runs only when its condition is true. The first match wins!",
    footnote: "Only one branch executes — the first one whose condition is true.",
  },

  quizQuestions: [
    {
      id: 1,
      code: `let x = 5;\n\nif (x > 10) {\n  result = "big";\n} else if (x > 3) {\n  result = "medium";\n} else {\n  result = "small";\n}`,
      question: "What is result?",
      options: ['"big"', '"medium"', '"small"', 'undefined'],
      correctIndex: 1,
      explanation: 'x is 5. Not > 10, but > 3, so result is "medium".',
    },
    {
      id: 2,
      code: `let color = "red";\n\nif (color === "blue") {\n  mood = "calm";\n} else if (color === "red") {\n  mood = "energetic";\n} else {\n  mood = "neutral";\n}`,
      question: "What is mood?",
      options: ['"calm"', '"energetic"', '"neutral"', 'All three'],
      correctIndex: 1,
      explanation: 'color is "red", matching the else-if, so mood is "energetic".',
    },
  ],
};

export default EXAMPLE_CONFIG;
