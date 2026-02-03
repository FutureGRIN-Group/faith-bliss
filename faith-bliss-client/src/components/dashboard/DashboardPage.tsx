/* eslint-disable no-irregular-whitespace */
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
import StoriesRail from "@/components/stories/StoriesRail";

import {
  usePotentialMatches,
  useMatching,
  useUserProfile,
  useAllUsers,
} from "@/hooks/useAPI";

import { API, type User } from "@/services/api";

insertScrollbarStyles();

export const DashboardPage = ({ user: activeUser }: { user: User }) => {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useToast();

  const [showFilters, setShowFilters] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [filteredProfiles, setFilteredProfiles] = useState<User[] | null>(null);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);

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

  const allUsers = allUsersResponse?.users;

  const { data: userProfile, loading: userLoading } = useUserProfile();
  const { likeUser, passUser } = useMatching();

  const currentUserData = userProfile || activeUser;
  const userName = currentUserData.name || "User";
  const userImage = currentUserData.profilePhoto1 || undefined;

  const activeProfiles = useMemo(() => {
    const hasValidId = (p: User) => Boolean(p && (p.id || p._id));

    if (filteredProfiles && filteredProfiles.length > 0) {
      return filteredProfiles.filter(hasValidId);
    }

    const source = profiles?.length ? profiles : allUsers;
    return source?.filter(hasValidId) || [];
  }, [profiles, allUsers, filteredProfiles]);

  useEffect(() => {
    setCurrentProfileIndex(0);
  }, [filteredProfiles, activeProfiles]);

  useEffect(() => {
    return () => setFilteredProfiles(null);
  }, []);

  if (matchesLoading || userLoading || allUsersLoading) {
    return <HeartBeatLoader message="Preparing your matches..." />;
  }

  if (matchesError || allUsersError) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-400 mb-4">
            Failed to load profiles: {matchesError || allUsersError}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (activeProfiles.length === 0) {
    return (
      <div className="min-h-[87vh] bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-gray-400 mb-4">
            No profiles found matching your criteria.
          </p>
          <button
            onClick={() => {
              setFilteredProfiles(null);
              refetch();
            }}
            className="px-4 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Reset Filters & Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = activeProfiles[currentProfileIndex];

  const goToNextProfile = () => {
    if (currentProfileIndex < activeProfiles.length - 1) {
      setCurrentProfileIndex((prev) => prev + 1);
    } else {
      filteredProfiles ? showInfo("End of filtered results.") : refetch();
      setCurrentProfileIndex(0);
    }
  };

  const handleLike = async () => {
    const id = currentProfile?.id || currentProfile?._id;
    if (!id) return goToNextProfile();

    try {
      await likeUser(id);
      goToNextProfile();
    } catch (error) {
      console.error("Failed to like user:", error);
    }
  };

  const handlePass = async () => {
    const id = currentProfile?.id || currentProfile?._id;
    if (!id) return goToNextProfile();

    try {
      await passUser(id);
    } catch (error) {
      console.error("Failed to pass user:", error);
    } finally {
      goToNextProfile();
    }
  };

  const handleMessage = () => {
    const id = currentProfile?.id || currentProfile?._id;
    if (id && currentProfile?.name) {
      navigate(`/messages/profile/${id}`);
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
    <div className="bg-linear-to-br flex-1 flex flex-col from-gray-900 via-gray-900 to-gray-800 text-white no-horizontal-scroll dashboard-main">
      {isLoadingFilters && <HeartBeatLoader message="Applying filters..." />}

      <DesktopLayout
        userName={userName}
        userImage={userImage}
        user={currentUserData}
        showFilters={showFilters}
        showSidePanel={showSidePanel}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleSidePanel={() => setShowSidePanel(!showSidePanel)}
      >
        <div className="mb-4">
          <StoriesRail />
        </div>

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
      </DesktopLayout>

      <MobileLayout>
        {/* <StoriesRail /> */}

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
      </MobileLayout>

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
    </div>
  );
};
