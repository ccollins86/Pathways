import type { Question } from "./PracticeQuizBase";

export const OCEAN_QUESTIONS: Question[] = [
  {
    id: 1,
    code: `let fruits = ["apple", "banana", "cherry"];

for (let fruit of fruits) {
  console.log(fruit);
}`,
    question: "How many times does console.log run?",
    options: ["1 time", "2 times", "3 times", "It runs forever"],
    correctIndex: 2,
    explanation: "The for...of loop runs once for each item in the array. Since there are 3 fruits, console.log runs exactly 3 times — once for each fruit.",
    hint: "Count how many items are in the array. The loop runs once for each item.",
  },
  {
    id: 2,
    code: `let ecosystems = ["Coral Reef", "Kelp Forest", "Tide Pool"];
let count = 0;

for (let eco of ecosystems) {
  count = count + 1;
}`,
    question: "What is the value of count after the loop?",
    options: ["0", "1", "3", "It depends on the ecosystem"],
    correctIndex: 2,
    explanation: "The loop runs once for each of the 3 ecosystems in the array. Each time, count increases by 1. So count goes from 0 \u2192 1 \u2192 2 \u2192 3.",
    hint: "Each time the loop runs, count goes up by 1. How many items does it loop over?",
  },
  {
    id: 3,
    code: `let water = 10;

while (water > 3) {
  water = water - 2;
}`,
    question: "What is the value of water after the loop?",
    options: ["1", "2", "3", "0"],
    correctIndex: 1,
    explanation: "The loop runs while water > 3. It goes: 10\u21928\u21926\u21924\u21922. When water is 2, the condition (2 > 3) is false, so the loop stops. Water is 2.",
    hint: "Trace the value of water step by step: 10, then subtract 2 each time. At what value does the condition become false?",
  },
  {
    id: 4,
    code: `let sludgePatches = 5;

while (sludgePatches > 0) {
  vacuumSludge();
  sludgePatches = sludgePatches - 1;
}`,
    question: "How many times does vacuumSludge() get called?",
    options: ["4 times", "5 times", "6 times", "It runs forever"],
    correctIndex: 1,
    explanation: "The loop starts with 5 patches and subtracts 1 each time. It runs for values 5, 4, 3, 2, 1 \u2014 that's 5 iterations. When patches reaches 0, the condition is false and the loop stops.",
    hint: "The loop starts at 5 and goes down by 1. List out each value where the condition is still true.",
  },
  {
    id: 5,
    code: `let animals = ["fish", "turtle", "crab", "seahorse"];
let total = 0;

for (let animal of animals) {
  total = total + 1;
}`,
    question: "What does total equal after the loop finishes?",
    options: ["0", "1", "4", "It never stops"],
    correctIndex: 2,
    explanation: "The for loop iterates over all 4 animals in the array. Each iteration adds 1 to total, so total ends up as 4 \u2014 one for each animal, just like counting animals at each ecosystem!",
    hint: "The loop adds 1 to total for each animal in the array. How many animals are in the array?",
  },
  {
    id: 6,
    code: `let dirty = true;
let scrubs = 0;

while (dirty) {
  scrubs = scrubs + 1;
  if (scrubs >= 3) {
    dirty = false;
  }
}`,
    question: "How many times does the while loop run?",
    options: ["0 times", "2 times", "3 times", "It runs forever"],
    correctIndex: 2,
    explanation: "The loop runs while dirty is true. After 3 scrubs, dirty becomes false and the loop stops. It runs exactly 3 times \u2014 just like cleaning until a condition changes!",
    hint: "The loop keeps running as long as dirty is true. When does dirty become false? Track the value of scrubs.",
  },
  {
    id: 7,
    code: `let zones = ["reef", "kelp", "pool"];

for (let zone of zones) {
  survey(zone);
  report(zone);
}`,
    question: "How many total function calls are made?",
    options: ["3 (one per zone)", "6 (two per zone)", "2 (survey and report)", "9"],
    correctIndex: 1,
    explanation: "The loop runs 3 times (once per zone). Each iteration calls 2 functions: survey() and report(). So 3 \u00d7 2 = 6 total function calls. This is like doing multiple tasks at each ecosystem!",
    hint: "Each time the loop runs, how many functions are called? Multiply that by the number of zones.",
  },
  {
    id: 8,
    code: `// Which loop should you use?
// Task: Process each student in a class roster

// Option A:
for (let student of roster) {
  gradeExam(student);
}

// Option B:
while (roster.length > 0) {
  gradeExam(roster.pop());
}`,
    question: "Which loop type is the best choice for this task?",
    options: [
      "For loop \u2014 you know exactly how many students",
      "While loop \u2014 you don't know when to stop",
      "Both are equally good choices",
      "Neither \u2014 you don't need a loop",
    ],
    correctIndex: 0,
    explanation: "A for loop is ideal here because you have a known collection (the roster) and want to do something for each item. While loops are better when you're waiting for a condition to change, like cleaning sludge until none remains.",
    hint: "Think about whether you know in advance how many times you need to loop. For loops are best for known collections.",
  },
];
