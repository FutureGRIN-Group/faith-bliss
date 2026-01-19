import { ChevronLeft, EllipsisVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";

export default function ChatHeader({
  avatarUrl,
  name,
}: {
  avatarUrl: string;
  name: string;
}) {
  const navigate = useNavigate();
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("");

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
        <div className="flex flex-col">
          <span className="text-xl font-semibold">
            {name.split(" ").slice(0, 2).join(" ")}
          </span>
          <span className="text-sm text-gray-500">Online</span>
        </div>
      </div>
      <div>
        <EllipsisVertical size={27} />
      </div>
    </div>
  );
}
