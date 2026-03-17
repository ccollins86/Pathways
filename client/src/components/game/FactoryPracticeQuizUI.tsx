import { useMemo } from "react";
import { useGame } from "@/lib/stores/useGame";
import { PracticeQuizBase, type Question, type QuizTheme } from "./PracticeQuizBase";
import { secureShuffle } from "@/lib/random";

const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 1,
    code: `function makeHat(size, topColor, brimColor, lettering) {
  // assemble the hat with specified parts
  return finishedHat;
}

let myHat = makeHat("large", "white", "green", "Italy");`,
    question: "What are the PARAMETERS of the makeHat function?",
    options: [
      '"large", "white", "green", "Italy"',
      "size, topColor, brimColor, lettering",
      "finishedHat",
      "myHat",
    ],
    correctIndex: 1,
    explanation:
      'Parameters are the variable names listed in the function definition (size, topColor, brimColor, lettering). The actual values like "large" and "white" are called arguments — those are the specific inputs you pass in when you call the function.',
    hint: "Parameters are defined in the function declaration (the top line). Arguments are the actual values passed in when calling the function.",
  },
  {
    id: 2,
    code: `function makeTshirt(quantity, size, sleeveColor, bodyColor) {
  let shirts = [];
  for (let i = 0; i < quantity; i++) {
    shirts.push(assembleShirt(size, sleeveColor, bodyColor));
  }
  return shirts;
}

let order = makeTshirt(3, "medium", "red", "blue");`,
    question: "How many shirts will be in the 'order' array?",
    options: ["1", "2", "3", "It depends"],
    correctIndex: 2,
    explanation:
      'The function creates a shirt for each iteration of the loop. Since quantity is 3, the loop runs 3 times, pushing 3 shirts into the array. The function returns exactly what you asked for — 3 medium shirts!',
    hint: "Look at the first argument passed to makeTshirt. That controls how many times the loop runs.",
  },
  {
    id: 3,
    code: `function calculateCost(itemType, quantity) {
  let pricePerItem;
  if (itemType === "hat") {
    pricePerItem = 15;
  } else if (itemType === "tshirt") {
    pricePerItem = 25;
  } else if (itemType === "jacket") {
    pricePerItem = 50;
  }
  return pricePerItem * quantity;
}`,
    question: 'What does calculateCost("jacket", 5) return?',
    options: ["15", "25", "50", "250"],
    correctIndex: 3,
    explanation:
      'Since itemType is "jacket", pricePerItem is set to 50. Then the function returns 50 × 5 = 250. Functions can use if/else inside them too — combining the concepts you learned earlier!',
    hint: "First figure out what pricePerItem is set to for a jacket, then multiply it by the quantity.",
  },
  {
    id: 4,
    code: `function makeJacket(sleeveColor, bodyColor, letteringColor, text) {
  let jacket = createBlankJacket();
  colorSleeves(jacket, sleeveColor);
  colorBody(jacket, bodyColor);
  addLettering(jacket, text, letteringColor);
  return jacket;
}`,
    question: "What does this function RETURN?",
    options: [
      "The sleeve color",
      "A finished jacket with all customizations applied",
      "Nothing — it has no return statement",
      "The text for the lettering",
    ],
    correctIndex: 1,
    explanation:
      "The function creates a blank jacket, then applies customizations step by step (coloring sleeves, body, adding lettering), and returns the finished product. This is like how the jacket machine takes your inputs and outputs a completed jacket!",
    hint: "Look at the return statement at the end. What variable is being returned, and what has been done to it?",
  },
  {
    id: 5,
    code: `function fulfillOrder(hatOrder, shirtOrder, jacketOrder) {
  let hats = makeHat(hatOrder);
  let shirts = makeTshirt(shirtOrder);
  let jackets = makeJacket(jacketOrder);
  
  let box = packItems(hats, shirts, jackets);
  return box;
}`,
    question: "How many other functions does fulfillOrder call?",
    options: ["1", "3", "4", "5"],
    correctIndex: 2,
    explanation:
      "fulfillOrder calls 4 functions: makeHat(), makeTshirt(), makeJacket(), and packItems(). Functions can call other functions! This is like how the full order process involves using multiple machines and then packing everything together.",
    hint: "Count every function name that appears with parentheses inside the function body.",
  },
  {
    id: 6,
    code: `function greet(name) {
  return "Hello, " + name + "!";
}

let message1 = greet("Italy");
let message2 = greet("USA");
let message3 = greet("Germany");`,
    question: "What is the value of message2?",
    options: ['"Hello, Italy!"', '"Hello, USA!"', '"Hello, Germany!"', '"Hello, name!"'],
    correctIndex: 1,
    explanation:
      'When greet("USA") is called, the parameter name gets the value "USA". The function returns "Hello, " + "USA" + "!" which is "Hello, USA!". Same function, different input, different output — just like the same machine producing different products based on your settings!',
    hint: "Look at what argument is passed when message2 is created. That value replaces the parameter in the function.",
  },
  {
    id: 7,
    code: `function processOrder(type, qty) {
  if (qty <= 0) {
    return "Invalid order!";
  }
  
  let items = produce(type, qty);
  let box = pack(items);
  ship(box);
  return "Order shipped!";
}`,
    question: 'What happens if you call processOrder("hat", 0)?',
    options: [
      'It returns "Order shipped!"',
      "It produces 0 hats and ships an empty box",
      'It returns "Invalid order!" without producing anything',
      "It crashes with an error",
    ],
    correctIndex: 2,
    explanation:
      'Since qty is 0, the condition (qty <= 0) is true, so the function returns "Invalid order!" immediately. The return statement exits the function right away — produce, pack, and ship never run. This is called an early return, and it\'s useful for input validation!',
    hint: "When a return statement runs, the function exits immediately. Check the first if condition with qty = 0.",
  },
  {
    id: 8,
    code: `// Which is a correct function call?

// Function definition:
function makeHat(quantity, size, topColor, brimColor, lettering) {
  // ... makes hats ...
  return hats;
}`,
    question: "Which call correctly orders 2 large hats with white top, green brim, labeled 'Italy'?",
    options: [
      'makeHat(2, "large", "white", "green", "Italy")',
      'makeHat("large", 2, "white", "green", "Italy")',
      'makeHat(2, "large", "green", "white", "Italy")',
      'makeHat("Italy", "white", "green", "large", 2)',
    ],
    correctIndex: 0,
    explanation:
      "The order of arguments must match the order of parameters in the function definition: quantity first (2), then size (\"large\"), then topColor (\"white\"), brimColor (\"green\"), and lettering (\"Italy\"). Getting the order wrong is a common bug — just like entering the wrong settings on a machine!",
    hint: "Match each argument to its parameter name in the function definition. The order must be exactly the same.",
  },
];

const THEME: QuizTheme = {
  title: "Functions Practice",
  accentColor: "#ff9800",
  hintColor: "#ff9800",
  bgColor: "rgba(30, 20, 5, 0.97)",
  borderColor: "#ff9800",
  boxShadow: "0 0 40px rgba(255, 152, 0, 0.4)",
  nextBtnTextColor: "white",
  confettiColors: ["#ff9800", "#4caf50", "#f44336", "#2196f3", "#e040fb", "#ffeb3b", "#69f0ae", "#ff6b6b"],
  confettiPrefix: "factory-confetti",
};

export function FactoryPracticeQuizUI() {
  const closeFactoryPractice = useGame((s) => s.closeFactoryPractice);
  const addFactoryPracticeScore = useGame((s) => s.addFactoryPracticeScore);
  const factoryPracticeScore = useGame((s) => s.factoryPracticeScore);
  const completeFactoryPractice = useGame((s) => s.completeFactoryPractice);
  const resetFactoryPracticeScore = useGame((s) => s.resetFactoryPracticeScore);
  const factoryQuestions = useGame((s) => s.factoryQuestions);

  const questions = useMemo(() => {
    if (factoryQuestions && factoryQuestions.length > 0) return factoryQuestions;
    return secureShuffle(FALLBACK_QUESTIONS);
  }, [factoryQuestions]);

  return (
    <PracticeQuizBase
      questions={questions}
      theme={THEME}
      score={factoryPracticeScore}
      onClose={closeFactoryPractice}
      onAddScore={addFactoryPracticeScore}
      onResetScore={resetFactoryPracticeScore}
      onComplete={completeFactoryPractice}
    />
  );
}
