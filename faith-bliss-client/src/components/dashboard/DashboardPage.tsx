/* eslint-disable no-irregular-whitespace */
// src/components/dashboard/DashboardPage.tsx (FINAL, CORRECTED VERSION)

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HeartBeatLoader } from "@/components/HeartBeatLoader";
import { useToast } from "@/contexts/ToastContext";
import { DesktopLayout } from "@/components/dashboard/DesktopLayout";
import { MobileLayout } from "@/components/dashboard/MobileLayout";
import { ProfileDisplay } from "@/components/dashboard/ProfileDisplay";
import { OverlayPanels } from "@/components/dashboard/OverlayPanels";
import { insertScrollbarStyles } from "@/components/dashboard/styles";
import {
  usePotentialMatches,
  useMatching,
  useUserProfile,
  useAllUsers,
} from "@/hooks/useAPI";

import { API, type User } from "@/services/api";

// Insert scrollbar styles
insertScrollbarStyles();

export const DashboardPage = ({ user: activeUser }: { user: User }) => {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [filteredProfiles, setFilteredProfiles] = useState<User[] | null>(null);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false); // Fetch real potential matches from backend

  const {
    data: profiles,
    loading: matchesLoading,
    error: matchesError,
    refetch,
  } = usePotentialMatches();

  const {
    data: allUsersResponse,
    loading: allUsersLoading,
    error: allUsersError,
  } = useAllUsers({ limit: 20 });

  const allUsers = allUsersResponse?.users; // Note: userProfile is now fetching the currently logged-in user's *latest* profile data
  const { data: userProfile, loading: userLoading } = useUserProfile();

  const { likeUser, passUser } = useMatching(); // Use the data from useUserProfile if available, otherwise use the prop

  const currentUserData = userProfile || activeUser;
  const userName = currentUserData.name || "User";
  const userImage = currentUserData.profilePhoto1 || undefined; // Uses profilePhoto1 from the User interface

  const activeProfiles = useMemo(() => {
    // Function to check for valid ID
    // Note: Filters out any null/undefined entries AND entries missing 'id'/'_id'
    const hasValidId = (p: User) => p && (p.id || p.id);

    if (filteredProfiles && filteredProfiles.length > 0) {
      // Filter filtered results for valid IDs
      return filteredProfiles.filter(hasValidId);
    }

    // Filter potential matches/all users for valid IDs
    const potentialMatches =
      profiles && profiles.length > 0 ? profiles : allUsers;
    return potentialMatches?.filter(hasValidId) || [];
  }, [profiles, allUsers, filteredProfiles]);

  useEffect(() => {
    setCurrentProfileIndex(0);
  }, [filteredProfiles, activeProfiles]); // Cleanup on unmount

  useEffect(() => {
    return () => {
      setFilteredProfiles(null);
    };
  }, []); // Show loading state while fetching matches or refreshing the token.

  if (matchesLoading || userLoading || allUsersLoading) {
    return <HeartBeatLoader message="Preparing your matches..." />;
  } // Handle error state for profiles

  if (matchesError || allUsersError) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
                       {" "}
        <div className="text-center p-8">
                             {" "}
          <p className="text-red-400 mb-4">
            Failed to load profiles: {matchesError || allUsersError}
          </p>
                             {" "}
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
                                    Try Again                    {" "}
          </button>
                         {" "}
        </div>
                   {" "}
      </div>
    );
  } // Handle no profiles found

  if (!activeProfiles || activeProfiles.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
                       {" "}
        <div className="text-center p-8">
                             {" "}
          <p className="text-gray-400 mb-4">
            No profiles found matching your criteria.
          </p>
                             {" "}
          <button
            onClick={() => {
              setFilteredProfiles(null);
              refetch();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
                                    Reset Filters & Try Again                  
             {" "}
          </button>
                         {" "}
        </div>
                   {" "}
      </div>
    );
  } // Use a safe, non-asserted way to define the current profile

  const currentProfile = activeProfiles
    ? activeProfiles[currentProfileIndex]
    : undefined;

  console.log(activeProfiles);

  const goToNextProfile = () => {
    if (!activeProfiles) return;
    if (currentProfileIndex < activeProfiles.length - 1) {
      setCurrentProfileIndex((prev) => prev + 1);
    } else {
      if (filteredProfiles) {
        showInfo("End of filtered results.");
      } else {
        refetch();
        setCurrentProfileIndex(0);
      }
    }
  };

  const handleLike = async () => {
    // 🚨 CRITICAL FIX: Use currentProfile?.id OR currentProfile?._id
    const userIdToLike = currentProfile?.id || currentProfile?._id;
    if (!userIdToLike) {
      console.warn("No user ID found to like. Skipping API call.");
      goToNextProfile(); // Move to the next profile placeholder
      return;
    }
    try {
      // Note: userIdToLike might be an ObjectId object, but JS will convert it to a string for the API call.
      await likeUser(userIdToLike);
      console.log(`Liked profile ${userIdToLike}`);
      goToNextProfile();
    } catch (error) {
      console.error("Failed to like user:", error);
    }
  };

  const handlePass = async () => {
    // 🚨 CRITICAL FIX: Use currentProfile?.id OR currentProfile?._id
    const userIdToPass = currentProfile?.id || currentProfile?._id;
    if (!userIdToPass) {
      console.warn("No user ID found to pass. Skipping API call.");
      goToNextProfile(); // Move to the next profile placeholder
      return;
    }
    try {
      await passUser(userIdToPass);
      console.log(`Passed on profile ${userIdToPass}`);
      goToNextProfile();
    } catch (error) {
      console.error("Failed to pass user:", error);
      goToNextProfile(); // Always move on even if API fails
    }
  };

  const handleMessage = () => {
    // 🚨 FIX: Safely check for required data using fallback
    const profileId = currentProfile?.id || currentProfile?._id;
    if (profileId && currentProfile?.name) {
      navigate(
        `/messages?profileId=${profileId}&profileName=${encodeURIComponent(
          currentProfile.name
        )}`
      );
    }
  };

  const handleApplyFilters = async (filters: any) => {
    setIsLoadingFilters(true);
    try {
      const results = await API.Discovery.filterProfiles(filters);
      setFilteredProfiles(results);
      showSuccess("Filters applied!");
    } catch (error) {
      console.error("Failed to apply filters:", error);
    } finally {
      setIsLoadingFilters(false);
    }
  };

  return (
    <div className=" bg-linear-to-br flex-1 flex flex-col  from-gray-900 via-gray-900 to-gray-800 text-white  no-horizontal-scroll  dashboard-main">
                 {" "}
      {isLoadingFilters && <HeartBeatLoader message="Applying filters..." />}   
                          {/* Desktop Layout */}           {" "}
      <DesktopLayout
        userName={userName}
        userImage={userImage}
        user={currentUserData}
        showFilters={showFilters}
        showSidePanel={showSidePanel}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleSidePanel={() => setShowSidePanel(!showSidePanel)}
      >
                       {" "}
        <ProfileDisplay
          activeProfiles={activeProfiles}
          onStartOver={() => setCurrentProfileIndex(0)}
          onGoBack={() =>
            setCurrentProfileIndex(Math.max(0, currentProfileIndex - 1))
          }
          onLike={handleLike}
          onPass={handlePass}
          onMessage={handleMessage}
        />
                   {" "}
      </DesktopLayout>
                  {/* Mobile Layout */}           {" "}
      <MobileLayout
        userName={userName}
        userImage={userImage}
        user={currentUserData}
        showFilters={showFilters}
        showSidePanel={showSidePanel}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleSidePanel={() => setShowSidePanel(!showSidePanel)}
      >
                       {" "}
        <ProfileDisplay
          activeProfiles={activeProfiles}
          onStartOver={() => setCurrentProfileIndex(0)}
          onGoBack={() =>
            setCurrentProfileIndex(Math.max(0, currentProfileIndex - 1))
          }
          onLike={handleLike}
          onPass={handlePass}
          onMessage={handleMessage}
        />
                   {" "}
      </MobileLayout>
                  {/* Overlay Panels */}           {" "}
      <OverlayPanels
        showFilters={showFilters}
        showSidePanel={showSidePanel}
        userName={userName}
        userImage={userImage}
        user={currentUserData}
        onCloseFilters={() => setShowFilters(false)}
        onCloseSidePanel={() => setShowSidePanel(false)}
        onApplyFilters={handleApplyFilters}
      />
             {" "}
    </div>
  );
};
