/*
  Design Philosophy: Storybook Fantasy Adventure
  Welcome screen with game setup and difficulty selection
  Warm, inviting introduction to the math quest
*/

import { useState } from "react";
import { useGame, DifficultyLevel, OperationType } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Sword, Shield, Crown, Plus, Minus, Shuffle } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { setDifficulty, setOperationType, startGame, generateNewQuest } = useGame();
  const [, setLocation] = useLocation();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("easy");
  const [selectedOperation, setSelectedOperation] = useState<OperationType>("addition");

  const handleStartGame = () => {
    // Set difficulty and operation type
    setDifficulty(selectedDifficulty);
    setOperationType(selectedOperation);
    // Generate quest with selected settings
    generateNewQuest(selectedDifficulty, selectedOperation);
    // Start game and navigate
    startGame();
    setLocation("/game");
  };

  const difficulties = [
    {
      level: "easy" as DifficultyLevel,
      title: "Apprentice",
      description: "Numbers 1-10",
      icon: Sparkles,
      color: "from-green-500 to-green-600",
      borderColor: "border-green-400",
      bgColor: "bg-green-50/95",
    },
    {
      level: "medium" as DifficultyLevel,
      title: "Knight",
      description: "Numbers 5-20",
      icon: Sword,
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-400",
      bgColor: "bg-blue-50/95",
    },
    {
      level: "hard" as DifficultyLevel,
      title: "Master",
      description: "Numbers 10-50",
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-400",
      bgColor: "bg-purple-50/95",
    },
  ];

  const operations = [
    {
      type: "addition" as OperationType,
      title: "Addition",
      description: "Practice adding numbers",
      icon: Plus,
      color: "from-amber-500 to-amber-600",
    },
    {
      type: "subtraction" as OperationType,
      title: "Subtraction",
      description: "Practice subtracting numbers",
      icon: Minus,
      color: "from-orange-500 to-orange-600",
    },
    {
      type: "mixed" as OperationType,
      title: "Mixed",
      description: "Both addition and subtraction",
      icon: Shuffle,
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/hero-background.png)",
        }}
      />
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/30 via-purple-900/20 to-amber-900/30" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-display text-amber-100 mb-4 drop-shadow-lg text-shadow-glow">
            Math Quest Adventure
          </h1>
          <p className="text-xl md:text-2xl text-amber-50 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Embark on a magical journey where every math problem brings you closer to becoming a legendary hero!
          </p>
        </motion.div>

        {/* Wizard Companion */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 12,
            delay: 0.3,
          }}
          className="flex justify-center mb-12"
        >
          <img 
            src="/images/wizard-companion.png" 
            alt="Wizard Guide" 
            className="w-48 md:w-64 h-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Game Setup */}
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Operation Type Selection */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-amber-50/95 backdrop-blur-sm border-4 border-amber-300 p-6 shadow-2xl">
              <h2 className="text-3xl font-display text-amber-900 mb-6 text-center">
                Choose Your Quest Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {operations.map((op) => {
                  const Icon = op.icon;
                  const isSelected = selectedOperation === op.type;
                  return (
                    <motion.button
                      key={op.type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedOperation(op.type)}
                      className={`relative p-6 rounded-xl border-4 transition-all ${
                        isSelected
                          ? "border-purple-500 bg-purple-100 shadow-lg"
                          : "border-amber-200 bg-white/80 hover:border-amber-400"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${op.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-display text-amber-900">{op.title}</h3>
                        <p className="text-sm text-amber-700">{op.description}</p>
                      </div>
                      {isSelected && (
                        <motion.div
                          layoutId="operation-selected"
                          className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <span className="text-white text-xl">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Difficulty Selection */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-purple-50/95 backdrop-blur-sm border-4 border-purple-300 p-6 shadow-2xl">
              <h2 className="text-3xl font-display text-purple-900 mb-6 text-center">
                Choose Your Difficulty
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficulties.map((diff) => {
                  const Icon = diff.icon;
                  const isSelected = selectedDifficulty === diff.level;
                  return (
                    <motion.button
                      key={diff.level}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDifficulty(diff.level)}
                      className={`relative p-6 rounded-xl border-4 transition-all ${
                        isSelected
                          ? `${diff.borderColor} ${diff.bgColor} shadow-lg`
                          : "border-purple-200 bg-white/80 hover:border-purple-400"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${diff.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-display text-purple-900">{diff.title}</h3>
                        <p className="text-sm text-purple-700">{diff.description}</p>
                      </div>
                      {isSelected && (
                        <motion.div
                          layoutId="difficulty-selected"
                          className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <span className="text-white text-xl">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <Button
              onClick={handleStartGame}
              size="lg"
              className="h-16 px-12 text-2xl font-display bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white shadow-2xl transform transition-all hover:scale-110 border-4 border-amber-300"
            >
              <Shield className="w-8 h-8 mr-3" />
              Begin Your Quest!
            </Button>
          </motion.div>
        </div>

        {/* Treasure Map Preview */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-16 flex justify-center"
        >
          <img 
            src="/images/treasure-map.png" 
            alt="Quest Map" 
            className="max-w-md w-full h-auto rounded-xl shadow-2xl border-4 border-amber-400"
          />
        </motion.div>
      </div>
    </div>
  );
}
