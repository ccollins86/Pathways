import type { Question } from "@/components/game/PracticeQuizBase";

export const FALLBACK_CONDITIONALS: Question[] = [
  {
    id: 1,
    code: `let weather = "rainy";\n\nif (weather === "sunny") {\n  goToBeach();\n} else if (weather === "rainy") {\n  bringUmbrella();\n} else {\n  stayHome();\n}`,
    question: "Which function gets called?",
    options: ["goToBeach()", "bringUmbrella()", "stayHome()", "All three"],
    correctIndex: 1,
    explanation: 'Since weather is "rainy", the else-if condition is true, so bringUmbrella() runs. The other branches are skipped.',
    hint: "Look at the value of weather and check which condition matches it exactly.",
  },
  {
    id: 2,
    code: `let temperature = 95;\n\nif (temperature > 100) {\n  alert("Extreme heat!");\n} else if (temperature > 80) {\n  alert("It is hot!");\n} else {\n  alert("Nice weather!");\n}`,
    question: "What alert message appears?",
    options: ['"Extreme heat!"', '"It is hot!"', '"Nice weather!"', "No alert appears"],
    correctIndex: 1,
    explanation: '95 is not greater than 100, so the first condition is false. But 95 is greater than 80, so the else-if runs and shows "It is hot!"',
    hint: "Check each condition from top to bottom. Is 95 greater than 100? If not, move to the next condition.",
  },
  {
    id: 3,
    code: `let score = 45;\n\nif (score >= 90) {\n  grade = "A";\n} else if (score >= 70) {\n  grade = "B";\n} else if (score >= 50) {\n  grade = "C";\n} else {\n  grade = "F";\n}`,
    question: "What grade is assigned?",
    options: ["A", "B", "C", "F"],
    correctIndex: 3,
    explanation: 'Score is 45. It is not >= 90, not >= 70, and not >= 50. None of the if/else-if conditions are true, so the else block runs and grade becomes "F".',
    hint: "Test whether 45 passes any of the three conditions. What happens when none of them are true?",
  },
  {
    id: 4,
    code: `let animal = "cat";\n\nif (animal === "dog") {\n  sound = "Woof!";\n} else if (animal === "cat") {\n  sound = "Meow!";\n} else if (animal === "bird") {\n  sound = "Tweet!";\n}`,
    question: "What is the value of sound?",
    options: ['"Woof!"', '"Meow!"', '"Tweet!"', '"Woof!" and "Meow!"'],
    correctIndex: 1,
    explanation: 'The variable animal is "cat", which matches the second condition. Only "Meow!" is assigned — the computer stops checking after finding the first true condition.',
    hint: 'Remember: the computer checks conditions one at a time and stops at the first match. Which condition does "cat" match?',
  },
  {
    id: 5,
    code: `let hour = 14;\n\nif (hour < 12) {\n  greeting = "Good morning!";\n} else if (hour < 17) {\n  greeting = "Good afternoon!";\n} else {\n  greeting = "Good evening!";\n}`,
    question: "What greeting is set?",
    options: ['"Good morning!"', '"Good afternoon!"', '"Good evening!"', "None of them"],
    correctIndex: 1,
    explanation: 'Hour is 14. It is not less than 12, so the first condition is false. But 14 is less than 17, so the else-if runs and greeting becomes "Good afternoon!"',
    hint: "Is 14 less than 12? If not, check the next condition: is 14 less than 17?",
  },
  {
    id: 6,
    code: `let fruit = "apple";\n\nif (fruit === "banana") {\n  color = "yellow";\n} else if (fruit === "apple") {\n  color = "red";\n} else if (fruit === "apple") {\n  color = "green";\n}`,
    question: 'There are two conditions checking for "apple". What is color?',
    options: ['"yellow"', '"red"', '"green"', '"red" and "green"'],
    correctIndex: 1,
    explanation: 'Even though both else-if conditions check for "apple", only the FIRST matching branch executes. Once "red" is assigned, the rest are skipped entirely.',
    hint: "When multiple conditions could be true, think about which one the computer reaches first. Does it keep going after finding a match?",
  },
  {
    id: 7,
    code: `let age = 25;\n\nif (age < 13) {\n  category = "child";\n} else if (age < 20) {\n  category = "teenager";\n} else if (age < 65) {\n  category = "adult";\n} else {\n  category = "senior";\n}`,
    question: "What category is assigned?",
    options: ['"child"', '"teenager"', '"adult"', '"senior"'],
    correctIndex: 2,
    explanation: 'Age is 25. Not less than 13, not less than 20, but IS less than 65. So the third condition is the first true one, and category becomes "adult".',
    hint: "Check each condition with the value 25. Which is the first one that evaluates to true?",
  },
  {
    id: 8,
    code: `let day = "Saturday";\n\nif (day === "Monday") {\n  plan = "Work";\n} else if (day === "Saturday" || day === "Sunday") {\n  plan = "Relax";\n} else {\n  plan = "Work";\n}`,
    question: "What is plan set to?",
    options: ['"Work" (from the if)', '"Relax"', '"Work" (from the else)', "Nothing"],
    correctIndex: 1,
    explanation: '"Saturday" does not match "Monday", but the else-if checks if day is "Saturday" OR "Sunday". Since it is "Saturday", the condition is true and plan becomes "Relax".',
    hint: 'Pay attention to the || (OR) operator. Does "Saturday" satisfy either side of that condition?',
  },
];

export const FALLBACK_LOOPS: Question[] = [
  {
    id: 1,
    code: `let fruits = ["apple", "banana", "cherry"];\n\nfor (let fruit of fruits) {\n  console.log(fruit);\n}`,
    question: "How many times does console.log run?",
    options: ["1 time", "2 times", "3 times", "It runs forever"],
    correctIndex: 2,
    explanation: "The for...of loop runs once for each item in the array. Since there are 3 fruits, console.log runs exactly 3 times — once for each fruit.",
    hint: "Count how many items are in the array. The loop runs once for each item.",
  },
  {
    id: 2,
    code: `let ecosystems = ["Coral Reef", "Kelp Forest", "Tide Pool"];\nlet count = 0;\n\nfor (let eco of ecosystems) {\n  count = count + 1;\n}`,
    question: "What is the value of count after the loop?",
    options: ["0", "1", "3", "It depends on the ecosystem"],
    correctIndex: 2,
    explanation: "The loop runs once for each of the 3 ecosystems in the array. Each time, count increases by 1. So count goes from 0 to 1 to 2 to 3.",
    hint: "Each time the loop runs, count goes up by 1. How many items does it loop over?",
  },
  {
    id: 3,
    code: `let water = 10;\n\nwhile (water > 3) {\n  water = water - 2;\n}`,
    question: "What is the value of water after the loop?",
    options: ["1", "2", "3", "0"],
    correctIndex: 1,
    explanation: "The loop runs while water > 3. It goes: 10, 8, 6, 4, 2. When water is 2, the condition (2 > 3) is false, so the loop stops. Water is 2.",
    hint: "Trace the value of water step by step: 10, then subtract 2 each time. At what value does the condition become false?",
  },
  {
    id: 4,
    code: `let sludgePatches = 5;\n\nwhile (sludgePatches > 0) {\n  vacuumSludge();\n  sludgePatches = sludgePatches - 1;\n}`,
    question: "How many times does vacuumSludge() get called?",
    options: ["4 times", "5 times", "6 times", "It runs forever"],
    correctIndex: 1,
    explanation: "The loop starts with 5 patches and subtracts 1 each time. It runs for values 5, 4, 3, 2, 1 — that is 5 iterations. When patches reaches 0, the condition is false and the loop stops.",
    hint: "The loop starts at 5 and goes down by 1. List out each value where the condition is still true.",
  },
  {
    id: 5,
    code: `let animals = ["fish", "turtle", "crab", "seahorse"];\nlet total = 0;\n\nfor (let animal of animals) {\n  total = total + 1;\n}`,
    question: "What does total equal after the loop finishes?",
    options: ["0", "1", "4", "It never stops"],
    correctIndex: 2,
    explanation: "The for loop iterates over all 4 animals in the array. Each iteration adds 1 to total, so total ends up as 4 — one for each animal!",
    hint: "The loop adds 1 to total for each animal in the array. How many animals are in the array?",
  },
  {
    id: 6,
    code: `let dirty = true;\nlet scrubs = 0;\n\nwhile (dirty) {\n  scrubs = scrubs + 1;\n  if (scrubs >= 3) {\n    dirty = false;\n  }\n}`,
    question: "How many times does the while loop run?",
    options: ["0 times", "2 times", "3 times", "It runs forever"],
    correctIndex: 2,
    explanation: "The loop runs while dirty is true. After 3 scrubs, dirty becomes false and the loop stops. It runs exactly 3 times — just like cleaning until a condition changes!",
    hint: "The loop keeps running as long as dirty is true. When does dirty become false? Track the value of scrubs.",
  },
  {
    id: 7,
    code: `let zones = ["reef", "kelp", "pool"];\n\nfor (let zone of zones) {\n  survey(zone);\n  report(zone);\n}`,
    question: "How many total function calls are made?",
    options: ["3 (one per zone)", "6 (two per zone)", "2 (survey and report)", "9"],
    correctIndex: 1,
    explanation: "The loop runs 3 times (once per zone). Each iteration calls 2 functions: survey() and report(). So 3 x 2 = 6 total function calls.",
    hint: "Each time the loop runs, how many functions are called? Multiply that by the number of zones.",
  },
  {
    id: 8,
    code: `// Which loop should you use?\n// Task: Process each student in a class roster\n\n// Option A:\nfor (let student of roster) {\n  gradeExam(student);\n}\n\n// Option B:\nwhile (roster.length > 0) {\n  gradeExam(roster.pop());\n}`,
    question: "Which loop type is the best choice for this task?",
    options: [
      "For loop — you know exactly how many students",
      "While loop — you don't know when to stop",
      "Both are equally good choices",
      "Neither — you don't need a loop",
    ],
    correctIndex: 0,
    explanation: "A for loop is ideal here because you have a known collection (the roster) and want to do something for each item. While loops are better when you are waiting for a condition to change.",
    hint: "Think about whether you know in advance how many times you need to loop. For loops are best for known collections.",
  },
];

export const FALLBACK_FUNCTIONS: Question[] = [
  {
    id: 1,
    code: `function makeHat(size, topColor, brimColor, lettering) {\n  // assemble the hat with specified parts\n  return finishedHat;\n}\n\nlet myHat = makeHat("large", "white", "green", "Italy");`,
    question: "What are the PARAMETERS of the makeHat function?",
    options: [
      '"large", "white", "green", "Italy"',
      "size, topColor, brimColor, lettering",
      "finishedHat",
      "myHat",
    ],
    correctIndex: 1,
    explanation: 'Parameters are the variable names listed in the function definition (size, topColor, brimColor, lettering). The actual values like "large" and "white" are called arguments.',
    hint: "Parameters are the names in the function definition. Arguments are the values you pass when calling the function.",
  },
  {
    id: 2,
    code: `function makeTshirt(quantity, size, sleeveColor, bodyColor) {\n  let shirts = [];\n  for (let i = 0; i < quantity; i++) {\n    shirts.push(assembleShirt(size, sleeveColor, bodyColor));\n  }\n  return shirts;\n}\n\nlet order = makeTshirt(3, "medium", "red", "blue");`,
    question: "How many shirts will be in the 'order' array?",
    options: ["1", "2", "3", "It depends"],
    correctIndex: 2,
    explanation: "The function creates a shirt for each iteration of the loop. Since quantity is 3, the loop runs 3 times, pushing 3 shirts into the array.",
    hint: "Look at the first argument passed to makeTshirt. That controls how many times the loop runs.",
  },
  {
    id: 3,
    code: `function calculateCost(itemType, quantity) {\n  let pricePerItem;\n  if (itemType === "hat") {\n    pricePerItem = 15;\n  } else if (itemType === "tshirt") {\n    pricePerItem = 25;\n  } else if (itemType === "jacket") {\n    pricePerItem = 50;\n  }\n  return pricePerItem * quantity;\n}`,
    question: 'What does calculateCost("jacket", 5) return?',
    options: ["15", "25", "50", "250"],
    correctIndex: 3,
    explanation: 'Since itemType is "jacket", pricePerItem is set to 50. Then the function returns 50 x 5 = 250.',
    hint: "First figure out what pricePerItem becomes, then multiply it by the quantity.",
  },
  {
    id: 4,
    code: `function makeJacket(sleeveColor, bodyColor, letteringColor, text) {\n  let jacket = createBlankJacket();\n  colorSleeves(jacket, sleeveColor);\n  colorBody(jacket, bodyColor);\n  addLettering(jacket, text, letteringColor);\n  return jacket;\n}`,
    question: "What does this function RETURN?",
    options: [
      "The sleeve color",
      "A finished jacket with all customizations applied",
      "Nothing — it has no return statement",
      "The text for the lettering",
    ],
    correctIndex: 1,
    explanation: "The function creates a blank jacket, applies customizations step by step, and returns the finished product.",
    hint: "Look at what the return statement gives back. What has happened to that variable by that point?",
  },
  {
    id: 5,
    code: `function fulfillOrder(hatOrder, shirtOrder, jacketOrder) {\n  let hats = makeHat(hatOrder);\n  let shirts = makeTshirt(shirtOrder);\n  let jackets = makeJacket(jacketOrder);\n  \n  let box = packItems(hats, shirts, jackets);\n  return box;\n}`,
    question: "How many other functions does fulfillOrder call?",
    options: ["1", "3", "4", "5"],
    correctIndex: 2,
    explanation: "fulfillOrder calls 4 functions: makeHat(), makeTshirt(), makeJacket(), and packItems(). Functions can call other functions!",
    hint: "Count each function call inside fulfillOrder. Remember packItems is also a function call.",
  },
  {
    id: 6,
    code: `function greet(name) {\n  return "Hello, " + name + "!";\n}\n\nlet message1 = greet("Italy");\nlet message2 = greet("USA");\nlet message3 = greet("Germany");`,
    question: "What is the value of message2?",
    options: ['"Hello, Italy!"', '"Hello, USA!"', '"Hello, Germany!"', '"Hello, name!"'],
    correctIndex: 1,
    explanation: 'When greet("USA") is called, the parameter name gets the value "USA". The function returns "Hello, " + "USA" + "!" which is "Hello, USA!". Same function, different input, different output!',
    hint: "Look at which argument is passed in the greet() call assigned to message2.",
  },
  {
    id: 7,
    code: `function processOrder(type, qty) {\n  if (qty <= 0) {\n    return "Invalid order!";\n  }\n  \n  let items = produce(type, qty);\n  let box = pack(items);\n  ship(box);\n  return "Order shipped!";\n}`,
    question: 'What happens if you call processOrder("hat", 0)?',
    options: [
      'It returns "Order shipped!"',
      "It produces 0 hats and ships an empty box",
      'It returns "Invalid order!" without producing anything',
      "It crashes with an error",
    ],
    correctIndex: 2,
    explanation: 'Since qty is 0, the condition (qty <= 0) is true, so the function returns "Invalid order!" immediately. The return statement exits the function right away — produce, pack, and ship never run. This is called an early return!',
    hint: "When a return statement runs, the function exits immediately. Does the first condition catch qty = 0?",
  },
  {
    id: 8,
    code: `// Function definition:\nfunction makeHat(quantity, size, topColor, brimColor, lettering) {\n  // ... makes hats ...\n  return hats;\n}`,
    question: "Which call correctly orders 2 large hats with white top, green brim, labeled 'Italy'?",
    options: [
      'makeHat(2, "large", "white", "green", "Italy")',
      'makeHat("large", 2, "white", "green", "Italy")',
      'makeHat(2, "large", "green", "white", "Italy")',
      'makeHat("Italy", "white", "green", "large", 2)',
    ],
    correctIndex: 0,
    explanation: "The order of arguments must match the order of parameters in the function definition: quantity first (2), then size, then topColor, brimColor, and lettering.",
    hint: "Match each argument to its parameter position. The first parameter is quantity, the second is size, etc.",
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getFallbackQuestions(topic: "conditionals" | "loops" | "functions"): Question[] {
  const pool = topic === "conditionals" ? FALLBACK_CONDITIONALS
    : topic === "loops" ? FALLBACK_LOOPS
    : FALLBACK_FUNCTIONS;
  return shuffleArray(pool).slice(0, 8).map((q, i) => ({ ...q, id: i + 1 }));
}
