import ChatContext from "@/components/chat/ChatContext";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import { HeartBeatLoader } from "@/components/HeartBeatLoader";
import { Button } from "@/components/ui/button";
import api from "@/services/axios";
import type { ConversationSummary } from "@/types/chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getAuth } from "firebase/auth";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Chat() {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;
  const currentUser = getAuth().currentUser?.uid;
  const navigate = useNavigate();

  // Fetch Conversation Object
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["conversation-by-id"],
    queryFn: async () => await api.get(`/api/conversations/${conversationId}`),
  });

  // Handle Chat Message send
  const { mutate: sendMessage } = useMutation({
    mutationFn: async (text: string) => {
      await api.post("/api/messages", {
        conversationId,
        text,
      });
    },
    onError(err) {
      const error = err as AxiosError;
      toast.error(
        (error.response?.data as any)?.message || "Failed to send message",
      );
    },
  });

  const conversation = response?.data.data.conversation as ConversationSummary;

  if (isLoading) {
    return <HeartBeatLoader message="Loading Chat..." />;
  }

  if (!conversationId || conversationId === "null") {
    return (
      <div className="relative h-screen flex flex-col gap-7 justify-center gradient-effect items-center">
        <div
          onClick={() => navigate("/dashboard")}
          className="absolute rounded-full text-gray-400 top-4 left-4 p-5"
        >
          <ChevronLeft size={27} />
        </div>
        <div className="size-16 rounded-full bg-accent-600 flex items-center justify-center">
          <RefreshCw className="size-7 text-white" />
        </div>
        <span className="text-gray-406 text-xl font-semibold">
          Chat Initialization Failed
        </span>
        <Button onClick={() => refetch()} className="h-12 w-1/3 bg-accent-600">
          Try Again
        </Button>
      </div>
    );
  }

  // Extract other participant state
  const otherParticipantId = conversation.participants.find(
    (participant) => participant !== currentUser,
  );
  const { avatarUrl, name } =
    conversation.readState[otherParticipantId as string];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 flex flex-col">
      <ChatHeader avatarUrl={avatarUrl} name={name} />
      <div className=" pr-0 pt-0 ">
        <ChatContext
          currentUser={currentUser as string}
          conversationId={conversationId as string}
        />
        <ChatInput handleInput={(value) => sendMessage(value)} />
      </div>
    </div>
  );
}
