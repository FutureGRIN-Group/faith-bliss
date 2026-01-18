import { db } from "@/firebase/config";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";
import {
  collection,
  type DocumentData,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef } from "react";

export default function ChatContext({
  currentUser,
  conversationId,
  messages,
  updateMessages,
}: {
  updateMessages: (docs: Array<ChatMessage>) => void;
  messages: Array<DocumentData>;
  currentUser: string;
  conversationId: string;
}) {
  // const [messages, setMessages] = useState<Array<DocumentData>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!conversationId) return;
    // Query Object
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("createdAt", "asc"),
    );
    // Subscribe to message Changes
    const unsubscribe = onSnapshot(q, (docs) => {
      const newMessages = docs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Array<ChatMessage>;
      updateMessages(newMessages);
    });

    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    // Update Read state
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="max-h-[75vh] scroll-smooth  overflow-y-auto flex flex-col gap-7 relative rounded-md mb-24 py-10  px-5"
    >
      {messages.map((doc) => {
        const message = doc as ChatMessage;

        // if sender Id is equal to userid, apply some css to align it to the right
        const isSentByCurrentUser = message.senderId === currentUser;

        // Time Message was sent
        const createdAt = new Date(
          message.createdAt.seconds * 1000 +
            message.createdAt.nanoseconds / 1_000_000,
        ).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Render Message
        return (
          <div
            key={message.id}
            className={cn(
              "px-5 py-2 flex flex-col gap-1  rounded-2xl max-w-[80%] ",
              isSentByCurrentUser
                ? "self-end bg-accent-400 rounded-tr-none"
                : "self-start glass-effect rounded-tl-none",
            )}
          >
            <p className="leading-normal">{message.text}</p>
            <span className="text-[10px] text-gray-200 self-end">
              {createdAt}
            </span>
          </div>
        );
      })}
    </div>
  );
}
