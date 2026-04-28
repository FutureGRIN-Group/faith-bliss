/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Clock } from "lucide-react";
import { FaithBlissMark } from "@/components/branding/FaithBlissLogo";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { TopBar } from "../components/dashboard/TopBar";
import { useMatches } from "../hooks/useAPI";
import { HeartBeatLoader } from "../components/HeartBeatLoader";
import type { Match } from "../types/Match";
import MatchCard from "@/components/matches/MatchCard";

const MatchesPage = () => {
  const [activeTab, setActiveTab] = useState<"mutual" | "sent" | "received">(
    "mutual"
  );
  const navigate = useNavigate();

  const { mutual, sent, received, loading, error, refetch } = useMatches();

  // Normalize API response
  const [mutualMatches, setMutualMatches] = useState<Match[]>([]);
  const [sentRequests, setSentRequests] = useState<Match[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Match[]>([]);

  useEffect(() => {
    // Helper function to handle different API response structures (Array or { matches: Array })
    const normalize = (data: any): Match[] => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if ("matches" in data && Array.isArray(data.matches)) return data.matches;
      return [];
    };

    setMutualMatches(normalize(mutual));
    setSentRequests(normalize(sent));
    setReceivedRequests(normalize(received));

    console.log("🧠 Processed Matches", {
      mutualCount: normalize(mutual).length,
      sentCount: normalize(sent).length,
      receivedCount: normalize(received).length,
    });
  }, [mutual, sent, received]);

  if (loading) return <HeartBeatLoader message="Loading your matches..." />;

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
        <TopBar
          userName="User"
          title="Matches"
          showBackButton
          onBack={() => navigate("/dashboard")}
        />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center p-8">
            <p className="text-red-600 mb-4">Failed to load matches: {error}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderEmpty = (icon: ReactNode, title: string, subtitle: string) => (
    <div className="text-center col-span-2 py-16">
      <div className="bg-linear-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-8 max-w-md mx-auto">
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{subtitle}</p>
      </div>
    </div>
  );

  const activeList =
    activeTab === "mutual"
      ? mutualMatches
      : activeTab === "sent"
      ? sentRequests
      : receivedRequests;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white dashboard-main">
      {/* <TopBar userName="Believer" showBackButton onBack={() => navigate(-1)} /> */}

      <div className="py-5  px-5">
        <div className="max-w-4xl  mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Your Matches
            </h1>
            <p className="text-gray-400 text-lg">
              This is a list of people who have liked you and your matches.
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 mb-8">
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  key: "mutual",
                  label: "Mutual",
                  count: mutualMatches.length,
                  icon: <FaithBlissMark className="w-5 h-5" alt="" />,
                },
                {
                  key: "sent",
                  label: "Sent",
                  count: sentRequests.length,
                  icon: <Clock className="w-5 h-5" />,
                },
                {
                  key: "received",
                  label: "Received",
                  count: receivedRequests.length,
                  icon: <Users className="w-5 h-5" />,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`relative py-4 px-6 rounded-2xl transition-all duration-300 ${
                    activeTab === tab.key
                      ? "bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        activeTab === tab.key
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-5 pb-10"
            >
              {activeList.length > 0
                ? activeList.map((match: Match) => (
                    <MatchCard key={match.id} match={match} />
                  ))
                : activeTab === "mutual"
                ? renderEmpty(
                    <FaithBlissMark className="w-16 h-16" alt="" />,
                    "No mutual matches yet",
                    "Keep exploring to find your perfect match!"
                  )
                : activeTab === "sent"
                ? renderEmpty(
                    <Clock className="w-16 h-16 text-pink-400" />,
                    "No sent requests yet",
                    "You haven’t sent any requests yet."
                  )
                : renderEmpty(
                    <Users className="w-16 h-16 text-pink-400" />,
                    "No received requests yet",
                    "No one has sent you a request yet."
                  )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function ProtectedMatches() {
  return (
    <ProtectedRoute>
      <MatchesPage />
    </ProtectedRoute>
  );
}
