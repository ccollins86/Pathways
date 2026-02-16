import { useState, useCallback } from "react";
import * as THREE from "three";
import { Ground } from "./Ground";
import { Lights } from "./Lights";
import { Sky } from "./Sky";
import { Environment } from "./Environment";
import { Player } from "./Player";
import { FollowCamera } from "./FollowCamera";
import { NPC } from "./NPC";
import { USCStand } from "./USCStand";
import { House, HOUSE_POS } from "./House";
import { WorldItem } from "./WorldItem";
import { InteractionTarget } from "./InteractionTarget";
import { useGame } from "@/lib/stores/useGame";

export function Game() {
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 5));

  const disaster = useGame((s) => s.disaster);
  const talkedToDan = useGame((s) => s.talkedToDan);
  const talkedToBob = useGame((s) => s.talkedToBob);
  const knownDisaster = useGame((s) => s.knownDisaster);
  const reportedToDan = useGame((s) => s.reportedToDan);
  const activeDialogue = useGame((s) => s.activeDialogue);
  const tasksActive = useGame((s) => s.tasksActive);
  const carriedItem = useGame((s) => s.carriedItem);
  const hurricaneTasks = useGame((s) => s.hurricaneTasks);
  const wildfireTasks = useGame((s) => s.wildfireTasks);
  const earthquakeTasks = useGame((s) => s.earthquakeTasks);
  const questCompleted = useGame((s) => s.questCompleted);
  const questFailed = useGame((s) => s.questFailed);

  const setTalkedToDan = useGame((s) => s.setTalkedToDan);
  const setTalkedToBob = useGame((s) => s.setTalkedToBob);
  const setKnownDisaster = useGame((s) => s.setKnownDisaster);
  const setReportedToDan = useGame((s) => s.setReportedToDan);
  const openDialogue = useGame((s) => s.openDialogue);
  const activateTasks = useGame((s) => s.activateTasks);
  const completeHurricaneTask = useGame((s) => s.completeHurricaneTask);
  const completeWildfireTask = useGame((s) => s.completeWildfireTask);
  const completeEarthquakeTask = useGame((s) => s.completeEarthquakeTask);
  const failQuest = useGame((s) => s.failQuest);

  const handlePositionUpdate = useCallback((pos: THREE.Vector3) => {
    setPlayerPos(pos);
  }, []);

  const hp = HOUSE_POS;

  const handleDanInteract = useCallback(() => {
    if (activeDialogue) return;

    if (questCompleted) {
      openDialogue("Dan", [
        {
          speaker: "Dan",
          text: "Amazing work! You've completed all the preparations. The town is much safer now thanks to you! Being prepared for natural disasters saves lives!",
        },
      ]);
      return;
    }

    if (!talkedToDan) {
      setTalkedToDan();
      openDialogue("Dan", [
        {
          speaker: "Dan",
          text: "Hey there! I'm Dan, I run this USC apparel stand. Listen, I heard there's a natural disaster that's going to hit the town tonight, but I don't know which one!",
        },
        {
          speaker: "Dan",
          text: "Can you do me a favor? Go ask around - talk to Bob, he might know which disaster is coming.",
        },
        {
          speaker: "Dan",
          text: "If it's a hurricane, please board up the windows and put sandbags in front of the front and back doors.",
        },
        {
          speaker: "Dan",
          text: "If it's a wildfire, please spray the outside of the house with flame retardant and clear out the vegetation around the house with a rake.",
        },
        {
          speaker: "Dan",
          text: "If it's an earthquake, please secure the furniture inside with safety straps and take items off the book shelf and put it in the brown bag on the floor.",
        },
        {
          speaker: "Dan",
          text: "Please hurry and find out! Go talk to Bob - he usually hangs out on the other side of town.",
        },
      ]);
    } else if (talkedToBob && knownDisaster && !reportedToDan) {
      setReportedToDan();
      activateTasks();
      const disasterName =
        knownDisaster.charAt(0).toUpperCase() + knownDisaster.slice(1);
      let instructions = "";
      if (knownDisaster === "hurricane") {
        instructions =
          "Quick! Go to the house and board up the windows with wood boards, and put sandbags in front of the front and back doors! You'll find the supplies nearby.";
      } else if (knownDisaster === "wildfire") {
        instructions =
          "Quick! Go to the house and spray the outside with flame retardant, then use a rake to clear out the vegetation around the house! The supplies are near the house.";
      } else if (knownDisaster === "earthquake") {
        instructions =
          "Quick! Go inside the house and secure the furniture with safety straps, then take the books off the bookshelf and put them in the brown bag on the floor! You'll find what you need nearby.";
      }
      openDialogue("Dan", [
        {
          speaker: "You",
          text: `Dan! Bob told me it's going to be a ${disasterName}!`,
        },
        {
          speaker: "Dan",
          text: `A ${disasterName}?! Oh no! Thank you for finding out!`,
        },
        {
          speaker: "Dan",
          text: instructions,
        },
        {
          speaker: "Dan",
          text: "The house is to the west of here - head that way and get to work! You can do this!",
        },
      ]);
    } else if (reportedToDan && !questCompleted) {
      openDialogue("Dan", [
        {
          speaker: "Dan",
          text: "Go to the house and finish preparing! Pick up the items you need and use them at the right spots. You've got this!",
        },
      ]);
    } else {
      openDialogue("Dan", [
        {
          speaker: "Dan",
          text: "Please go find Bob and ask him which natural disaster is coming tonight! He's usually over on the other side of town.",
        },
      ]);
    }
  }, [
    activeDialogue,
    talkedToDan,
    talkedToBob,
    knownDisaster,
    reportedToDan,
    questCompleted,
    setTalkedToDan,
    setReportedToDan,
    activateTasks,
    openDialogue,
  ]);

  const handleBobInteract = useCallback(() => {
    if (activeDialogue) return;

    if (!talkedToDan) {
      openDialogue("Bob", [
        {
          speaker: "Bob",
          text: "Hey! You should go talk to Dan at the USC apparel stand first. He was looking for help.",
        },
      ]);
    } else if (!talkedToBob) {
      setTalkedToBob();
      const disasterName =
        disaster!.charAt(0).toUpperCase() + disaster!.slice(1);
      setKnownDisaster(disaster!);
      openDialogue("Bob", [
        {
          speaker: "You",
          text: "Hey Bob, Dan sent me. He said there's a natural disaster coming tonight but he doesn't know which one. Do you know?",
        },
        {
          speaker: "Bob",
          text: `I just heard from the emergency services - it's going to be a ${disasterName}! You better go tell Dan right away so he can prepare!`,
        },
        {
          speaker: "Bob",
          text: "Hurry back to Dan and let him know! He'll tell you what to do.",
        },
      ]);
    } else {
      const disasterName =
        knownDisaster!.charAt(0).toUpperCase() + knownDisaster!.slice(1);
      openDialogue("Bob", [
        {
          speaker: "Bob",
          text: `Remember, it's a ${disasterName} coming tonight! Make sure the preparations are done!`,
        },
      ]);
    }
  }, [
    activeDialogue,
    talkedToDan,
    talkedToBob,
    disaster,
    knownDisaster,
    setTalkedToBob,
    setKnownDisaster,
    openDialogue,
  ]);

  const handleSaraInteract = useCallback(() => {
    if (activeDialogue) return;
    if (!talkedToDan) {
      openDialogue("Sara", [
        {
          speaker: "Sara",
          text: "Hi there! Beautiful day, isn't it? Though I heard there might be some bad weather coming... You should talk to Dan at the USC stand, he knows more.",
        },
      ]);
    } else if (!talkedToBob) {
      openDialogue("Sara", [
        {
          speaker: "Sara",
          text: "You're looking for info about the disaster? Try talking to Bob - he's over on the east side of town. He usually has the latest news!",
        },
      ]);
    } else {
      openDialogue("Sara", [
        {
          speaker: "Sara",
          text: "I heard you found out what's coming. Make sure everyone is prepared! Being ready for disasters is so important.",
        },
      ]);
    }
  }, [activeDialogue, talkedToDan, talkedToBob, openDialogue]);

  const handleMikeInteract = useCallback(() => {
    if (activeDialogue) return;
    if (!talkedToDan) {
      openDialogue("Mike", [
        {
          speaker: "Mike",
          text: "Hey! I'm just out for a walk. Have you met Dan? He has a USC apparel stand nearby - you should go check it out!",
        },
      ]);
    } else if (!talkedToBob) {
      openDialogue("Mike", [
        {
          speaker: "Mike",
          text: "A disaster coming? That sounds serious! I think Bob might know more - he keeps up with all the emergency alerts. He's to the east of here.",
        },
      ]);
    } else {
      const disasterName =
        knownDisaster!.charAt(0).toUpperCase() + knownDisaster!.slice(1);
      openDialogue("Mike", [
        {
          speaker: "Mike",
          text: `A ${disasterName}? Wow, thanks for letting me know! I'll start preparing too. It's important we all look out for each other.`,
        },
      ]);
    }
  }, [activeDialogue, talkedToDan, talkedToBob, knownDisaster, openDialogue]);

  const handleLisaInteract = useCallback(() => {
    if (activeDialogue) return;
    openDialogue("Lisa", [
      {
        speaker: "Lisa",
        text: "Did you know that being prepared for natural disasters can reduce damage by up to 60%? It's always good to have an emergency plan!",
      },
      {
        speaker: "Lisa",
        text: "Every family should have an emergency kit with water, food, flashlights, and a first aid kit. Stay safe out there!",
      },
    ]);
  }, [activeDialogue, openDialogue]);

  return (
    <>
      <Sky />
      <Lights />
      <Ground />
      <Environment />
      <USCStand />
      <House />

      <Player onPositionUpdate={handlePositionUpdate} />
      <FollowCamera playerPosition={playerPos} />

      {/* Dan - at the USC stand */}
      <NPC
        name="Dan"
        position={[6, 0, -3.5]}
        bodyColor="#2c3e50"
        shirtColor="#990000"
        playerPosition={playerPos}
        onInteract={handleDanInteract}
      />

      {/* Bob - on the other side of town */}
      <NPC
        name="Bob"
        position={[-12, 0, -10]}
        bodyColor="#34495e"
        shirtColor="#2196F3"
        playerPosition={playerPos}
        onInteract={handleBobInteract}
      />

      {/* Sara */}
      <NPC
        name="Sara"
        position={[-5, 0, 8]}
        bodyColor="#5d4037"
        shirtColor="#e91e63"
        playerPosition={playerPos}
        onInteract={handleSaraInteract}
      />

      {/* Mike */}
      <NPC
        name="Mike"
        position={[12, 0, 10]}
        bodyColor="#37474f"
        shirtColor="#ff9800"
        playerPosition={playerPos}
        onInteract={handleMikeInteract}
      />

      {/* Lisa */}
      <NPC
        name="Lisa"
        position={[-8, 0, -15]}
        bodyColor="#4e342e"
        shirtColor="#9c27b0"
        playerPosition={playerPos}
        onInteract={handleLisaInteract}
      />

      {/* === ALL DISASTER ITEMS & TARGETS (always visible when tasks active) === */}
      {tasksActive && !questCompleted && !questFailed && (
        <>
          {/* ---- HURRICANE ITEMS ---- */}
          <WorldItem
            itemId="sandbag-front"
            itemType="sandbag"
            position={[hp[0] + 10, 0, hp[2] + 6]}
            playerPosition={playerPos}
          />
          <WorldItem
            itemId="sandbag-back"
            itemType="sandbag"
            position={[hp[0] + 12, 0, hp[2] - 4]}
            playerPosition={playerPos}
          />
          <WorldItem
            itemId="board-w1"
            itemType="wood_board"
            position={[hp[0] - 10, 0, hp[2] + 8]}
            playerPosition={playerPos}
          />
          <WorldItem
            itemId="board-w2"
            itemType="wood_board"
            position={[hp[0] - 12, 0, hp[2] - 5]}
            playerPosition={playerPos}
          />

          {/* ---- WILDFIRE ITEMS ---- */}
          <WorldItem
            itemId="flame-retardant"
            itemType="flame_retardant"
            position={[hp[0] + 14, 0, hp[2] + 1]}
            playerPosition={playerPos}
          />
          <WorldItem
            itemId="rake"
            itemType="rake"
            position={[hp[0] - 8, 0, hp[2] - 9]}
            playerPosition={playerPos}
          />

          {/* ---- EARTHQUAKE ITEMS ---- */}
          <WorldItem
            itemId="safety-strap"
            itemType="safety_strap"
            position={[hp[0] + 8, 0, hp[2] - 8]}
            playerPosition={playerPos}
          />
          <WorldItem
            itemId="books"
            itemType="book"
            position={[hp[0] - 13, 0, hp[2] + 3]}
            playerPosition={playerPos}
          />

          {/* ---- HURRICANE TARGETS ---- */}
          <InteractionTarget
            position={[hp[0], 0.1, hp[2] + 4]}
            label="Place sandbag at front door"
            requiredItem="sandbag"
            playerPosition={playerPos}
            onUse={() =>
              knownDisaster === "hurricane"
                ? completeHurricaneTask("frontDoorSandbagged")
                : failQuest("You sandbagged the doors, but a " + knownDisaster + " is coming, not a hurricane! Sandbags won't help here.")
            }
            onWrongUse={() => failQuest("That's the wrong item for this spot! Think about what preparation this location needs.")}
            completed={hurricaneTasks.frontDoorSandbagged}
            completedLabel="Front door sandbagged!"
          />
          <InteractionTarget
            position={[hp[0] + 2, 0.1, hp[2] - 4]}
            label="Place sandbag at back door"
            requiredItem="sandbag"
            playerPosition={playerPos}
            onUse={() =>
              knownDisaster === "hurricane"
                ? completeHurricaneTask("backDoorSandbagged")
                : failQuest("You sandbagged the doors, but a " + knownDisaster + " is coming, not a hurricane! Sandbags won't help here.")
            }
            onWrongUse={() => failQuest("That's the wrong item for this spot! Think about what preparation this location needs.")}
            completed={hurricaneTasks.backDoorSandbagged}
            completedLabel="Back door sandbagged!"
          />
          <InteractionTarget
            position={[hp[0] - 5, 0.1, hp[2] - 0.5]}
            label="Board up window 1"
            requiredItem="wood_board"
            playerPosition={playerPos}
            onUse={() =>
              knownDisaster === "hurricane"
                ? completeHurricaneTask("window1Boarded")
                : failQuest("You boarded the windows, but a " + knownDisaster + " is coming, not a hurricane! Boarding windows won't help here.")
            }
            onWrongUse={() => failQuest("That's the wrong item for this spot! Think about what preparation this location needs.")}
            completed={hurricaneTasks.window1Boarded}
            completedLabel="Window 1 boarded!"
          />
          <InteractionTarget
            position={[hp[0] + 5, 0.1, hp[2] - 0.5]}
            label="Board up window 2"
            requiredItem="wood_board"
            playerPosition={playerPos}
            onUse={() =>
              knownDisaster === "hurricane"
                ? completeHurricaneTask("window2Boarded")
                : failQuest("You boarded the windows, but a " + knownDisaster + " is coming, not a hurricane! Boarding windows won't help here.")
            }
            onWrongUse={() => failQuest("That's the wrong item for this spot! Think about what preparation this location needs.")}
            completed={hurricaneTasks.window2Boarded}
            completedLabel="Window 2 boarded!"
          />

          {/* ---- WILDFIRE TARGETS ---- */}
          <InteractionTarget
            position={[hp[0] + 5, 0.1, hp[2] + 3]}
            label="Spray house with flame retardant"
            requiredItem="flame_retardant"
            interactRadius={3}
            playerPosition={playerPos}
            onUse={() =>
              knownDisaster === "wildfire"
                ? completeWildfireTask("houseSprayed")
                : failQuest("You sprayed flame retardant, but a " + knownDisaster + " is coming, not a wildfire! This won't help.")
            }
            onWrongUse={() => failQuest("That's the wrong item for this spot! Think about what preparation this location needs.")}
            completed={wildfireTasks.houseSprayed}
            completedLabel="House sprayed!"
          />
          <InteractionTarget
            position={[hp[0] - 6, 0.1, hp[2] + 5]}
            label="Clear vegetation with rake"
            requiredItem="rake"
            interactRadius={3}
            playerPosition={playerPos}
            onUse={() =>
              knownDisaster === "wildfire"
                ? completeWildfireTask("vegetationCleared")
                : failQuest("You cleared vegetation, but a " + knownDisaster + " is coming, not a wildfire! This won't help.")
            }
            onWrongUse={() => failQuest("That's the wrong item for this spot! Think about what preparation this location needs.")}
            completed={wildfireTasks.vegetationCleared}
            completedLabel="Vegetation cleared!"
          />

          {/* ---- EARTHQUAKE TARGETS ---- */}
          <InteractionTarget
            position={[hp[0] - 3, 0.1, hp[2] + 1]}
            label="Strap furniture to wall"
            requiredItem="safety_strap"
            interactRadius={3.5}
            playerPosition={playerPos}
            onUse={() =>
              knownDisaster === "earthquake"
                ? completeEarthquakeTask("furnitureStrapped")
                : failQuest("You strapped the furniture, but a " + knownDisaster + " is coming, not an earthquake! This won't help.")
            }
            onWrongUse={() => failQuest("That's the wrong item for this spot! Think about what preparation this location needs.")}
            completed={earthquakeTasks.furnitureStrapped}
            completedLabel="Furniture secured!"
          />
          <InteractionTarget
            position={[hp[0] + 3, 0.1, hp[2] + 1]}
            label="Put books in brown bag"
            requiredItem="book"
            interactRadius={3}
            playerPosition={playerPos}
            onUse={() =>
              knownDisaster === "earthquake"
                ? completeEarthquakeTask("booksInBag")
                : failQuest("You stored books in a bag, but a " + knownDisaster + " is coming, not an earthquake! This won't help.")
            }
            onWrongUse={() => failQuest("That's the wrong item for this spot! Think about what preparation this location needs.")}
            completed={earthquakeTasks.booksInBag}
            completedLabel="Books safely stored!"
          />
        </>
      )}
    </>
  );
}
