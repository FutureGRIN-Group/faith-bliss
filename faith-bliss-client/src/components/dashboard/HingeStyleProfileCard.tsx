import TinderCard from "react-tinder-card";
import type { User } from "@/services/api";
import { MessageCircle, X } from "lucide-react";
import { FaithBlissMark } from "@/components/branding/FaithBlissLogo";
import { NoProfilesState } from "./NoProfilesState";
import { createRef, useMemo, useRef, useState, type Ref } from "react";

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
  // Create a Ref for akk Cards
  const [currentIndex, setCurrentIndex] = useState(profiles.length - 1);
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo(
    () =>
      Array(profiles.length)
        .fill(0)
        .map((item) => createRef()),
    [profiles.length],
  ) as Ref<any>[];

  const onSwipe = (direction: string) => {
    if (direction === "left") {
      onPass();
    }
    if (direction === "right") {
      onLike();
    }
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (myIdentifier: string) => {
    console.log(myIdentifier + " left the screen");
  };

  function handleLike(dir: string) {
    onLike();
  }

  function handlePass(dir: string) {
    onPass();
  }

  function handleMessage() {
    onMessage();
  }

  if (profiles && profiles.length === 0) {
    return (
      <div className="h-[80vh]  flex items-center justify-center">
        <NoProfilesState />
      </div>
    );
  }
  console.log(profiles);

  return (
    <div className="h-[85vh] pb-5 px-5 justify-center    flex flex-col gap-10">
      <div className="h-4/6 relative">
        {profiles.map((profile, index) => (
          <div key={profile.id} className="inset-0 absolute  px-5">
            <TinderCard
              ref={childRefs[index]}
              onSwipe={onSwipe}
              className="h-full"
              onCardLeftScreen={() => onCardLeftScreen(profile.id)}
              preventSwipe={["up", "down"]}
            >
              <img
                src={profile.profilePhoto1}
                loading="lazy"
                alt={profile.name}
                className="size-full object-cover rounded-4xl"
              />
              <div className="flex justify-center bg-black/15 flex-col gap-1 px-5 absolute bottom-0 rounded-b-4xl  h-24 backdrop-blur-md left-0 right-0">
                <span className=" text-white  text-3xl font-semibold">
                  {profile.name.split(" ").slice(0, 2).join(" ")}
                </span>
                <span>{profile.bio}</span>
              </div>
            </TinderCard>
          </div>
        ))}
      </div>
      <div className="flex   w-full items-center justify-evenly  h-1/5">
        <div
          onClick={() => handlePass("left")}
          className="bg-white text-warning-500 hover:scale-110 transition-transform duration-300 rounded-full size-20 grid place-items-center"
        >
          <X size={45} />
        </div>
        <div
          onClick={() => handleLike("right")}
          className="bg-error-500 hover:scale-110 transition-transform duration-300 rounded-full size-28 grid place-items-center"
        >
          <FaithBlissMark className="w-14 h-14 max-w-[3.75rem]" alt="Like" />
        </div>
        <div
          onClick={handleMessage}
          className="bg-white text-accent-500 hover:scale-110 transition-transform duration-300  rounded-full size-20 grid place-items-center"
        >
          <MessageCircle size={40} />
        </div>
      </div>
    </div>
  );
};
