import { db } from "@/firebase/config";
import { convertFirestoreTimestampToDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";
import {
  collection,
  type DocumentData,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ChatContext({
  currentUser,
  conversationId,
}: {
  currentUser: string;
  conversationId: string;
}) {
  const [messages, setMessages] = useState<Array<DocumentData>>([]);
  useEffect(() => {
    if (!conversationId) return;
    // Query Object
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
    );
    // Subscribe to message Changes
    const unsubscribe = onSnapshot(q, (docs) => {
      setMessages(docs.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return () => unsubscribe();
  }, [conversationId]);

  return (
    <div className="max-h-[75vh]  overflow-y-auto flex flex-col gap-7 relative rounded-md mb-24 py-10 pb-5 px-5">
      {messages.map((doc) => {
        const message = doc as ChatMessage;

        // if sender Id is equal to userid, apply some css to align it to the right
        const isSentByCurrentUser = message.senderId === currentUser;

        // Render Message
        return (
          <div
            key={message.id}
            className={cn(
              "px-5 py-4 rounded-3xl max-w-[80%]",
              isSentByCurrentUser
                ? "self-end bg-accent-400 rounded-tr-none"
                : "self-start glass-effect rounded-tl-none",
            )}
          >
            <p className="leading-normal">{message.text}</p>
          </div>
        );
      })}
    </div>
  );
}
