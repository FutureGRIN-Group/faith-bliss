import { HeartBeatLoader } from "@/components/HeartBeatLoader";
import { getConversationId } from "@/lib/utils";
import api from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";

export default function ConversationInitializer() {
  // Using ProfileId, check if conversation exists
  // If not, create a new conversation
  // If yes, redirect to the conversation
  const params = useParams<{ profileId: string }>();
  const profileId = params.profileId;
  const [errorShowed, setErrorShowed] = useState(false);
  const [newConversationId, setNewConversationId] = useState("");

  //  Try to retrieve Conversation Id using profileId
  const { data: conversationId, isLoading } = useQuery({
    queryKey: ["conversation-by-profileId"],
    queryFn: async () =>
      await getConversationId(profileId ?? "", errorShowed, (val) =>
        setErrorShowed(val)
      ),
  });

  //   Mutation Function that creates a new Conversation
  const { mutate: createConversation, isPending } = useMutation({
    mutationFn: async () =>
      await api.post("/api/conversations", {
        profileId,
      }),
    onSuccess: (data) => {
      setNewConversationId(data.data.conversationId);
    },
  });

  if (isLoading || isPending) {
    return <HeartBeatLoader message="Loading Chat..." />;
  }

  if (!conversationId) {
    // Create a new conversation
    createConversation();
    return <Navigate to={`/messages/conversation/${newConversationId}`} />;
  }
  return <Navigate to={`/messages/conversation/${conversationId}`} />;
}
