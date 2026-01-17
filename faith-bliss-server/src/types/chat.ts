// src/types/chat.ts (or src/types.ts, based on your project structure)

import { Timestamp } from "firebase-admin/firestore";

/**
 * Interface for a single message object.
 */
// Updated ConversationSummary interface
export interface ConversationSummary {
  id?: string;
  participants: string[];
  membersKey: string;
  type: "direct" | "group";

  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessage: {
    id: string;
    text: string;
    senderId: string;
    createdAt: Timestamp;
  };
  lastMessageAt: Timestamp;

  readState: {
    [userId: string]: {
      lastReadAt: Timestamp;
      unreadCount: number;
      muted: boolean;
      archived: boolean;
      avatarUrl: string;
      name: string;
    };
  };
}

export interface ChatMessage {
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  isRead: boolean;
  createdAt: Timestamp;
  editedAt?: Timestamp;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  sender: {
    id: string;
    name: string;
  };
}

/**
 * Interface for the response structure returned by useConversationMessages.
 */
export interface ConversationMessagesResponse {
  messages: Message[];
  match: { id: string }; // Minimal match info needed for refetch logic
  // Add other properties from your API response if needed
}

/**
 * Interface for a summary of a conversation (used in the sidebar list).
 */
// export interface ConversationSummary {
//   id: string; // match ID
//   otherUser: {
//     id: string;
//     name: string;
//     avatarUrl?: string;
//     profilePhoto1?: string; // Used in the component logic
//   };
//   lastMessage: { content: string; createdAt: string } | null;
//   unreadCount: number;
//   updatedAt: string;
// }

/**
 * Interface for a generic Notification object.
 */
export interface Notification {
  type: "profile_liked" | "new_match" | "other_types_as_they_are_added";
  message: string;
  senderId?: string;
  senderName?: string;
  matchId?: string;
  otherUser?: {
    id: string;
    name: string;
  };
}

/**
 * Interface for sending a typing event over WebSocket.
 */
export interface TypingEventSent {
  matchId: string;
  isTyping: boolean;
}

/**
 * Interface for receiving a typing event over WebSocket.
 */
export interface TypingEventReceived {
  userId: string;
  isTyping: boolean;
}
