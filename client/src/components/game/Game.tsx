import { useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { Ground } from "./Ground";
import { Lights } from "./Lights";
import { Sky } from "./Sky";
import { Environment } from "./Environment";
import { Player } from "./Player";
import { FollowCamera } from "./FollowCamera";
import { NPC } from "./NPC";
import { USCStand } from "./USCStand";
import { useGame, DisasterType } from "@/lib/stores/useGame";

export function Game() {
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 5));

  const disaster = useGame((s) => s.disaster);
  const talkedToDan = useGame((s) => s.talkedToDan);
  const talkedToBob = useGame((s) => s.talkedToBob);
  const knownDisaster = useGame((s) => s.knownDisaster);
  const activeDialogue = useGame((s) => s.activeDialogue);
  const setTalkedToDan = useGame((s) => s.setTalkedToDan);
  const setTalkedToBob = useGame((s) => s.setTalkedToBob);
  const setKnownDisaster = useGame((s) => s.setKnownDisaster);
  const openDialogue = useGame((s) => s.openDialogue);

  const handlePositionUpdate = useCallback((pos: THREE.Vector3) => {
    setPlayerPos(pos);
  }, []);

  const handleDanInteract = useCallback(() => {
    if (activeDialogue) return;

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
    } else if (talkedToBob && knownDisaster) {
      const disasterName =
        knownDisaster.charAt(0).toUpperCase() + knownDisaster.slice(1);
      let instructions = "";
      if (knownDisaster === "hurricane") {
        instructions =
          "Quick! Board up the windows and put sandbags in front of the front and back doors! That should help protect the house from the storm surge and strong winds.";
      } else if (knownDisaster === "wildfire") {
        instructions =
          "Quick! Spray the outside of the house with flame retardant and clear out the vegetation around the house with a rake! Creating that defensible space is crucial.";
      } else if (knownDisaster === "earthquake") {
        instructions =
          "Quick! Secure the furniture inside with safety straps and take items off the book shelf and put them in the brown bag on the floor! We need to prevent things from falling during the shaking.";
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
          text: "Thanks for your help! Now we know how to prepare. Being ready for natural disasters can save lives!",
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
    setTalkedToDan,
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
          text: "Hurry back to Dan and let him know! He'll know what to do to prepare.",
        },
      ]);
    } else {
      const disasterName =
        knownDisaster!.charAt(0).toUpperCase() + knownDisaster!.slice(1);
      openDialogue("Bob", [
        {
          speaker: "Bob",
          text: `Remember, it's a ${disasterName} coming tonight! Make sure Dan is preparing properly!`,
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
    </>
  );
}
