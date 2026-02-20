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
import { PracticeBooth } from "./PracticeBooth";
import { useGame } from "@/lib/stores/useGame";
import GAME_CONFIG from "../../gameConfig";

export function Game() {
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 5));

  const scenario = useGame((s) => s.scenario);
  const talkedToQuestGiver = useGame((s) => s.talkedToQuestGiver);
  const talkedToRevealer = useGame((s) => s.talkedToRevealer);
  const knownScenario = useGame((s) => s.knownScenario);
  const reportedBack = useGame((s) => s.reportedBack);
  const activeDialogue = useGame((s) => s.activeDialogue);
  const tasksActive = useGame((s) => s.tasksActive);
  const completedTasks = useGame((s) => s.completedTasks);
  const questCompleted = useGame((s) => s.questCompleted);
  const questFailed = useGame((s) => s.questFailed);
  const practiceUnlocked = useGame((s) => s.practiceUnlocked);
  const practiceActive = useGame((s) => s.practiceActive);
  const openPractice = useGame((s) => s.openPractice);

  const setTalkedToQuestGiver = useGame((s) => s.setTalkedToQuestGiver);
  const setTalkedToRevealer = useGame((s) => s.setTalkedToRevealer);
  const setKnownScenario = useGame((s) => s.setKnownScenario);
  const setReportedBack = useGame((s) => s.setReportedBack);
  const openDialogue = useGame((s) => s.openDialogue);
  const activateTasks = useGame((s) => s.activateTasks);
  const completeTask = useGame((s) => s.completeTask);
  const failQuest = useGame((s) => s.failQuest);

  const config = GAME_CONFIG;
  const questGiverNPC = config.npcs.find((n) => n.role === "quest_giver");
  const revealerNPC = config.npcs.find((n) => n.role === "info_revealer");
  const currentScenario = config.scenarios.find((s) => s.id === scenario);
  const scenarioName = currentScenario?.name ?? scenario;

  const handlePositionUpdate = useCallback((pos: THREE.Vector3) => {
    setPlayerPos(pos);
  }, []);

  const handleQuestGiverInteract = useCallback(() => {
    if (activeDialogue) return;
    const gName = questGiverNPC?.name ?? "Guide";
    const rName = revealerNPC?.name ?? "Scout";

    if (questCompleted) {
      openDialogue(gName, [
        { speaker: gName, text: "Amazing work! You've completed all the tasks. Great job!" },
      ]);
      return;
    }

    if (!talkedToQuestGiver) {
      setTalkedToQuestGiver(true);
      const scenarioDescriptions = config.scenarios
        .map((s) => `If it's ${s.name}: ${s.description}`)
        .join("\n\n");
      openDialogue(gName, [
        { speaker: gName, text: `Hey there! I'm ${gName}. We have a situation — one of several scenarios is about to happen, but I don't know which one!` },
        { speaker: gName, text: `Can you go talk to ${rName}? They might know which scenario we're dealing with.` },
        { speaker: gName, text: `Here's what to do for each possibility:\n\n${scenarioDescriptions}` },
        { speaker: gName, text: `Hurry and find out! Go talk to ${rName}.` },
      ]);
    } else if (talkedToRevealer && knownScenario && !reportedBack) {
      setReportedBack(true);
      activateTasks();
      openDialogue(gName, [
        { speaker: "You", text: `${gName}! ${revealerNPC?.name} told me it's going to be ${scenarioName}!` },
        { speaker: gName, text: `${scenarioName}?! Thanks for finding out!` },
        { speaker: gName, text: `Quick! ${currentScenario?.description ?? "Complete the required tasks!"}` },
        { speaker: gName, text: "Get to work — you can do this!" },
      ]);
    } else if (reportedBack && !questCompleted) {
      openDialogue(gName, [
        { speaker: gName, text: "Go finish the tasks! Pick up the right items and use them at the correct spots." },
      ]);
    } else {
      openDialogue(gName, [
        { speaker: gName, text: `Please go find ${rName} and ask them what's happening!` },
      ]);
    }
  }, [activeDialogue, talkedToQuestGiver, talkedToRevealer, knownScenario, reportedBack, questCompleted, openDialogue, setTalkedToQuestGiver, setReportedBack, activateTasks, config, scenarioName, currentScenario, questGiverNPC, revealerNPC]);

  const handleRevealerInteract = useCallback(() => {
    if (activeDialogue) return;
    const rName = revealerNPC?.name ?? "Scout";
    const gName = questGiverNPC?.name ?? "Guide";

    if (!talkedToQuestGiver) {
      openDialogue(rName, [
        { speaker: rName, text: `Hey! You should go talk to ${gName} first. They were looking for help.` },
      ]);
    } else if (!talkedToRevealer) {
      setTalkedToRevealer(true);
      setKnownScenario(true);
      openDialogue(rName, [
        { speaker: "You", text: `Hey ${rName}, ${gName} sent me. Do you know what's happening?` },
        { speaker: rName, text: `I just found out — it's going to be ${scenarioName}! You better go tell ${gName} right away!` },
        { speaker: rName, text: `Hurry back to ${gName} and let them know!` },
      ]);
    } else {
      openDialogue(rName, [
        { speaker: rName, text: `Remember, it's ${scenarioName}! Make sure the preparations are done!` },
      ]);
    }
  }, [activeDialogue, talkedToQuestGiver, talkedToRevealer, scenario, scenarioName, openDialogue, setTalkedToRevealer, setKnownScenario, questGiverNPC, revealerNPC]);

  const handleHintNPCInteract = useCallback((npcName: string) => {
    if (activeDialogue) return;
    const gName = questGiverNPC?.name ?? "Guide";
    const rName = revealerNPC?.name ?? "Scout";

    if (!talkedToQuestGiver) {
      openDialogue(npcName, [
        { speaker: npcName, text: `Hi! Have you met ${gName}? You should go talk to them!` },
      ]);
    } else if (!talkedToRevealer) {
      openDialogue(npcName, [
        { speaker: npcName, text: `Looking for info? Try talking to ${rName} — they usually know what's going on!` },
      ]);
    } else {
      openDialogue(npcName, [
        { speaker: npcName, text: `I heard you found out what's happening. Make sure everyone is prepared!` },
      ]);
    }
  }, [activeDialogue, talkedToQuestGiver, talkedToRevealer, openDialogue, questGiverNPC, revealerNPC]);

  const handleEducatorInteract = useCallback((npcName: string) => {
    if (activeDialogue) return;
    openDialogue(npcName, [
      { speaker: npcName, text: "Being prepared can make a huge difference! Always have a plan ready." },
      { speaker: npcName, text: "Every team should know what to do in each scenario. Stay safe out there!" },
    ]);
  }, [activeDialogue, openDialogue]);

  const hp = HOUSE_POS;

  const currentScenarioTargets = config.taskTargets.filter(
    (t) => t.forScenario === scenario
  );

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

      {config.npcs.map((npc) => {
        let handler: () => void;
        if (npc.role === "quest_giver") {
          handler = handleQuestGiverInteract;
        } else if (npc.role === "info_revealer") {
          handler = handleRevealerInteract;
        } else if (npc.role === "educator") {
          handler = () => handleEducatorInteract(npc.name);
        } else {
          handler = () => handleHintNPCInteract(npc.name);
        }

        return (
          <NPC
            key={npc.name}
            name={npc.name}
            position={npc.position}
            bodyColor={npc.bodyColor}
            shirtColor={npc.shirtColor}
            playerPosition={playerPos}
            onInteract={handler}
          />
        );
      })}

      {tasksActive && !questCompleted && !questFailed && (
        <>
          {config.items.map((item) => (
            <WorldItem
              key={item.id}
              itemId={item.id}
              itemType={item.itemType}
              position={item.position}
              playerPosition={playerPos}
            />
          ))}

          {config.taskTargets.map((target) => (
            <InteractionTarget
              key={target.id}
              position={target.position}
              label={target.label}
              requiredItem={target.requiredItem}
              interactRadius={3}
              playerPosition={playerPos}
              onUse={() =>
                target.forScenario === scenario
                  ? completeTask(target.id)
                  : failQuest(`You did the wrong task! This was for ${config.scenarios.find(s => s.id === target.forScenario)?.name ?? target.forScenario}, but we're dealing with ${scenarioName}!`)
              }
              onWrongUse={() => failQuest("That's the wrong item for this spot! Think about what this location needs.")}
              completed={completedTasks[target.id] ?? false}
              completedLabel={target.completedLabel}
            />
          ))}
        </>
      )}

      <PracticeBooth
        position={[20, 0, 8]}
        playerPosition={playerPos}
        practiceUnlocked={practiceUnlocked}
        practiceActive={practiceActive}
        onInteract={openPractice}
      />
    </>
  );
}
