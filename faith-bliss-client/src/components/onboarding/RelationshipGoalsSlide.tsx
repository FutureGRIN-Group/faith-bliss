/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-irregular-whitespace */
import React from "react";
import { motion } from "framer-motion";
// Import the type only
import type { OnboardingData } from "./types";
// Assuming SelectableCard is a separate component and properly imported
import SelectableCard from "./SelectableCard";

interface RelationshipGoalsSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

// FIXED: Using string literals since RelationshipGoals from './types' is likely a type alias, not a runtime enum.
const goalsOptions = [
  { value: "MARRIAGE_MINDED", label: "Marriage Minded", emoji: "💍" },
  { value: "RELATIONSHIP", label: "Relationship", emoji: "❤️" },
  { value: "FRIENDSHIP", label: "Friendship", emoji: "🤝" },
];

const RelationshipGoalsSlide: React.FC<RelationshipGoalsSlideProps> = ({
  onboardingData,
  setOnboardingData,
  isVisible,
}) => {
  if (!isVisible) return null;

  const handleSelect = (value: string) => {
    // Cast to string[] to ensure compatibility with array methods,
    // assuming relationshipGoals is RelationshipGoals[] | null | undefined in OnboardingData
    const currentGoals = (onboardingData.relationshipGoals || []) as string[];

    if (currentGoals.includes(value)) {
      setOnboardingData((prev) => ({
        ...prev,
        relationshipGoals: currentGoals.filter((goal) => goal !== value) as any, // Cast back for state setter
      }));
    } else {
      setOnboardingData((prev) => ({
        ...prev,
        relationshipGoals: [...currentGoals, value] as any, // Cast back for state setter
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">
          What are your intentions? 💖
        </h2>
        <p className="text-gray-400">It&apos;s great to be on the same page.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">
          What are you looking for? <span className="text-red-400">*</span>
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {goalsOptions.map((option) => (
            <SelectableCard
              key={option.value}
              label={option.label}
              emoji={option.emoji}
              isSelected={(onboardingData.relationshipGoals || []).includes(
                option.value as any
              )}
              onClick={() => handleSelect(option.value)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RelationshipGoalsSlide;
