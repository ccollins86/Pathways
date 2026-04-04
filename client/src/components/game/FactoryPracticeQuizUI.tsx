import { useGame } from "@/lib/stores/useGame";
import { PracticeQuizBase, type Question, type QuizTheme } from "./PracticeQuizBase";

const QUESTIONS: Question[] = [
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
    hint: "Look at what's inside the parentheses where the function is defined — those named placeholders are the parameters.",
    explanation:
      'Parameters are the variable names listed in the function definition (size, topColor, brimColor, lettering). The actual values like "large" and "white" are called arguments \u2014 those are the specific inputs you pass in when you call the function.',
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
    hint: "Check how many times the for-loop runs — the loop counter goes from 0 up to (but not including) the quantity value.",
    explanation:
      'The function creates a shirt for each iteration of the loop. Since quantity is 3, the loop runs 3 times, pushing 3 shirts into the array. The function returns exactly what you asked for \u2014 3 medium shirts!',
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
    hint: "First figure out which if/else branch runs for \"jacket\", then multiply that price by the quantity.",
    explanation:
      'Since itemType is "jacket", pricePerItem is set to 50. Then the function returns 50 \u00d7 5 = 250. Functions can use if/else inside them too \u2014 combining the concepts you learned earlier!',
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
      "Nothing \u2014 it has no return statement",
      "The text for the lettering",
    ],
    correctIndex: 1,
    hint: "Look at the last line of the function — what variable does the return statement send back?",
    explanation:
      "The function creates a blank jacket, then applies customizations step by step (coloring sleeves, body, adding lettering), and returns the finished product. This is like how the jacket machine takes your inputs and outputs a completed jacket!",
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
    hint: "Count every function name followed by parentheses that appears inside the function body.",
    explanation:
      "fulfillOrder calls 4 functions: makeHat(), makeTshirt(), makeJacket(), and packItems(). Functions can call other functions! This is like how the full order process involves using multiple machines and then packing everything together.",
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
    hint: "Trace which argument is passed to greet for message2 — substitute that value for the parameter name in the return expression.",
    explanation:
      'When greet("USA") is called, the parameter name gets the value "USA". The function returns "Hello, " + "USA" + "!" which is "Hello, USA!". Same function, different input, different output \u2014 just like the same machine producing different products based on your settings!',
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
    hint: "Check the very first if-statement — what does it do when qty is 0? Does the rest of the function still run?",
    explanation:
      'Since qty is 0, the condition (qty <= 0) is true, so the function returns "Invalid order!" immediately. The return statement exits the function right away \u2014 produce, pack, and ship never run. This is called an early return, and it\'s useful for input validation!',
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
    hint: "Match each argument to the parameter in the same position — quantity comes first, then size, then colors, then lettering.",
    explanation:
      "The order of arguments must match the order of parameters in the function definition: quantity first (2), then size (\"large\"), then topColor (\"white\"), brimColor (\"green\"), and lettering (\"Italy\"). Getting the order wrong is a common bug \u2014 just like entering the wrong settings on a machine!",
  },
];

const THEME: QuizTheme = {
  title: "Functions Practice",
  accentColor: "#ff9800",
  hintColor: "#ffb74d",
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
  const totalScore = useGame((s) => s.totalScore);
  const incrementFirstTry = useGame((s) => s.incrementFirstTry);
  const factoryWorldBonusAwarded = useGame((s) => s.factoryWorldBonusAwarded);

  return (
    <PracticeQuizBase
      questions={QUESTIONS}
      theme={THEME}
      score={factoryPracticeScore}
      totalScore={totalScore}
      onClose={closeFactoryPractice}
      onAddScore={addFactoryPracticeScore}
      onResetScore={resetFactoryPracticeScore}
      onComplete={completeFactoryPractice}
      onFirstTryBonus={incrementFirstTry}
      worldName="Factory"
      worldBonusAwarded={factoryWorldBonusAwarded}
    />
  );
}
