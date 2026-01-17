import ChatContext from "@/components/chat/ChatContext";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import api from "@/services/axios";
import type { ConversationSummary } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Chat() {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;
  const [input, setInput] = useState("");
  const currentUser = getAuth().currentUser?.uid;

  // Fetch Conversation Object
  const { data: response } = useQuery({
    queryKey: ["conversation-by-id"],
    queryFn: async () => await api.get(`/api/conversations/${conversationId}`),
  });
  const conversation = response?.data.data.conversation as ConversationSummary;

  // Extract other participant state
  const otherParticipantId = conversation.participants.find(
    (participant) => participant !== currentUser
  );
  const { avatarUrl, name } =
    conversation.readState[otherParticipantId as string];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 flex flex-col">
      <ChatHeader avatarUrl={avatarUrl} name={name} />
      <div className=" pr-0 pt-0 ">
        <ChatContext input={input} />
        <ChatInput handleInput={(value) => setInput(value)} />
      </div>
    </div>
  );
}
