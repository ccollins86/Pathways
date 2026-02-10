/*
  Design Philosophy: Storybook Fantasy Adventure
  Main game interface with quest display and answer input
  Organic layout with hand-drawn aesthetic
*/

import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, Star, Trophy, Zap, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

export default function Game() {
  const { playerStats, currentQuest, submitAnswer, generateNewQuest } = useGame();
  const [, setLocation] = useLocation();
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Generate first quest when game starts
    if (!currentQuest) {
      generateNewQuest();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) {
      toast.error("Please enter an answer!");
      return;
    }

    const answer = parseInt(userAnswer, 10);
    if (isNaN(answer)) {
      toast.error("Please enter a valid number!");
      return;
    }

    const correct = submitAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      toast.success("Correct! Well done, brave adventurer! ⭐", {
        duration: 2000,
      });
    } else {
      toast.error(`Not quite! The answer was ${currentQuest?.answer}. Keep trying! 💪`, {
        duration: 3000,
      });
    }

    // Move to next quest after delay
    setTimeout(() => {
      setShowFeedback(false);
      setUserAnswer("");
      generateNewQuest();
    }, 2000);
  };

  const experienceProgress = ((playerStats.experience % 100) / 100) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/hero-background.png)",
          filter: "brightness(0.9)",
        }}
      />
      
      {/* Overlay for readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-purple-900/20" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 left-4 z-20"
        >
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            size="lg"
            className="bg-amber-50/95 backdrop-blur-sm border-2 border-amber-300 hover:bg-amber-100 text-amber-900 shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Button>
        </motion.div>
        {/* Header Stats */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap gap-4 justify-between items-center mb-8"
        >
          <Card className="bg-amber-50/95 backdrop-blur-sm border-amber-200 border-2 px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-600" />
              <div>
                <p className="text-sm text-amber-700 font-semibold">Level</p>
                <p className="text-2xl font-display text-amber-900">{playerStats.level}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-purple-50/95 backdrop-blur-sm border-purple-200 border-2 px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-purple-700 font-semibold">Streak</p>
                <p className="text-2xl font-display text-purple-900">{playerStats.streak} 🔥</p>
              </div>
            </div>
          </Card>

          <Card className="bg-green-50/95 backdrop-blur-sm border-green-200 border-2 px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-700 font-semibold">Score</p>
                <p className="text-2xl font-display text-green-900">{playerStats.correctAnswers}/{playerStats.totalQuests}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Experience Bar */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <Card className="bg-amber-50/95 backdrop-blur-sm border-amber-200 border-2 p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-amber-900">Experience</span>
              <span className="text-sm font-semibold text-amber-700">{playerStats.experience % 100}/100 XP</span>
            </div>
            <Progress value={experienceProgress} className="h-3 bg-amber-100" />
          </Card>
        </motion.div>

        {/* Main Quest Area */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Wizard Companion */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <img 
              src="/images/wizard-companion.png" 
              alt="Wizard Guide" 
              className="w-64 h-auto drop-shadow-2xl"
            />
          </motion.div>

          {/* Quest Card */}
          <AnimatePresence mode="wait">
            {currentQuest && (
              <motion.div
                key={currentQuest.id}
                initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                className="flex-1 max-w-2xl"
              >
                <Card 
                  className="relative overflow-hidden border-4 border-amber-300 shadow-2xl"
                  style={{
                    backgroundImage: "url(/images/quest-scroll.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Sparkle decoration */}
                  <div className="absolute top-4 right-4">
                    <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
                  </div>

                  <div className="relative p-8 md:p-12">
                    {/* Story Context */}
                    <div className="mb-8 text-center">
                      <h2 className="text-2xl md:text-3xl font-display text-amber-900 mb-4">
                        Quest #{playerStats.totalQuests + 1}
                      </h2>
                      <p className="text-lg md:text-xl text-amber-800 leading-relaxed">
                        {currentQuest.storyContext}
                      </p>
                    </div>

                    {/* Math Problem */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-6 border-4 border-amber-200 shadow-inner">
                      <p className="text-5xl md:text-6xl font-numbers font-semibold text-center text-amber-900">
                        {currentQuest.question} = ?
                      </p>
                    </div>

                    {/* Answer Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input
                          type="number"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Enter your answer..."
                          className="text-3xl font-numbers text-center h-16 bg-white/90 border-4 border-purple-300 focus:border-purple-500 rounded-xl"
                          disabled={showFeedback}
                          autoFocus
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        size="lg"
                        disabled={showFeedback}
                        className="w-full h-14 text-xl font-display bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg transform transition-transform hover:scale-105"
                      >
                        {showFeedback ? "Loading next quest..." : "Submit Answer"}
                      </Button>
                    </form>

                    {/* Feedback Animation */}
                    <AnimatePresence>
                      {showFeedback && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 360],
                            }}
                            transition={{ duration: 0.6 }}
                            className={`text-8xl ${isCorrect ? "text-green-500" : "text-orange-500"}`}
                          >
                            {isCorrect ? "⭐" : "💪"}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Achievement Badges */}
        {playerStats.badges.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <h3 className="text-2xl font-display text-amber-900 mb-4">Your Achievements</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {playerStats.badges.map((badge) => (
                <motion.div
                  key={badge}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 bg-amber-100 rounded-full border-4 border-amber-400 flex items-center justify-center shadow-lg"
                >
                  <Trophy className="w-10 h-10 text-amber-600" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
