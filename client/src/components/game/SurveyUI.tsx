import { useState, useRef, useEffect } from "react";
import { useGame, type EcosystemData, type EnvironmentalIssue } from "@/lib/stores/useGame";

const ISSUE_LABELS: Record<EnvironmentalIssue, string> = {
  trash: "Lots of trash and debris",
  nets: "Fishing nets trapping fish",
  oil_spill: "Oil spill contamination",
};

function generateOptions(correct: number): number[] {
  const options = new Set<number>();
  options.add(correct);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 5) - 2;
    const val = Math.max(1, correct + offset);
    if (val !== correct) options.add(val);
  }
  return Array.from(options).sort((a, b) => a - b);
}

export function SurveyUI() {
  const currentSurveyIndex = useGame((s) => s.currentSurveyIndex);

  if (currentSurveyIndex === null) return null;

  return <SurveyUIInner key={currentSurveyIndex} ecosystemIndex={currentSurveyIndex} />;
}

function SurveyUIInner({ ecosystemIndex }: { ecosystemIndex: number }) {
  const ecosystems = useGame((s) => s.ecosystems);
  const closeSurvey = useGame((s) => s.closeSurvey);
  const completeEcosystemSurvey = useGame((s) => s.completeEcosystemSurvey);
  const eco = ecosystems[ecosystemIndex];

  const [step, setStep] = useState<"animals" | "plants" | "issue" | "result">("animals");
  const [animalAnswer, setAnimalAnswer] = useState<number | null>(null);
  const [plantAnswer, setPlantAnswer] = useState<number | null>(null);
  const [issueAnswer, setIssueAnswer] = useState<EnvironmentalIssue | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [allCorrect, setAllCorrect] = useState(false);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/sounds/success.mp3");
    audio.preload = "auto";
    audio.volume = 0.5;
    successSoundRef.current = audio;
  }, []);

  if (!eco) return null;

  const animalOptions = generateOptions(eco.animalCount);
  const plantOptions = generateOptions(eco.plantCount);

  const handleAnimalSelect = (count: number) => {
    setAnimalAnswer(count);
    if (count === eco.animalCount) {
      setStep("plants");
      setFeedback(null);
    } else {
      setFeedback(`Not quite! Look more carefully at the ${eco.name}. Count the marine animals again.`);
    }
  };

  const handlePlantSelect = (count: number) => {
    setPlantAnswer(count);
    if (count === eco.plantCount) {
      setStep("issue");
      setFeedback(null);
    } else {
      setFeedback(`Not quite! Look more carefully at the ${eco.name}. Count the marine plants again.`);
    }
  };

  const handleIssueSelect = (issue: EnvironmentalIssue) => {
    setIssueAnswer(issue);
    if (issue === eco.issue) {
      setAllCorrect(true);
      setFeedback(null);
      setStep("result");
      if (successSoundRef.current) {
        const sound = successSoundRef.current.cloneNode() as HTMLAudioElement;
        sound.volume = 0.5;
        sound.play().catch(() => {});
      }
    } else {
      setFeedback("That's not the right issue. Look carefully at the environmental problem in this ecosystem.");
    }
  };

  const handleFinish = () => {
    if (allCorrect) {
      completeEcosystemSurvey(ecosystemIndex);
    } else {
      closeSurvey();
    }
    setStep("animals");
    setAnimalAnswer(null);
    setPlantAnswer(null);
    setIssueAnswer(null);
    setFeedback(null);
    setAllCorrect(false);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(0, 30, 60, 0.97)",
        borderRadius: 16,
        padding: "24px 32px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: "3px solid #00bcd4",
        boxShadow: "0 0 40px rgba(0, 188, 212, 0.4)",
        width: 480,
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#00bcd4" }}>
          Marine Survey: {eco.name}
        </div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          Step {step === "animals" ? "1/3" : step === "plants" ? "2/3" : step === "issue" ? "3/3" : "Complete"}
        </div>
      </div>

      {step === "animals" && (
        <>
          <div style={{ fontSize: 15, marginBottom: 16, lineHeight: 1.6 }}>
            Look at the <strong style={{ color: "#ffeb3b" }}>{eco.name}</strong> ecosystem.
            How many <strong style={{ color: "#ff9800" }}>marine animals</strong> do you see?
          </div>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12 }}>
            Count all fish, starfish, crabs, turtles, seahorses, etc.
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {animalOptions.map((count) => (
              <div
                key={count}
                onClick={() => handleAnimalSelect(count)}
                style={{
                  padding: "12px 24px",
                  background: animalAnswer === count
                    ? (count === eco.animalCount ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)")
                    : "rgba(255,255,255,0.05)",
                  border: animalAnswer === count
                    ? `2px solid ${count === eco.animalCount ? "#66bb6a" : "#ef5350"}`
                    : "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: 700,
                  minWidth: 60,
                  textAlign: "center" as const,
                }}
              >
                {count}
              </div>
            ))}
          </div>
        </>
      )}

      {step === "plants" && (
        <>
          <div style={{ fontSize: 15, marginBottom: 16, lineHeight: 1.6 }}>
            Now count the <strong style={{ color: "#4caf50" }}>marine plants</strong> in the {eco.name}.
          </div>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12 }}>
            Count all coral, seaweed, kelp, algae, seagrass clumps, etc.
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {plantOptions.map((count) => (
              <div
                key={count}
                onClick={() => handlePlantSelect(count)}
                style={{
                  padding: "12px 24px",
                  background: plantAnswer === count
                    ? (count === eco.plantCount ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)")
                    : "rgba(255,255,255,0.05)",
                  border: plantAnswer === count
                    ? `2px solid ${count === eco.plantCount ? "#66bb6a" : "#ef5350"}`
                    : "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: 700,
                  minWidth: 60,
                  textAlign: "center" as const,
                }}
              >
                {count}
              </div>
            ))}
          </div>
        </>
      )}

      {step === "issue" && (
        <>
          <div style={{ fontSize: 15, marginBottom: 16, lineHeight: 1.6 }}>
            What <strong style={{ color: "#f44336" }}>environmental issue</strong> do you observe in this ecosystem?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(Object.entries(ISSUE_LABELS) as [EnvironmentalIssue, string][]).map(([key, label]) => (
              <div
                key={key}
                onClick={() => handleIssueSelect(key)}
                style={{
                  padding: "12px 16px",
                  background: issueAnswer === key
                    ? (key === eco.issue ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)")
                    : "rgba(255,255,255,0.05)",
                  border: issueAnswer === key
                    ? `2px solid ${key === eco.issue ? "#66bb6a" : "#ef5350"}`
                    : "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </>
      )}

      {step === "result" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#66bb6a", marginBottom: 12 }}>
            Survey Complete!
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 8 }}>
            <div>Marine Animals: <strong style={{ color: "#ff9800" }}>{eco.animalCount}</strong></div>
            <div>Marine Plants: <strong style={{ color: "#4caf50" }}>{eco.plantCount}</strong></div>
            <div>Environmental Issue: <strong style={{ color: "#f44336" }}>{ISSUE_LABELS[eco.issue]}</strong></div>
          </div>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>
            Great observation! Your survey data for the {eco.name} has been recorded.
          </div>
          <div
            onClick={handleFinish}
            style={{
              padding: "10px 24px",
              background: "#00bcd4",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            Continue
          </div>
        </div>
      )}

      {feedback && step !== "result" && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            background: "rgba(244, 67, 54, 0.15)",
            border: "1px solid #ef5350",
            borderRadius: 8,
            fontSize: 13,
            color: "#ef5350",
          }}
        >
          {feedback}
        </div>
      )}

      {step !== "result" && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <div
            onClick={() => {
              closeSurvey();
              setStep("animals");
              setAnimalAnswer(null);
              setPlantAnswer(null);
              setIssueAnswer(null);
              setFeedback(null);
            }}
            style={{
              padding: "8px 20px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8,
              color: "white",
              fontSize: 13,
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            Exit Survey
          </div>
        </div>
      )}
    </div>
  );
}
