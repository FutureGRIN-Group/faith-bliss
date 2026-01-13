/* eslint-disable no-irregular-whitespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion } from "framer-motion";
import type { OnboardingData } from "./types";
// Since FaithJourney, ChurchAttendance, and RelationshipGoals are exported as TYPE aliases,
// we will reference their string values directly below to fix the 'only refers to a type' error.

interface PartnerPreferencesSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const faithJourneyOptions = [
  // FIXED: Using string literals instead of 'FaithJourney.ROOTED'
  { value: "ROOTED", label: "Rooted", emoji: "🌳" },
  { value: "GROWING", label: "Growing", emoji: "🌱" },
  { value: "EXPLORING", label: "Exploring", emoji: "🧭" },
  { value: "PASSIONATE", label: "Passionate", emoji: "🔥" },
];

const churchAttendanceOptions = [
  // FIXED: Using string literals instead of 'ChurchAttendance.WEEKLY'
  { value: "WEEKLY", label: "Weekly", emoji: "🙌" },
  { value: "BIWEEKLY", label: "Bi-weekly", emoji: "🙏" },
  { value: "MONTHLY", label: "Monthly", emoji: "🗓️" },
  { value: "OCCASIONALLY", label: "Occasionally", emoji: "⛪" },
  { value: "RARELY", label: "Rarely", emoji: "🤔" },
];

const relationshipGoalsOptions = [
  // FIXED: Using string literals instead of 'RelationshipGoals.MARRIAGE_MINDED'
  { value: "MARRIAGE_MINDED", label: "Marriage Minded", emoji: "💍" },
  { value: "RELATIONSHIP", label: "Relationship", emoji: "❤️" },
  { value: "FRIENDSHIP", label: "Friendship", emoji: "🤝" },
];

const denominationOptions = [
  "BAPTIST",
  "METHODIST",
  "PRESBYTERIAN",
  "PENTECOSTAL",
  "CATHOLIC",
  "ORTHODOX",
  "ANGLICAN",
  "LUTHERAN",
  "ASSEMBLIES_OF_GOD",
  "SEVENTH_DAY_ADVENTIST",
  "OTHER",
];

// Re-defining the component as a functional component with explicit type
const PartnerPreferencesSlide: React.FC<PartnerPreferencesSlideProps> = ({
  onboardingData,
  setOnboardingData,
  isVisible,
}) => {
  if (!isVisible) return null;

  const handleMultiSelect = (
    name:
      | "preferredFaithJourney"
      | "preferredChurchAttendance"
      | "preferredRelationshipGoals"
      | "preferredDenomination",
    value: string
  ) => {
    setOnboardingData((prev) => {
      if (name === "preferredDenomination") {
        // Store as a single string (toggle off if same value)
        return {
          ...prev,
          preferredDenomination:
            prev.preferredDenomination === value ? "" : value,
        };
      } else {
        // Handle multi-selects as arrays (with type assertion for safety)
        const currentList = (prev[name] || []) as string[];
        const newList = currentList.includes(value)
          ? currentList.filter((item) => item !== value)
          : [...currentList, value];
        return { ...prev, [name]: newList };
      }
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">
          What are you looking for? 🧐
        </h2>
        <p className="text-gray-400">
          Describe what you&apos;d like to see in a partner.
        </p>
      </div>

      {/* Preferred Faith Journey */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">
          Their ideal faith journey?
        </h3>
        <div className="flex flex-wrap gap-2">
          {faithJourneyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                handleMultiSelect("preferredFaithJourney", option.value)
              }
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredFaithJourney?.includes(
                  option.value as any
                )
                  ? "bg-pink-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Church Attendance */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">
          How often should they attend church?
        </h3>
        <div className="flex flex-wrap gap-2">
          {churchAttendanceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                handleMultiSelect("preferredChurchAttendance", option.value)
              }
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredChurchAttendance?.includes(
                  option.value as any
                )
                  ? "bg-pink-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Relationship Goals */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">
          What kind of relationship are they seeking?
        </h3>
        <div className="flex flex-wrap gap-2">
          {relationshipGoalsOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                handleMultiSelect("preferredRelationshipGoals", option.value)
              }
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredRelationshipGoals?.includes(
                  option.value as any
                )
                  ? "bg-pink-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Denominations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">
          Any denomination preferences?
        </h3>
        <div className="flex flex-wrap gap-2">
          {denominationOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleMultiSelect("preferredDenomination", option)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredDenomination === option
                  ? "bg-pink-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {option.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PartnerPreferencesSlide;
