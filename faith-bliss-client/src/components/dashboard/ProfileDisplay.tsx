/* eslint-disable no-irregular-whitespace */
import { HingeStyleProfileCard } from "./HingeStyleProfileCard";
import { NoProfilesState } from "./NoProfilesState";
import type { User } from "@/services/api";

interface ProfileDisplayProps {
  activeProfiles: User[] | null | undefined;
  onStartOver: () => void;
  onGoBack: () => void;
  onLike: () => void;
  onPass: () => void;
  onMessage: () => void;
}

export const ProfileDisplay = ({
  activeProfiles,
  onStartOver,
  onGoBack,
  onLike,
  onPass,
  onMessage,
}: ProfileDisplayProps) => {
  // Check if active profiles array is empty or not
  if (!activeProfiles || activeProfiles.length === 0) {
    // Log an error if the object exists but is malformed
    if (activeProfiles) {
      console.error(
        "ProfileDisplay: activeProfiles array exists but is empty. Skipping card render."
      );
    }
    // Fall back to the "No Profiles" state, which will eventually be replaced
    // by the logic in DashboardPage advancing to the next profile.
    return <NoProfilesState onStartOver={onStartOver} />;
  }

  return (
    <>
           {" "}
      <HingeStyleProfileCard
        profiles={activeProfiles}
        onGoBack={onGoBack}
        onLike={onLike}
        onPass={onPass}
        onMessage={onMessage}
      />
         {" "}
    </>
  );
};
