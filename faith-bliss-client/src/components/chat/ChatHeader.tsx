import { ChevronLeft, EllipsisVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { realtimeDB } from "@/firebase/config";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

interface Status {
  lastChanged: number;
  state: "online" | "offline";
}

export default function ChatHeader({
  avatarUrl,
  name,
  otherUserId,
}: {
  avatarUrl: string;
  name: string;
  otherUserId: string;
}) {
  const navigate = useNavigate();
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("");

  const [onlineStatus, setOnlineStatus] = useState<Status>({
    lastChanged: 0,
    state: "offline",
  });

  // Query Online Status Directly from Real Time Database
  // TODO - Reimplement Presence to be synced with firestore and be queried directly from firestore and not RTDB

  const otherUserStatusDatabaseRef = ref(realtimeDB, "status/" + otherUserId);

  useEffect(() => {
    const listener = (snapshot: DataSnapshot) => {
      const otherUserStatus = snapshot.val() as Status;
      setOnlineStatus(otherUserStatus);
    };

    onValue(otherUserStatusDatabaseRef, listener);
  }, []);

  return (
    <div className=" h-[11vh] border-b border-gray-700 p-5 shadow-lg flex justify-between items-center">
      <div className="flex items-center gap-7">
        <div onClick={() => navigate("/messages")}>
          <ChevronLeft size={27} />
        </div>
        <Avatar className="size-14">
          <AvatarImage src={avatarUrl} className="object-cover" />
          <AvatarFallback className="text-gray-400 text-xl bg-inherit border-2 border-gray-400 ">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-semibold">
            {name.split(" ").slice(0, 2).join(" ")}
          </span>
          <div className="text-sm text-gray-400">
            {onlineStatus.state === "online" ? (
              <span className="text-accent-400">Online</span>
            ) : (
              <span>
                Last Seen{" "}
                {new Date(onlineStatus.lastChanged).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>
      </div>
      <div>
        <EllipsisVertical size={27} />
      </div>
    </div>
  );
}
