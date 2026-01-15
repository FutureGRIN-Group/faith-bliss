/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Messages.tsx

import {
  useState,
  useRef,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// 1. IMPORT TYPES
import type {
  ConversationSummary,
  ConversationMessagesResponse,
  Message,
} from "@/types/chat";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  MessageCircle,
  ArrowLeft,
  Search,
  Send,
  Phone,
  Video,
  Smile,
  Paperclip,
  Info,
  Check,
  CheckCheck,
  Users,
  Heart,
  ChevronLeft,
} from "lucide-react";

// Assuming these imports are correct for your Vite project structure
import { useConversations, useConversationMessages } from "@/hooks/useAPI";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useSession } from "@/hooks/useSession";
import { API } from "@/services/api";
import { HeartBeatLoader } from "@/components/HeartBeatLoader";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the Session and Image props interfaces
interface SessionData {
  user: {
    id: string;
    name: string;
  };
}

interface SessionHook {
  data: SessionData | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}

// Utility to parse URL search parameters from useLocation
const useViteSearchParams = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

// Custom Image Component
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
}: OptimizedImageProps) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={className}
    loading="lazy"
  />
);

const MessagesContent = () => {
  const searchParams = useViteSearchParams();
  const didAutoSelect = useRef(false);
  const profileIdParam = searchParams.get("profileId");
  const profileNameParam = searchParams.get("profileName");
  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = useState<string | null>(
    profileIdParam || null
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastRefetchedMatchId = useRef<string | null>(null);

  const { data: session } = useSession() as SessionHook;
  const currentUserId = session?.user?.id;

  // Use a local state for messages to allow real-time updates without immediate refetch
  const [localMessagesData, setLocalMessagesData] =
    useState<ConversationMessagesResponse | null>(null);

  // Fetch messages for selected conversation, and update local state
  const {
    data: fetchedMessages,
    loading: conversationLoading,
    refetch: refetchMessages,
  } = useConversationMessages(selectedChat || "", profileIdParam || "") as {
    data: ConversationMessagesResponse | null;
    loading: boolean;
    refetch: () => void;
  };

  // Sync fetched messages with local state
  useEffect(() => {
    setLocalMessagesData(fetchedMessages);
  }, [fetchedMessages]);

  // Fetch raw conversations data from backend
  const {
    data: rawConversations,
    loading,
    error,
    refetch,
  } = useConversations() as {
    data: ConversationSummary[] | null;
    loading: boolean;
    error: any;
    refetch: () => void;
  };

  const webSocketService = useWebSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const realConversations: ConversationSummary[] = Array.isArray(
    rawConversations
  )
    ? rawConversations
    : [];

  const currentConversation: ConversationSummary | null = useMemo(() => {
    const found = realConversations.find((conv) => conv.id === selectedChat);
    if (found) return found;

    // Handle virtual conversation case (new chat from profileIdParam)
    if (profileIdParam && profileNameParam && selectedChat === profileIdParam) {
      return {
        id: profileIdParam,
        otherUser: {
          id: profileIdParam,
          name: profileNameParam,
          profilePhoto1: "/default-avatar.png",
        },
        lastMessage: null,
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      } as ConversationSummary;
    }

    return null;
  }, [selectedChat, realConversations, profileIdParam, profileNameParam]);

  // 1. Join/Leave WebSocket Room
  useEffect(() => {
    if (webSocketService && selectedChat) {
      webSocketService.joinMatch(selectedChat);

      return () => {
        webSocketService.leaveMatch(selectedChat);
      };
    }
  }, [selectedChat, webSocketService]);

  // 2. Real-time Message Listener (with optimistic message replacement logic)
  const handleNewMessage = useCallback(
    (message: Message) => {
      const matchId = message.matchId;

      setLocalMessagesData((prev) => {
        if (!prev) return null;

        // Only proceed if the message belongs to the current chat
        if (prev.match.id === matchId) {
          // Find if an optimistic message with the same content exists
          const tempIndex = prev.messages.findIndex(
            (m) =>
              m.content === message.content &&
              m.senderId === message.senderId &&
              m.id.startsWith("temp-")
          );

          let newMessages = [...prev.messages];

          if (tempIndex !== -1) {
            // Replace the optimistic (temporary) message with the real message
            newMessages[tempIndex] = message;
          } else if (!newMessages.some((m) => m.id === message.id)) {
            // Add the real message only if it's not already in the list
            newMessages = [...newMessages, message];
          } else {
            // Message already exists
            return prev;
          }

          return {
            ...prev,
            messages: newMessages,
          };
        }

        // If this message is for a new chat (virtual match) that just became real...
        if (
          matchId &&
          !realConversations.find((conv) => conv.id === matchId) &&
          lastRefetchedMatchId.current !== matchId
        ) {
          refetch(); // Refetch conversation list to include the new match
          lastRefetchedMatchId.current = matchId;
        }

        return prev;
      });

      setTimeout(scrollToBottom, 50);
    },
    [realConversations, refetch, selectedChat]
  );

  useEffect(() => {
    if (webSocketService) {
      webSocketService.onNewMessage(handleNewMessage);
      // Remove listener on cleanup
      return () => {
        webSocketService.off("newMessage", handleNewMessage);
      };
    }
  }, [webSocketService, handleNewMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (localMessagesData) {
      scrollToBottom();
    }
  }, [localMessagesData?.messages.length]);

  const handleSendMessage = async () => {
    // --- DEBUGGING START ---
    console.log("handleSendMessage called.");
    // --- DEBUGGING END ---

    if (
      newMessage.trim() &&
      currentConversation &&
      webSocketService &&
      currentUserId
    ) {
      // --- DEBUGGING START ---
      console.log("All conditions passed. Attempting to send message...");
      // --- DEBUGGING END ---

      try {
        let actualMatchId = currentConversation.id;
        const messageContent = newMessage.trim();

        // If it's a virtual conversation (new chat), create a match first
        if (profileIdParam && currentConversation.id === profileIdParam) {
          const createMatchResponse = await API.Match.createMatch(
            profileIdParam
          );
          actualMatchId = createMatchResponse.match.id;
          // Set the local state to the new real match ID
          setSelectedChat(actualMatchId);
        }

        // --- OPTIMISTIC MESSAGE UPDATE ---
        const tempMessage: Message = {
          id: `temp-${Date.now()}-${Math.random()}`,
          senderId: currentUserId,
          // FIX: Added receiverId, required by the Message interface
          receiverId: currentConversation.otherUser.id,
          content: messageContent,
          createdAt: new Date().toISOString(),
          isRead: false,
          matchId: actualMatchId,
          type: "TEXT",
        };

        setLocalMessagesData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, tempMessage],
          };
        });
        // --- END OPTIMISTIC UPDATE ---

        // 1. Send message via WebSocket using the actualMatchId
        webSocketService.sendMessage(actualMatchId, messageContent);

        // 2. Cleanup and scroll
        setNewMessage("");
        setTimeout(scrollToBottom, 50);

        // 3. Handle conversation list refetch if a new match was created
        if (actualMatchId !== currentConversation.id) {
          refetchMessages(); // Fetch the match details + existing messages (if any)
          refetch(); // Refetch conversation list
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else {
      // --- DEBUGGING START ---
      console.warn("handleSendMessage conditions failed:", {
        message: newMessage.trim().length > 0, // Is the message not empty?
        conversation: !!currentConversation, // Is a conversation selected?
        socket: !!webSocketService, // Is the WebSocket service initialized?
        user: !!currentUserId, // Is the current user ID available?
      });
      // --- DEBUGGING END ---
    }
  };

  const handleSelectChat = (id: string) => {
    setSelectedChat(id);
  };

  // Auto select logic
  useEffect(() => {
    if (realConversations.length === 0) return;

    if (profileIdParam && !didAutoSelect.current) {
      const found = realConversations.find(
        (conv) => conv.otherUser?.id === profileIdParam
      );
      if (found && selectedChat !== found.id) {
        setSelectedChat(found.id);
        didAutoSelect.current = true;
      } else if (!found && selectedChat === profileIdParam) {
        didAutoSelect.current = true;
      }
    } else if (!selectedChat && !didAutoSelect.current) {
      setSelectedChat(realConversations[0]?.id);
      didAutoSelect.current = true;
    }
  }, [realConversations, profileIdParam, selectedChat]);

  // Show loading state
  // if (loading) {
  //   return <HeartBeatLoader message="Loading your conversations..." />;
  // }

  // Handle error state
  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-white flex items-center justify-center">
  //       <div className="text-center p-8">
  //         <p className="text-red-600 mb-4">
  //           Failed to load conversations: {error.toString()}
  //         </p>
  //         <button
  //           onClick={() => refetch()}
  //           className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
  //         >
  //           Try Again
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // Show no conversations state
  // if (realConversations.length === 0 && !profileIdParam) {
  //   return (
  //     <div className="min-h-[87vh] bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
  //       <div className="text-center p-8 flex flex-col gap-3 items-center">
  //         <MessageCircle className="w-20 h-20 text-pink-500 mx-auto mb-4" />
  //         <h2 className="text-2xl font-bold mb-2">No Conversations Yet</h2>
  //         <p className="text-gray-400 mb-4">
  //           Start matching with people to begin new conversations!
  //         </p>
  //         <Link
  //           to="/dashboard"
  //           className="px-6 py-3 w-3/4 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
  //         >
  //           Find Matches
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  const filteredConversations = realConversations.filter((conv) => {
    const matchedUser = conv.otherUser;
    return matchedUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!currentConversation && selectedChat) {
    return <HeartBeatLoader message="Initializing chat..." />;
  }

  return (
    <div className="px-7 py-3 bg-linear-to-br from-gray-900 flex flex-col gap-10 via-gray-900 to-gray-800 text-white overflow-x-hidden pb-20 no-horizontal-scroll dashboard-main">
      <div className="flex items-center gap-5">
        <div
          className="cursor-pointer text-gray-400"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={25} />
        </div>
        <InputGroup className="h-14 rounded-xl">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex flex-col gap-7">
        <h3 className="text-xl font-semibold text-gray-400  tracking-wider">
          Activities
        </h3>
        <div className=" flex gap-3 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="flex text-gray-400 flex-col gap-3 items-center">
              <Avatar className="size-20" key={index}>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>Emma</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-7">
        <h3 className="text-xl font-semibold text-gray-400  tracking-wider">
          Messages
        </h3>
        <div className="flex flex-col gap-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Link key={index} to={`/messages/conversation/${index}`}>
              <div
                className="rounded-xl  hover:bg-white/10 transition-colors duration-300 min-h-20 items-center flex gap-2"
                key={index}
              >
                <Avatar className="size-16">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className=" gap-2  flex-1 p-2 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-lg">Emelie</h4>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-base text-gray-300">
                      okay, see you then
                    </p>
                    <div className="rounded-full text-xs bg-accent-400 size-6 grid place-items-center">
                      2
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const MessagesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-white">Loading messages...</div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
};

// Final component for export, wrapped in the protective component
export default function ProtectedMessages() {
  return (
    <ProtectedRoute>
      <MessagesPage />
    </ProtectedRoute>
  );
}
