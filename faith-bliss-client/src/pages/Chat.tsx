import ChatContext from "@/components/chat/ChatContext";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Chat() {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;
  const [input, setInput] = useState("");
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 flex flex-col">
      <ChatHeader />
      <div className=" pr-0 pt-0 ">
        <ChatContext input={input} />
        <ChatInput handleInput={(value) => setInput(value)} />
      </div>
    </div>
  );
}
