import type { Question } from "./PracticeQuizBase";

export const PSYCHIC_QUESTIONS: Question[] = [
  {
    id: 1,
    code: `// Searching for the number 73 in range 1-100
// Using binary search:
let min = 1, max = 100;
let guess = Math.floor((min + max) / 2); // guess = ?`,
    question: "What is the first guess when using binary search on the range 1-100?",
    options: ["1", "25", "50", "100"],
    correctIndex: 2,
    explanation:
      "Binary search always starts with the middle of the range. Math.floor((1 + 100) / 2) = Math.floor(50.5) = 50. Starting in the middle eliminates half the possibilities with every guess!",
    hint: "Binary search always starts in the middle. What's the midpoint of 1 and 100?",
  },
  {
    id: 2,
    code: `// Binary search: target is GREATER than 50
// Before: min = 1, max = 100, guess = 50
// Update: min = guess + 1 = 51
// New guess = Math.floor((51 + 100) / 2) = ?`,
    question: "If the first guess of 50 is too LOW, what should the next guess be?",
    options: ["51", "75", "76", "100"],
    correctIndex: 1,
    explanation:
      "Since 50 was too low, the target must be between 51 and 100. The new guess is Math.floor((51 + 100) / 2) = Math.floor(75.5) = 75. We just eliminated half the remaining numbers!",
    hint: "When the guess is too low, we update the minimum. Then find the new midpoint between the updated min and max.",
  },
  {
    id: 3,
    code: `// Binary search: target is LESS than 50
// Before: min = 1, max = 100, guess = 50
// Update: max = guess - 1 = 49
// New guess = Math.floor((1 + 49) / 2) = ?`,
    question: "If the first guess of 50 is too HIGH, what should the next guess be?",
    options: ["1", "24", "25", "49"],
    correctIndex: 2,
    explanation:
      "Since 50 was too high, the target must be between 1 and 49. The new guess is Math.floor((1 + 49) / 2) = Math.floor(25) = 25. Again, we cut the search space in half!",
    hint: "When the guess is too high, we update the maximum. Then find the new midpoint between min and the updated max.",
  },
  {
    id: 4,
    code: `// Worst case scenarios for finding a number 1-100:
// Random search: up to ??? guesses
// Linear search: up to ??? guesses
// Binary search: up to ??? guesses`,
    question: "In the WORST case, how many guesses does binary search need to find a number between 1 and 100?",
    options: ["7", "10", "50", "100"],
    correctIndex: 0,
    explanation:
      "Binary search cuts the range in half each time: 100 → 50 → 25 → 13 → 7 → 4 → 2 → 1. That's only 7 steps! This is called O(log n) — logarithmic time. Compare that to linear search which could take up to 100 guesses!",
    hint: "Think about how many times you can divide 100 in half before reaching 1. Count the steps.",
  },
  {
    id: 5,
    code: `function binarySearch(arr, target) {
  let min = 0, max = arr.length - 1;
  while (min <= max) {
    let mid = Math.floor((min + max) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) min = mid + 1;
    else max = mid - 1;
  }
  return -1; // not found
}`,
    question: "What does binary search return if the target is NOT in the array?",
    options: ["0", "null", "-1", "undefined"],
    correctIndex: 2,
    explanation:
      "When min exceeds max, the while loop ends and the function returns -1, which is the conventional way to indicate 'not found' in search algorithms. The loop condition (min <= max) guarantees we stop when there's nothing left to search.",
    hint: "Look at the very last line of the function — what gets returned if the while loop finishes without finding the target?",
  },
  {
    id: 6,
    code: `// Searching a sorted list of 1,000,000 names
// Linear search: check one by one from the start
// Binary search: divide in half each time

// Linear: worst case = 1,000,000 checks
// Binary: worst case = ??? checks`,
    question: "How many guesses would binary search need at MOST to search through 1,000,000 sorted items?",
    options: ["100", "1,000", "20", "500,000"],
    correctIndex: 2,
    explanation:
      "Binary search needs at most log₂(1,000,000) ≈ 20 guesses! Each guess halves the search space: 1M → 500K → 250K → ... → 1. That's the power of logarithmic time — even a million items only needs about 20 steps!",
    hint: "Each guess cuts the possibilities in half. How many times do you need to halve 1,000,000 to reach 1?",
  },
  {
    id: 7,
    code: `let numbers = [3, 7, 11, 15, 22, 34, 50, 68, 91];
// Can we use binary search on this array?

let words = ["banana", "grape", "apple", "cherry"];
// Can we use binary search on this array?`,
    question: "Binary search requires one important condition. Which array can we use it on?",
    options: [
      "Both arrays",
      "Only the numbers array (it's sorted)",
      "Only the words array (it has strings)",
      "Neither array",
    ],
    correctIndex: 1,
    explanation:
      "Binary search only works on SORTED data! The numbers array [3, 7, 11, 15, 22, 34, 50, 68, 91] is in order, so binary search works. The words array is NOT sorted alphabetically (apple should come before banana), so binary search would give wrong results.",
    hint: "Binary search relies on one key property of the data. Look at whether each array's elements are in order.",
  },
  {
    id: 8,
    code: `// Binary search steps to find 73:
// Step 1: guess 50 → "Greater" → min=51, max=100
// Step 2: guess 75 → "Less"    → min=51, max=74
// Step 3: guess 62 → "Greater" → min=63, max=74
// Step 4: guess 68 → "Greater" → min=69, max=74
// Step 5: guess 71 → "Greater" → min=72, max=74
// Step 6: guess 73 → "Correct!"`,
    question: "How many guesses did binary search need to find 73 out of 100 numbers?",
    options: ["4", "5", "6", "7"],
    correctIndex: 2,
    explanation:
      "It took exactly 6 guesses to find 73. Each guess narrowed the range: 100 → 50 → 24 → 12 → 6 → 3 → found! That's way better than random guessing (could take up to 100) or linear search (would take 73 if starting from 1).",
    hint: "Count each step listed in the code. Each 'guess' line is one guess attempt.",
  },
];
