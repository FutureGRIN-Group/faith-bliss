import type { Match } from "@/types/Match";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { FaithBlissMark } from "@/components/branding/FaithBlissLogo";
import { Separator } from "../ui/separator";

export default function MatchCard({ match }: { match: Match }) {
  // 👇 FIX: Use a unified user object for data access
  // Fallback logic: Use matchedUser if available, otherwise use the top-level match object
  const user = match.matchedUser || match;

  // Determine the profile link target ID
  // Prioritize matchedUserId if it exists, otherwise fall back to the top-level match ID
  const profileId = match.matchedUserId || match.id;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-72 relative  hover:bg-white/15 transition-all duration-300 group"
    >
      <div className=" rounded-2xl inset-0 absolute ">
        <img
          src={
            user.profilePhoto1 || "/default-avatar.png" // Use the unified 'user' object
          }
          alt={user.name || "User"}
          className="size-full object-cover rounded-2xl ring-pink-500/30"
        />
      </div>
      <div className="absolute  flex justify-evenly items-center left-0 right-0 bottom-0 h-1/5 rounded-b-2xl bg-black/20 backdrop-blur-md">
        <div>
          <X size={27} />
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center justify-center">
          <FaithBlissMark className="w-[27px] h-[27px]" alt="" />
        </div>
      </div>
      <div>{/* <h2>{user.name || "Unknown"}</h2> */}</div>
    </motion.div>
  );
}
