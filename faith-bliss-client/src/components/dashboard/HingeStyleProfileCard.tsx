/* eslint-disable no-irregular-whitespace */
// src/components/HingeStyleProfileCard.tsx (Vite/React Conversion - Corrected Link)

import { useState } from "react";
import { Link } from "react-router-dom";
import TinderCard from "react-tinder-card";

import type { User } from "@/services/api";
import { FloatingActionButtons } from "./FloatingActionButtons";
import { Heart, Star, X } from "lucide-react";

interface HingeStyleProfileCardProps {
  profiles: User[];
  onGoBack: () => void;
  onPass: () => void;
  onLike: () => void;
  onMessage: () => void;
}

export const HingeStyleProfileCard = ({
  profiles,
  onGoBack,
  onPass,
  onLike,
  onMessage,
}: HingeStyleProfileCardProps) => {
  // const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // const photos: string[] = [
  //   profile.profilePhoto1,
  //   profile.profilePhoto2,
  //   profile.profilePhoto3,
  // ].filter(Boolean) as string[];

  // if (photos.length === 0) {
  //   photos.push(
  //     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
  //   );
  // }

  // const nextPhoto = () =>
  //   setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  // const prevPhoto = () =>
  //   setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);

  // Safely get ID, prioritizing 'id', then '_id', defaulting to 'missing'
  // const profileId = profile.id || profile.id || "missing";

  const onSwipe = (direction: string) => {
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (myIdentifier: string) => {
    console.log(myIdentifier + " left the screen");
  };

  return (
    <div className="relative">
      {profiles.map((profile) => (
        <TinderCard
          key={profile.id}
          className="border bg-[#111827] border-white h-[75vh] rounded-2xl inset-0 absolute flex flex-col items-center justify-around "
          onSwipe={onSwipe}
          onCardLeftScreen={() => onCardLeftScreen(profile.id)}
          preventSwipe={["up", "down"]}
        >
          <div className="bg-orange-400 w-full h-5/6">hello</div>
          <div className="flex   w-full items-center justify-evenly  h-1/6">
            <div>
              <X size={30} />
            </div>
            <div className="bg-error rounded-full size-20 grid place-items-center">
              <Heart size={40} />
            </div>
            <div>
              <Star size={30} />
            </div>
          </div>
        </TinderCard>
      ))}
    </div>
  );
};
