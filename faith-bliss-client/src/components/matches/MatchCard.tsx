import type { Match } from "@/types/Match";
import { motion } from "framer-motion";
import { Church, Heart, MapPin, MessageCircle, User, X } from "lucide-react";
import { Link } from "react-router-dom";
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
        <div>
          <Heart size={27} className="fill-white" />
        </div>
      </div>
      <div>{/* <h2>{user.name || "Unknown"}</h2> */}</div>
    </motion.div>
  );
}

// <div className="flex items-center  gap-4 mb-4">
//           <div className="relative">
//             <img
//               src={
//                 user.profilePhoto1 || "/default-avatar.png" // Use the unified 'user' object
//               }
//               alt={user.name || "User"}
//               className="w-16 h-16 object-cover rounded-full ring-2 ring-pink-500/30"
//             />
//             <div
//               className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-900 ${
//                 user.isActive ? "bg-emerald-400" : "bg-gray-500"
//               }`}
//             />
//           </div>

//           <div className="flex-1">
//             <div className="flex items-center justify-between">
//               <h3 className="font-semibold text-white group-hover:text-pink-200 transition-colors">
//                 {user.name || "Unknown"}, {user.age ?? 0}
//               </h3>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
//                 <span className="text-sm font-medium text-emerald-400">
//                   95% Match
//                 </span>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 text-gray-300 text-sm mt-1">
//               <MapPin className="w-4 h-4" />
//               <span>{user.location || "Not specified"}</span>
//             </div>
//             <div className="flex items-center gap-2 text-gray-300 text-sm">
//               <Church className="w-4 h-4" />
//               <span>{user.denomination || "Not specified"}</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-3 mt-4">
//           <Link to={`/messages/${match.id}`} className="flex-1">
//             <button className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white py-3 rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 flex items-center justify-center gap-2 group">
//               <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
//               Message
//             </button>
//           </Link>
//           <Link to={`/profile/${profileId}`} className="flex-1">
//             <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 text-gray-300 hover:text-white py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group">
//               <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
//               View Profile
//             </button>
//           </Link>
//         </div>
