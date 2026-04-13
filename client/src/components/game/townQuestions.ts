import type { Question } from "./PracticeQuizBase";

export const TOWN_QUESTIONS: Question[] = [
  {
    id: 1,
    code: `let weather = "rainy";

if (weather === "sunny") {
  goToBeach();
} else if (weather === "rainy") {
  bringUmbrella();
} else {
  stayHome();
}`,
    question: "Which function gets called?",
    options: ["goToBeach()", "bringUmbrella()", "stayHome()", "All three"],
    correctIndex: 1,
    explanation: 'Since weather is "rainy", the else-if condition is true, so bringUmbrella() runs. The other branches are skipped.',
    hint: "Look at the value of weather and check which condition matches it exactly.",
  },
  {
    id: 2,
    code: `let temperature = 95;

if (temperature > 100) {
  alert("Extreme heat!");
} else if (temperature > 80) {
  alert("It's hot!");
} else {
  alert("Nice weather!");
}`,
    question: "What alert message appears?",
    options: ['"Extreme heat!"', '"It\'s hot!"', '"Nice weather!"', "No alert appears"],
    correctIndex: 1,
    explanation: "95 is not greater than 100, so the first condition is false. But 95 is greater than 80, so the else-if runs and shows \"It's hot!\"",
    hint: "Check each condition from top to bottom. Is 95 greater than 100? If not, move to the next condition.",
  },
  {
    id: 3,
    code: `let score = 45;

if (score >= 90) {
  grade = "A";
} else if (score >= 70) {
  grade = "B";
} else if (score >= 50) {
  grade = "C";
} else {
  grade = "F";
}`,
    question: "What grade is assigned?",
    options: ["A", "B", "C", "F"],
    correctIndex: 3,
    explanation: "Score is 45. It's not >= 90, not >= 70, and not >= 50. None of the if/else-if conditions are true, so the else block runs and grade becomes \"F\".",
    hint: "Test whether 45 passes any of the three conditions. What happens when none of them are true?",
  },
  {
    id: 4,
    code: `let animal = "cat";

if (animal === "dog") {
  sound = "Woof!";
} else if (animal === "cat") {
  sound = "Meow!";
} else if (animal === "bird") {
  sound = "Tweet!";
}`,
    question: "What is the value of sound?",
    options: ['"Woof!"', '"Meow!"', '"Tweet!"', '"Woof!" and "Meow!"'],
    correctIndex: 1,
    explanation: 'The variable animal is "cat", which matches the second condition. Only "Meow!" is assigned — the computer stops checking after finding the first true condition.',
    hint: 'Remember: the computer checks conditions one at a time and stops at the first match. Which condition does "cat" match?',
  },
  {
    id: 5,
    code: `let hour = 14;

if (hour < 12) {
  greeting = "Good morning!";
} else if (hour < 17) {
  greeting = "Good afternoon!";
} else {
  greeting = "Good evening!";
}`,
    question: "What greeting is set?",
    options: ['"Good morning!"', '"Good afternoon!"', '"Good evening!"', "None of them"],
    correctIndex: 1,
    explanation: "Hour is 14. It's not less than 12, so the first condition is false. But 14 is less than 17, so the else-if runs and greeting becomes \"Good afternoon!\"",
    hint: "Is 14 less than 12? If not, check the next condition: is 14 less than 17?",
  },
  {
    id: 6,
    code: `let fruit = "apple";

if (fruit === "banana") {
  color = "yellow";
} else if (fruit === "apple") {
  color = "red";
} else if (fruit === "apple") {
  color = "green";
}`,
    question: 'There are two conditions checking for "apple". What is color?',
    options: ['"yellow"', '"red"', '"green"', '"red" and "green"'],
    correctIndex: 1,
    explanation: 'Even though both else-if conditions check for "apple", only the FIRST matching branch executes. Once "red" is assigned, the rest are skipped entirely.',
    hint: "When multiple conditions could be true, think about which one the computer reaches first. Does it keep going after finding a match?",
  },
  {
    id: 7,
    code: `let age = 25;

if (age < 13) {
  category = "child";
} else if (age < 20) {
  category = "teenager";
} else if (age < 65) {
  category = "adult";
} else {
  category = "senior";
}`,
    question: "What category is assigned?",
    options: ['"child"', '"teenager"', '"adult"', '"senior"'],
    correctIndex: 2,
    explanation: "Age is 25. Not less than 13, not less than 20, but IS less than 65. So the third condition is the first true one, and category becomes \"adult\".",
    hint: "Check each condition with the value 25. Which is the first one that evaluates to true?",
  },
  {
    id: 8,
    code: `let day = "Saturday";

if (day === "Monday") {
  plan = "Work";
} else if (day === "Saturday" || day === "Sunday") {
  plan = "Relax";
} else {
  plan = "Work";
}`,
    question: "What is plan set to?",
    options: ['"Work" (from the if)', '"Relax"', '"Work" (from the else)', "Nothing"],
    correctIndex: 1,
    explanation: '"Saturday" doesn\'t match "Monday", but the else-if checks if day is "Saturday" OR "Sunday". Since it\'s "Saturday", the condition is true and plan becomes "Relax".',
    hint: 'Pay attention to the || (OR) operator. Does "Saturday" satisfy either side of that condition?',
  },
];

export const TOWN_LESSON_QUESTIONS: Question[] = [
  {
    id: 1,
    code: `let disaster = "wildfire";

if (disaster === "hurricane") {
  sandBagDoors();
} else if (disaster === "wildfire") {
  sprayRetardant();
} else if (disaster === "earthquake") {
  strapFurniture();
}`,
    question: "Which function gets called?",
    options: ["sandBagDoors()", "sprayRetardant()", "strapFurniture()", "All three"],
    correctIndex: 1,
    explanation: 'Since disaster is "wildfire", only the matching else-if branch runs. The hurricane and earthquake branches are skipped entirely.',
    hint: "Look at the value of disaster and find the condition that matches it.",
  },
  {
    id: 2,
    code: `let disaster = "earthquake";

if (disaster === "hurricane") {
  prepareType = "board windows";
} else if (disaster === "wildfire") {
  prepareType = "clear brush";
} else {
  prepareType = "secure items";
}`,
    question: "What is prepareType set to?",
    options: ['"board windows"', '"clear brush"', '"secure items"', "Nothing — it's undefined"],
    correctIndex: 2,
    explanation: '"earthquake" doesn\'t match "hurricane" or "wildfire", so neither if nor else-if is true. The else block catches everything else, setting prepareType to "secure items".',
    hint: "When none of the if/else-if conditions are true, which block runs?",
  },
  {
    id: 3,
    code: `let danger = "flood";

if (danger === "flood") {
  action = "evacuate";
} else if (danger === "flood") {
  action = "sandBag";
} else {
  action = "stay";
}`,
    question: 'There are two conditions checking for "flood". What is action?',
    options: ['"evacuate"', '"sandBag"', '"stay"', '"evacuate" and "sandBag"'],
    correctIndex: 0,
    explanation: 'Even though both conditions check for "flood", only the FIRST matching branch runs. Once "evacuate" is assigned, all remaining branches are skipped.',
    hint: "When multiple conditions could match, think about which one the computer checks first.",
  },
];
