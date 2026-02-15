# Branching Statements Quest & Practice Stations (If / Else-if / Else)

A small, scenario-driven learning experience that teaches **branching statements** through an interactive quest and three progressively harder practice stations (Easy → Medium → Hard).

You’ll complete an “intuition quest” first (a real-world analogy for conditional logic), then reinforce the concept with generated practice questions—ending with a coding challenge in JavaScript.

---

## What You’ll Learn

* How **`if`**, **`else if`**, and **`else`** work
* How to choose **exactly one** correct branch based on a condition
* How to handle **nested branching** (branching inside branching)
* How to implement branching logic in **JavaScript** and pass test cases

---

## Gameplay Overview

### 1) Intuition Quest (NPC Scenario)

**Start:** Find **Dan** at the **USC apparel stand** (he has a **yellow exclamation mark** above his head).

**Dan’s quest:**

* A natural disaster is expected this evening.
* Dan can’t leave work, so he asks you to **ask around** and figure out which disaster is coming.
* Dan describes his home: **painted red with a yellow roof**.
* You must prepare his house **based on the disaster type**.

#### Disaster Types (3 possible)

When you find **Bob** and ask what’s coming, Bob will answer with **one** of:

**Hurricane**

* Board up the windows
* Put sandbags in front of the **front and back** doors

**Wildfire**

* Spray the outside of the house with flame retardant
* Clear vegetation around the house with a rake

**Earthquake**

* Secure furniture inside with safety straps
* Remove items from the bookshelf and put them in the **brown bag** on the floor

> All other NPCs will say they don’t know.

#### Quest Completion

After preparing Dan’s house:

* Return to **Dan**
* If correct: you receive a **USC Trojans Football helmet**
* If incorrect: message shows
  **“Unfortunately, you did not do as requested, please try again”**
  and the quest resets.

---

## Programming Analogy (Why This Teaches Branching)

After the quest, the experience explicitly connects your actions to programming:

* You evaluate a condition (which disaster is coming)
* You execute **only the matching set of actions**
* You **do not** perform actions for other disasters

That’s the same idea as:

```text
if (conditionA) do A
else if (conditionB) do B
else do C
```

Only one branch runs—based on what’s true.

---

## Practice Stations

Once you finish the intuition quest, you’ll see **three booths**:

* **Easy Practice Station**
* **Medium Practice Station**
* **Hard Practice Station**

You must clear them in order.

### Easy Station (Multiple Choice)

* You answer **multiple choice** questions about selecting the correct branching structure for a scenario.
* Questions are **generated via an LLM**.
* You click answer choices.
* Get **3 correct** to pass.
* Completion message tells you to move to Medium.

### Medium Station (Nested Branching Multiple Choice)

* Similar flow, but questions involve **nested branching** (branching inside branching).
* Generated via an LLM.
* Get **3 correct** to pass.
* Completion message tells you to move to Hard.

### Hard Station (Write JavaScript Code + Test Cases)

* You’re given scenario prompts.
* You must **write JavaScript code** using branching statements.
* Your solution must **pass generated test cases**.
* Questions and matching tests are **generated via an LLM**.
* Get **3 correct** to finish.

**Final Reward:** Front row tickets to the **USC vs UCLA game on November 28th**.

---

## Recommended User Flow

1. Talk to Dan → accept quest
2. Ask around → find Bob → learn the disaster
3. Go to Dan’s house → complete only the correct preparation tasks
4. Return to Dan → get feedback + reward
5. Complete Easy → Medium → Hard practice stations

---

## LLM Integration Notes (High-Level)

The project relies on an LLM for:

* Generating Easy multiple-choice branching questions
* Generating Medium nested-branching multiple-choice questions
* Generating Hard coding prompts **plus** corresponding test cases

A typical pattern:

* Request a question (and choices, if MCQ)
* Validate user response (choice or code)
* Track progress (needs 3 correct per station)
* Gate access to the next station until completion

---

## Rewards

* ✅ Correct intuition quest: **USC Trojans Football helmet**
* ✅ Clear all stations (3/3 hard tasks): **Front row USC vs UCLA tickets (Nov 28)**

---

## Credits

Designed as a learning experience to teach **conditional logic** through an interactive scenario and progressively harder practice.

---

