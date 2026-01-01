/* eslint-disable no-irregular-whitespace */
// src/components/TopBar.tsx (Vite/React Conversion)

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, Filter, Sparkles, ArrowLeft } from 'lucide-react';
// 🌟 VITE FIX 1: Use Link from react-router-dom
import { Link } from 'react-router-dom'; 
// import Image from 'next/image'; // 🌟 VITE FIX 2: Replaced with standard <img>
import { useUnreadCount } from '@/hooks/useAPI'; // Assuming this hook is non-Next.js compatible

interface TopBarProps {
  userName: string;
  userImage?: string;
  user?: any;
  showFilters?: boolean;
  showSidePanel?: boolean;
  onToggleFilters?: () => void;
  onToggleSidePanel?: () => void;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const TopBar = ({ 
  userName, 
  userImage,
  user,
  showFilters = false, 
  onToggleFilters, 
  onToggleSidePanel,
  title,
  showBackButton = false,
  onBack
}: TopBarProps) => {
  const displayImage = user?.profilePhotos?.photo1 || userImage || '/default-avatar.png';
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count || 0;

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 px-4 py-4 sticky top-0 z-50">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5"></div>
      
      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        {/* Left - Brand & Greeting */}
        <div className="flex items-center space-x-4">
          {/* Back Button or Mobile Hamburger Menu */}
          {showBackButton ? (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-2xl transition-all hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 text-gray-300" />
            </button>
          ) : (
            <button 
              onClick={onToggleSidePanel}
              className="p-2 hover:bg-white/10 rounded-2xl transition-all hover:scale-105 lg:hidden"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-gray-300 rounded-sm"></div>
                <div className="w-full h-0.5 bg-gray-300 rounded-sm"></div>
                <div className="w-full h-0.5 bg-gray-300 rounded-sm"></div>
              </div>
            </button>
          )}
          
          {/* 🌟 VITE FIX 3: Link 'to' instead of 'href' 🌟 */}
          <Link to="/dashboard" className="flex items-center space-x-4 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="bg-linear-to-r from-pink-500 to-purple-600 p-2 rounded-2xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {title || 'FaithBliss'}
              </h1>
              <p className="text-sm text-gray-400 hidden md:block">
                {title ? `Edit your profile, ${userName}` : `${userName} ✨`}
              </p>
            </div>
          </Link>
        </div>

        {/* Right - Action Icons */}
        <div className="flex items-center space-x-2">
          {/* 🌟 VITE FIX 4: Link 'to' instead of 'href' 🌟 */}
          <Link to="/notifications">
            <button className="relative p-3 hover:bg-white/10 rounded-2xl transition-all hover:scale-105 group">
              <Bell className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-linear-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{unreadCount}</span>
                </span>
              )}
            </button>
          </Link>
          
          {/* Mobile Profile Button */}
          <button 
            onClick={onToggleSidePanel}
            className="p-3 hover:bg-white/10 rounded-2xl transition-all hover:scale-105 group lg:hidden"
          >
            <div className="w-8 h-8 bg-linear-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              {displayImage ? (
                // 🌟 VITE FIX 5: Replace Next.js <Image> with standard <img>
                <img
                  src={displayImage}
                  alt={userName}
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </button>
          
          {onToggleFilters && (
            <button 
              onClick={onToggleFilters}
              className={`p-3 rounded-2xl transition-all hover:scale-105 ${
                showFilters 
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
                  : 'hover:bg-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <Filter className="w-6 h-6 transition-colors" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};