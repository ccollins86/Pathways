import { useState, useRef, useEffect, useCallback } from "react";
import { useGame } from "@/lib/stores/useGame";
import { useQuestionPrefetch } from "@/lib/stores/useQuestionPrefetch";
import { TOWN_LESSON_QUESTIONS } from "./townQuestions";

const ITEM_LABELS: Record<string, string> = {
  sandbag: "Sandbag",
  wood_board: "Wood Board",
  flame_retardant: "Flame Retardant",
  rake: "Rake",
  safety_strap: "Safety Strap",
  wrench: "Wrench",
};


const IS_DEV = import.meta.env.DEV;

export function GameHUD() {
  const talkedToDan = useGame((s) => s.talkedToDan);
  const talkedToBob = useGame((s) => s.talkedToBob);
  const knownDisaster = useGame((s) => s.knownDisaster);
  const reportedToDan = useGame((s) => s.reportedToDan);
  const activeDialogue = useGame((s) => s.activeDialogue);
  const tasksActive = useGame((s) => s.tasksActive);
  const carriedItemInfo = useGame((s) => s.carriedItem);
  const hurricaneTasks = useGame((s) => s.hurricaneTasks);
  const wildfireTasks = useGame((s) => s.wildfireTasks);
  const earthquakeTasks = useGame((s) => s.earthquakeTasks);
  const questCompleted = useGame((s) => s.questCompleted);
  const questFailed = useGame((s) => s.questFailed);
  const failReason = useGame((s) => s.failReason);
  const dropItem = useGame((s) => s.dropItem);
  const restart = useGame((s) => s.restart);
  const retryQuest = useGame((s) => s.retryQuest);
  const practiceUnlocked = useGame((s) => s.practiceUnlocked);
  const practiceActive = useGame((s) => s.practiceActive);
  const practiceScore = useGame((s) => s.practiceScore);
  const unlockPractice = useGame((s) => s.unlockPractice);
  const practiceCompleted = useGame((s) => s.practiceCompleted);
  const portalActive = useGame((s) => s.portalActive);
  const gameCompleted = useGame((s) => s.gameCompleted);
  const addTotalScore = useGame((s) => s.addTotalScore);
  const incrementFirstTry = useGame((s) => s.incrementFirstTry);

  const prefetchedLesson = useQuestionPrefetch((s) => s.questions["town-lesson"]);
  const lessonQuestions = prefetchedLesson && prefetchedLesson.length > 0 ? prefetchedLesson : TOWN_LESSON_QUESTIONS;

  const [showLesson, setShowLesson] = useState(false);
  const [lessonQuizActive, setLessonQuizActive] = useState(false);
  const [lessonQuizQ, setLessonQuizQ] = useState(0);
  const [lessonQuizSelected, setLessonQuizSelected] = useState<number | null>(null);
  const [lessonQuizCorrect, setLessonQuizCorrect] = useState(false);
  const [lessonQuizWrong, setLessonQuizWrong] = useState(false);
  const [lessonQuizHint, setLessonQuizHint] = useState(false);
  const [viewingLessonFromQuiz, setViewingLessonFromQuiz] = useState(false);
  const [lessonQuizDone, setLessonQuizDone] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(true);
  const [lessonQuizHadWrong, setLessonQuizHadWrong] = useState(false);
  const [lessonQuizScore, setLessonQuizScore] = useState(0);
  const [lessonQuizPopups, setLessonQuizPopups] = useState<{ id: number; text: string; color: string }[]>([]);
  const lessonPopupIdRef = useRef(0);
  const lessonBonusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const lessonQuestionsRef = useRef(lessonQuestions);
  lessonQuestionsRef.current = lessonQuestions;
  const [lockedLessonQ, setLockedLessonQ] = useState(lessonQuestions[0]);

  useEffect(() => {
    successSoundRef.current = new Audio("/sounds/success.mp3");
    successSoundRef.current.volume = 0.5;
  }, []);

  const addLessonPopup = useCallback((text: string, color: string) => {
    lessonPopupIdRef.current += 1;
    const id = lessonPopupIdRef.current;
    setLessonQuizPopups((prev) => [...prev, { id, text, color }]);
    setTimeout(() => setLessonQuizPopups((prev) => prev.filter((p) => p.id !== id)), 1500);
  }, []);

  const handleLessonQuizAnswer = useCallback((index: number) => {
    if (lessonQuizCorrect) return;
    const q = lockedLessonQ;
    setLessonQuizSelected(index);
    if (index === q.correctIndex) {
      setLessonQuizCorrect(true);
      addTotalScore(10);
      setLessonQuizScore((s) => s + 10);
      addLessonPopup("+10", "#4ade80");
      if (!lessonQuizHadWrong) {
        setLessonQuizScore((s) => s + 5);
        incrementFirstTry();
        lessonBonusTimerRef.current = setTimeout(() => addLessonPopup("+5 First Try!", "#facc15"), 600);
      }
      try {
        if (successSoundRef.current) {
          successSoundRef.current.currentTime = 0;
          successSoundRef.current.play().catch(() => {});
        }
      } catch {}
    } else {
      setLessonQuizWrong(true);
      setLessonQuizHadWrong(true);
      setTimeout(() => setLessonQuizSelected(null), 800);
    }
  }, [lessonQuizCorrect, lockedLessonQ, lessonQuizHadWrong, addTotalScore, incrementFirstTry, addLessonPopup]);

  const handleLessonQuizNext = useCallback(() => {
    if (lessonBonusTimerRef.current) {
      clearTimeout(lessonBonusTimerRef.current);
      lessonBonusTimerRef.current = null;
    }
    setLessonQuizPopups([]);
    if (lessonQuizQ >= lessonQuestionsRef.current.length - 1) {
      setLessonQuizDone(true);
      setLessonQuizActive(false);
    } else {
      const nextIndex = lessonQuizQ + 1;
      setLessonQuizQ(nextIndex);
      setLockedLessonQ(lessonQuestionsRef.current[nextIndex]);
      setLessonQuizSelected(null);
      setLessonQuizCorrect(false);
      setLessonQuizWrong(false);
      setLessonQuizHint(false);
      setLessonQuizHadWrong(false);
    }
  }, [lessonQuizQ]);

  if (activeDialogue) return null;

  let objective = "Find Dan at the USC Apparel stand and talk to him.";
  if (gameCompleted) {
    objective = "Congratulations! You've completed Disaster Prep Quest! Feel free to explore the town.";
  } else if (questFailed) {
    objective = "Quest Failed! You made the wrong preparation choice.";
  } else if (portalActive) {
    objective = "A portal has appeared! Walk into it to enter the next world!";
  } else if (questCompleted && practiceCompleted) {
    objective = "Practice complete! A portal should appear soon...";
  } else if (questCompleted && practiceUnlocked) {
    objective = "Visit the Practice Station booth to test your programming knowledge!";
  } else if (questCompleted) {
    objective = "Quest Complete! You successfully prepared for the disaster!";
  } else if (tasksActive && knownDisaster) {
    if (knownDisaster === "hurricane") {
      objective = "Prepare for the Hurricane! Board windows and sandbag doors.";
    } else if (knownDisaster === "wildfire") {
      objective = "Prepare for the Wildfire! Spray house and clear vegetation.";
    } else if (knownDisaster === "earthquake") {
      objective = "Prepare for the Earthquake! Strap furniture and shut off gas lines.";
    }
  } else if (talkedToDan && talkedToBob && knownDisaster && !reportedToDan) {
    const disasterName =
      knownDisaster.charAt(0).toUpperCase() + knownDisaster.slice(1);
    objective = `Go back to Dan and tell him it's a ${disasterName}!`;
  } else if (talkedToDan && !talkedToBob) {
    objective = "Find Bob and ask him which natural disaster is coming tonight.";
  }

  return (
    <>
      {/* Quest completed banner / lesson */}
      {questCompleted && !questFailed && !showLesson && !practiceUnlocked && !lessonQuizActive && !lessonQuizDone && !viewingLessonFromQuiz && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 100, 0, 0.9)",
            borderRadius: 16,
            padding: "32px 48px",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            zIndex: 150,
            textAlign: "center",
            border: "3px solid #4fc3f7",
            boxShadow: "0 0 40px rgba(79, 195, 247, 0.4)",
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
            Quest Complete!
          </div>
          <div style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.9 }}>
            You successfully prepared the house for the{" "}
            {knownDisaster?.charAt(0).toUpperCase()}
            {knownDisaster?.slice(1)}!
          </div>
          <div style={{ fontSize: 14, marginTop: 12, opacity: 0.7 }}>
            Being prepared for natural disasters saves lives.
          </div>
          <div
            onClick={() => setShowLesson(true)}
            style={{
              marginTop: 20,
              padding: "12px 32px",
              background: "#4fc3f7",
              border: "none",
              borderRadius: 8,
              color: "#0d47a1",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            View Programming Lesson
          </div>
        </div>
      )}

      {questCompleted && (showLesson || viewingLessonFromQuiz) && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(13, 25, 48, 0.96)",
            borderRadius: 16,
            padding: "28px 36px",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            zIndex: 150,
            border: "3px solid #4fc3f7",
            boxShadow: "0 0 40px rgba(79, 195, 247, 0.4)",
            maxWidth: 580,
            maxHeight: "85vh",
            overflowY: "auto",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#4fc3f7" }}>
            Branching Statements in Programming
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
            In this quest, you found out that a <strong style={{ color: "#ffeb3b" }}>{knownDisaster}</strong> was coming.
            Even though items for <em>all three</em> disasters were available, you only performed the tasks
            for the {knownDisaster}. You ignored the other items because they didn't match the situation.
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
            This is exactly how <strong style={{ color: "#4fc3f7" }}>if / else-if / else</strong> statements
            work in programming! The computer checks each condition in order, and <em>only executes the
            code block</em> where the condition is true. The other blocks are skipped entirely — just like
            how you skipped the preparations for the other disasters.
          </div>

          <div
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              borderRadius: 8,
              padding: "16px 20px",
              fontFamily: "'Courier New', monospace",
              fontSize: 14,
              lineHeight: 1.8,
              marginBottom: 16,
              border: "1px solid rgba(79, 195, 247, 0.3)",
              whiteSpace: "pre-wrap",
            }}
          >
            <span style={{ color: "#c792ea" }}>if</span>
            <span style={{ color: "#89ddff" }}> (</span>
            <span style={{ color: "#f78c6c" }}>disaster</span>
            <span style={{ color: "#89ddff" }}> === </span>
            <span style={{ color: "#c3e88d" }}>"hurricane"</span>
            <span style={{ color: "#89ddff" }}>)</span>
            <span style={{ color: knownDisaster === "hurricane" ? "#c3e88d" : "#546e7a" }}>{" {\n"}
            {"  "}sandBagDoors();{"\n"}
            {"  "}boardUpWindows();{"\n"}
            {"}"}</span>
            {"\n"}
            <span style={{ color: "#c792ea" }}>else if</span>
            <span style={{ color: "#89ddff" }}> (</span>
            <span style={{ color: "#f78c6c" }}>disaster</span>
            <span style={{ color: "#89ddff" }}> === </span>
            <span style={{ color: "#c3e88d" }}>"wildfire"</span>
            <span style={{ color: "#89ddff" }}>)</span>
            <span style={{ color: knownDisaster === "wildfire" ? "#c3e88d" : "#546e7a" }}>{" {\n"}
            {"  "}sprayFlameRetardant();{"\n"}
            {"  "}clearVegetation();{"\n"}
            {"}"}</span>
            {"\n"}
            <span style={{ color: "#c792ea" }}>else if</span>
            <span style={{ color: "#89ddff" }}> (</span>
            <span style={{ color: "#f78c6c" }}>disaster</span>
            <span style={{ color: "#89ddff" }}> === </span>
            <span style={{ color: "#c3e88d" }}>"earthquake"</span>
            <span style={{ color: "#89ddff" }}>)</span>
            <span style={{ color: knownDisaster === "earthquake" ? "#c3e88d" : "#546e7a" }}>{" {\n"}
            {"  "}strapFurniture();{"\n"}
            {"  "}shutOffGasLines();{"\n"}
            {"}"}</span>
          </div>

          <div style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.9, marginBottom: 8 }}>
            {knownDisaster === "hurricane" && (
              <>Because the disaster was <strong style={{ color: "#ffeb3b" }}>"hurricane"</strong>, only the first block ran — sandbagging doors and boarding windows. The wildfire and earthquake blocks were skipped, just like you skipped those items in the game!</>
            )}
            {knownDisaster === "wildfire" && (
              <>Because the disaster was <strong style={{ color: "#ffeb3b" }}>"wildfire"</strong>, only the second block ran — spraying flame retardant and clearing vegetation. The hurricane and earthquake blocks were skipped, just like you skipped those items in the game!</>
            )}
            {knownDisaster === "earthquake" && (
              <>Because the disaster was <strong style={{ color: "#ffeb3b" }}>"earthquake"</strong>, only the third block ran — strapping furniture and shutting off gas lines. The hurricane and wildfire blocks were skipped, just like you skipped those items in the game!</>
            )}
          </div>

          <div style={{ fontSize: 14, opacity: 0.6, marginBottom: 16 }}>
            Only one branch executes — the first one whose condition is true. The rest are ignored.
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <div
              onClick={viewingLessonFromQuiz
                ? () => { setViewingLessonFromQuiz(false); setLessonQuizActive(true); }
                : () => { setShowLesson(false); setLessonQuizActive(true); setLessonQuizQ(0); setLockedLessonQ(lessonQuestionsRef.current[0]); setLessonQuizSelected(null); setLessonQuizCorrect(false); setLessonQuizWrong(false); setLessonQuizHint(false); setLessonQuizDone(false); }
              }
              style={{
                padding: "12px 32px",
                background: "#4fc3f7",
                border: "none",
                borderRadius: 8,
                color: "#0d47a1",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {viewingLessonFromQuiz ? "Back to Quiz" : "Test Your Understanding"}
            </div>
          </div>
        </div>
      )}

      {/* Lesson quiz */}
      {questCompleted && lessonQuizActive && !viewingLessonFromQuiz && (() => {
        const q = lockedLessonQ;
        return (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(13, 25, 48, 0.97)",
              borderRadius: 16,
              padding: "24px 32px",
              color: "white",
              fontFamily: "'Inter', sans-serif",
              zIndex: 150,
              border: "3px solid #4fc3f7",
              boxShadow: "0 0 40px rgba(79, 195, 247, 0.4)",
              width: 560,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#4fc3f7" }}>
                Lesson Quiz
              </div>
              <div style={{ fontSize: 14, opacity: 0.6 }}>
                {lessonQuizQ + 1} / {lessonQuestions.length}
              </div>
            </div>

            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "#b0bec5" }}>
              {q.question}
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                borderRadius: 8,
                padding: "14px 18px",
                fontFamily: "'Courier New', monospace",
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 16,
                border: "1px solid rgba(79, 195, 247, 0.2)",
                whiteSpace: "pre-wrap",
                color: "#e0e0e0",
              }}
            >
              {q.code}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {q.options.map((option, i) => {
                let bg = "rgba(255,255,255,0.05)";
                let border = "1px solid rgba(255,255,255,0.15)";
                let textColor = "white";

                if (lessonQuizCorrect && i === q.correctIndex) {
                  bg = "rgba(76, 175, 80, 0.3)";
                  border = "2px solid #66bb6a";
                  textColor = "#66bb6a";
                } else if (lessonQuizSelected === i && !lessonQuizCorrect) {
                  bg = "rgba(244, 67, 54, 0.3)";
                  border = "2px solid #ef5350";
                  textColor = "#ef5350";
                }

                return (
                  <div
                    key={i}
                    onClick={() => handleLessonQuizAnswer(i)}
                    style={{
                      padding: "10px 16px",
                      background: bg,
                      border,
                      borderRadius: 8,
                      cursor: lessonQuizCorrect ? "default" : "pointer",
                      fontSize: 15,
                      color: textColor,
                      fontWeight: (lessonQuizCorrect && i === q.correctIndex) || lessonQuizSelected === i ? 600 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    {String.fromCharCode(65 + i)}) {option}
                  </div>
                );
              })}
            </div>

            {lessonQuizCorrect && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(76, 175, 80, 0.15)",
                  border: "1px solid #66bb6a",
                  borderRadius: 8,
                  marginBottom: 16,
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#66bb6a" }}>
                    Correct! +10 pts
                  </div>
                  {!lessonQuizHadWrong && (
                    <div style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#fbbf24",
                      background: "rgba(251, 191, 36, 0.15)",
                      border: "1px solid rgba(251, 191, 36, 0.4)",
                      borderRadius: 20,
                      padding: "2px 10px",
                    }}>
                      ⭐ First Try +5
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
                  {q.explanation}
                </div>
                {lessonQuizPopups.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      position: "absolute",
                      top: -10,
                      right: 16,
                      fontSize: 18,
                      fontWeight: 800,
                      color: p.color,
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                      animation: "floatUp 1.5s ease-out forwards",
                      pointerEvents: "none",
                    }}
                  >
                    {p.text}
                  </div>
                ))}
              </div>
            )}

            {!lessonQuizCorrect && lessonQuizWrong && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(244, 67, 54, 0.15)",
                  border: "1px solid #ef5350",
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "#ef5350" }}>
                  Not quite! Try again.
                </div>
                <div
                  onClick={() => setLessonQuizHint(!lessonQuizHint)}
                  style={{
                    fontSize: 14,
                    color: "#4fc3f7",
                    cursor: "pointer",
                    marginTop: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 10 }}>{lessonQuizHint ? "\u25BC" : "\u25B6"}</span>
                  {lessonQuizHint ? "Hide Hint" : "Show Hint"}
                </div>
                {lessonQuizHint && (
                  <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85, marginTop: 8, paddingLeft: 16, borderLeft: "2px solid rgba(79, 195, 247, 0.4)" }}>
                    {q.hint}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                onClick={() => { setLessonQuizActive(false); setViewingLessonFromQuiz(true); }}
                style={{
                  padding: "8px 20px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 8,
                  color: "white",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                View Lesson
              </div>
              {lessonQuizCorrect && (
                <div
                  onClick={handleLessonQuizNext}
                  style={{
                    padding: "10px 24px",
                    background: "#4fc3f7",
                    border: "none",
                    borderRadius: 8,
                    color: "#0d47a1",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {lessonQuizQ >= lessonQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                </div>
              )}
            </div>
          <style>{`
            @keyframes floatUp {
              0% { opacity: 0; transform: translateY(0) scale(0.7); }
              15% { opacity: 1; transform: translateY(-12px) scale(1.1); }
              30% { transform: translateY(-18px) scale(1); }
              100% { opacity: 0; transform: translateY(-40px) scale(0.8); }
            }
          `}</style>
          </div>
        );
      })()}

      {/* Lesson quiz complete */}
      {questCompleted && lessonQuizDone && !practiceUnlocked && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 80, 0, 0.95)",
            borderRadius: 16,
            padding: "32px 48px",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            zIndex: 150,
            textAlign: "center",
            border: "3px solid #4fc3f7",
            boxShadow: "0 0 40px rgba(79, 195, 247, 0.4)",
            maxWidth: 440,
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            Quiz Complete!
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.9, marginBottom: 20 }}>
            Great job! You've shown you understand how branching statements work.
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              onClick={() => { setLessonQuizDone(false); unlockPractice(); }}
              style={{
                padding: "12px 32px",
                background: "#4fc3f7",
                border: "none",
                borderRadius: 8,
                color: "#0d47a1",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Continue Playing
            </div>
          </div>
        </div>
      )}

      {/* Quest failed banner */}
      {questFailed && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(120, 0, 0, 0.92)",
            borderRadius: 16,
            padding: "32px 48px",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            zIndex: 150,
            textAlign: "center",
            border: "3px solid #ef5350",
            boxShadow: "0 0 40px rgba(239, 83, 80, 0.5)",
            maxWidth: 440,
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
            Quest Failed!
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.9 }}>
            {failReason}
          </div>
          <div style={{ fontSize: 14, marginTop: 12, opacity: 0.7 }}>
            Remember: match your preparations to the specific disaster that's coming!
          </div>
          <div
            onClick={retryQuest}
            style={{
              marginTop: 20,
              padding: "10px 28px",
              background: "#ef5350",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try Again
          </div>
        </div>
      )}

      {/* Objective tracker */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(0, 0, 0, 0.75)",
          borderRadius: 8,
          padding: "12px 18px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          zIndex: 50,
          maxWidth: 380,
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: (() => {
              if (gameCompleted) return "#69f0ae";
              if (questFailed) return "#ef5350";
              if (questCompleted) return "#66bb6a";
              return "#ffeb3b";
            })(),
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          {(() => {
            if (gameCompleted) return "Complete";
            if (questFailed) return "Failed";
            if (questCompleted) return "Completed";
            return "Objective";
          })()}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.5 }}>{objective}</div>
      </div>

      {/* Carried item indicator */}
      {carriedItemInfo && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 16,
            transform: "translateY(-50%)",
            background: "rgba(0, 0, 0, 0.8)",
            borderRadius: 8,
            padding: "10px 16px",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            zIndex: 50,
            border: "2px solid #ffeb3b",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#ffeb3b",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            Carrying
          </div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            {ITEM_LABELS[carriedItemInfo.type]}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              marginTop: 4,
              cursor: "pointer",
            }}
            onClick={dropItem}
          >
            Press Q to drop
          </div>
        </div>
      )}

      {/* Quest progress / Task list */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(0, 0, 0, 0.75)",
          borderRadius: 8,
          padding: "12px 18px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          zIndex: 50,
          border: "1px solid rgba(255,255,255,0.15)",
          minWidth: 220,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#ffeb3b",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            userSelect: "none",
          }}
          onClick={() => setTasksOpen(!tasksOpen)}
        >
          <span>{gameCompleted ? "Adventure Complete" : "Quest Progress"}</span>
          <span style={{ fontSize: 11 }}>{tasksOpen ? "\u25BC" : "\u25B6"}</span>
        </div>
        {tasksOpen && gameCompleted && (
          <div style={{ fontSize: 14, lineHeight: 1.8 }}>
            <div style={{ color: "#66bb6a" }}>✓ Town World</div>
            <div style={{ color: "#66bb6a" }}>✓ Ocean World</div>
            <div style={{ color: "#66bb6a" }}>✓ Factory World</div>
            <div style={{ color: "#66bb6a" }}>✓ Psychic World</div>
          </div>
        )}
        {tasksOpen && !gameCompleted && <div style={{ fontSize: 14, lineHeight: 1.8 }}>
          <div style={{ color: talkedToDan ? "#66bb6a" : "white" }}>
            {talkedToDan ? "✓" : "○"} Talk to Dan
          </div>
          <div style={{ color: talkedToBob ? "#66bb6a" : "white" }}>
            {talkedToBob ? "✓" : "○"} Ask Bob about the disaster
          </div>
          <div style={{ color: reportedToDan ? "#66bb6a" : "white" }}>
            {reportedToDan ? "✓" : "○"} Report back to Dan
          </div>

          {tasksActive && knownDisaster === "hurricane" && (
            <>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#ff9800",
                  marginTop: 8,
                  marginBottom: 2,
                }}
              >
                Hurricane Prep:
              </div>
              <div
                style={{
                  color: hurricaneTasks.frontDoorSandbagged
                    ? "#66bb6a"
                    : "white",
                }}
              >
                {hurricaneTasks.frontDoorSandbagged ? "✓" : "○"} Sandbag front
                door
              </div>
              <div
                style={{
                  color: hurricaneTasks.backDoorSandbagged
                    ? "#66bb6a"
                    : "white",
                }}
              >
                {hurricaneTasks.backDoorSandbagged ? "✓" : "○"} Sandbag back
                door
              </div>
              <div
                style={{
                  color: hurricaneTasks.window1Boarded ? "#66bb6a" : "white",
                }}
              >
                {hurricaneTasks.window1Boarded ? "✓" : "○"} Board window 1
              </div>
              <div
                style={{
                  color: hurricaneTasks.window2Boarded ? "#66bb6a" : "white",
                }}
              >
                {hurricaneTasks.window2Boarded ? "✓" : "○"} Board window 2
              </div>
            </>
          )}

          {tasksActive && knownDisaster === "wildfire" && (
            <>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#ff9800",
                  marginTop: 8,
                  marginBottom: 2,
                }}
              >
                Wildfire Prep:
              </div>
              <div
                style={{
                  color: wildfireTasks.houseSprayed ? "#66bb6a" : "white",
                }}
              >
                {wildfireTasks.houseSprayed ? "✓" : "○"} Spray house with flame
                retardant
              </div>
              <div
                style={{
                  color: wildfireTasks.vegetationCleared ? "#66bb6a" : "white",
                }}
              >
                {wildfireTasks.vegetationCleared ? "✓" : "○"} Clear vegetation
              </div>
            </>
          )}

          {tasksActive && knownDisaster === "earthquake" && (
            <>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#ff9800",
                  marginTop: 8,
                  marginBottom: 2,
                }}
              >
                Earthquake Prep:
              </div>
              <div
                style={{
                  color: earthquakeTasks.furnitureStrapped
                    ? "#66bb6a"
                    : "white",
                }}
              >
                {earthquakeTasks.furnitureStrapped ? "✓" : "○"} Strap furniture
              </div>
              <div
                style={{
                  color: earthquakeTasks.gasShutOff ? "#66bb6a" : "white",
                }}
              >
                {earthquakeTasks.gasShutOff ? "✓" : "○"} Shut off gas lines
              </div>
            </>
          )}
        </div>}
      </div>

      {/* Controls hint */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          background: "rgba(0, 0, 0, 0.65)",
          borderRadius: 8,
          padding: "8px 14px",
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          zIndex: 50,
        }}
      >
        WASD / Arrows to move | E to interact{carriedItemInfo ? " | Q to drop" : ""}
      </div>

    </>
  );
}

