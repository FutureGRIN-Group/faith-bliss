import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HeartBeatLoader } from "@/components/HeartBeatLoader";
import {
  ArrowLeft,
  X,
  MessageCircle,
  MapPin,
  Church,
  Music,
  Briefcase,
  Coffee,
  Search,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/services/api";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { FullScreenGallery } from "@/components/gallery/FullScreenGallery";
import { FaithBlissMark } from "@/components/branding/FaithBlissLogo";

const getProfilePhotos = (user: User): string[] => {
  const photos: string[] = [];
  if (user.profilePhoto1) photos.push(user.profilePhoto1);
  if (user.profilePhoto2) photos.push(user.profilePhoto2);
  if (user.profilePhoto3) photos.push(user.profilePhoto3);
  if (user.profilePhoto4) photos.push(user.profilePhoto4);
  if (user.profilePhoto5) photos.push(user.profilePhoto5);
  if (user.profilePhoto6) photos.push(user.profilePhoto6);
  return photos.filter(Boolean);
};

const ProfilePage = () => {
  const { id: profileId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserProfileById, user } = useAuth();

  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Fetch another user’s profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        console.error("No profile ID found in URL");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const userData = await getUserProfileById(profileId);
        setProfile(userData);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, getUserProfileById]);

  const handleMessage = () => {
    if (profile?.id) {
      navigate(
        `/messages?profileId=${profile.id}&profileName=${encodeURIComponent(
          profile.name
        )}`
      );
    }
  };

  const openGallery = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsGalleryOpen(true);
  };

  const handleLike = () => {
    console.log("Like", profile?.name);
    // Implement like logic
  };

  const handlePass = () => {
    navigate(-1);
  };

  if (loading) return <HeartBeatLoader message="Loading profile..." />;

  if (!profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">
            This user may not exist or the link is incorrect.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-full font-medium transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const photos = getProfilePhotos(profile);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-xl border-b border-gray-700/50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">
            {profile.name}'s Profile
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Photo Gallery Grid */}
        <GalleryGrid photos={photos} onPhotoClick={openGallery} />

        {/* Profile Details */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">
                {profile.name}, {profile.age}
              </h1>
              <div className="flex items-center space-x-2 text-gray-300 mt-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {typeof profile.location === "string"
                    ? profile.location
                    : (profile.location as any)?.address || "Not specified"}
                </span>
              </div>
            </div>
            {profile.bio && (
              <div className="bg-gray-800/50 rounded-2xl p-4">
                <h3 className="text-lg font-semibold mb-2">About Me</h3>
                <p className="text-gray-300">{profile.bio}</p>
              </div>
            )}
          </div>


          {/* Faith & Values */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Church className="w-6 h-6 text-blue-400" />
              <span>Faith & Values</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.faithJourney && (
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-300 mb-2">
                    Faith Journey
                  </h4>
                  <p className="text-gray-300">{profile.faithJourney}</p>
                </div>
              )}
              {profile.sundayActivity && (
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-300 mb-2">
                    Sunday Activity
                  </h4>
                  <p className="text-gray-300">{profile.sundayActivity}</p>
                </div>
              )}
               {profile.denomination && (
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-300 mb-2">
                    Denomination
                  </h4>
                  <p className="text-gray-300">{profile.denomination}</p>
                </div>
              )}
              {profile.favoriteVerse && (
                <div className="bg-gray-800/50 rounded-xl p-4 md:col-span-2">
                  <h4 className="font-semibold text-blue-300 mb-2">
                    Favorite Verse
                  </h4>
                  <p className="text-gray-300 italic">"{profile.favoriteVerse}"</p>
                </div>
              )}
            </div>
             {profile.values && profile.values.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Core Values</h4>
                    <div className="flex flex-wrap gap-2">
                        {profile.values.map(val => (
                            <span key={val} className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm border border-blue-500/20">
                                {val}
                            </span>
                        ))}
                    </div>
                </div>
              )}
          </div>

           {/* Work & Education */}
           <div className="space-y-4">
             <h2 className="text-2xl font-bold flex items-center space-x-2">
               <Briefcase className="w-6 h-6 text-green-400" />
               <span>Work & Education</span>
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(profile.profession || profile.company) && (
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="font-semibold text-green-300 mb-2">Work</h4>
                        <p className="text-gray-300">
                            {profile.profession} {profile.company && `at ${profile.company}`}
                        </p>
                    </div>
                )}
                 {(profile.educationLevel || profile.fieldOfStudy) && (
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="font-semibold text-green-300 mb-2">Education</h4>
                        <p className="text-gray-300">
                            {profile.educationLevel} {profile.fieldOfStudy && `in ${profile.fieldOfStudy}`}
                        </p>
                    </div>
                )}
             </div>
           </div>

           {/* Lifestyle */}
           <div className="space-y-4">
             <h2 className="text-2xl font-bold flex items-center space-x-2">
               <Coffee className="w-6 h-6 text-orange-400" />
               <span>Lifestyle</span>
             </h2>
             <div className="bg-gray-800/50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                 {profile.height && (
                     <div>
                         <h4 className="text-xs font-semibold text-orange-300 uppercase">Height</h4>
                         <p className="text-gray-300">{profile.height} cm</p>
                     </div>
                 )}
                  {profile.smoking && (
                     <div>
                         <h4 className="text-xs font-semibold text-orange-300 uppercase">Smoking</h4>
                         <p className="text-gray-300 capitalize">{profile.smoking.toLowerCase()}</p>
                     </div>
                 )}
                  {profile.drinking && (
                     <div>
                         <h4 className="text-xs font-semibold text-orange-300 uppercase">Drinking</h4>
                         <p className="text-gray-300 capitalize">{profile.drinking.toLowerCase()}</p>
                     </div>
                 )}
                  {profile.kids && (
                     <div>
                         <h4 className="text-xs font-semibold text-orange-300 uppercase">Kids</h4>
                         <p className="text-gray-300">{profile.kids}</p>
                     </div>
                 )}
             </div>
           </div>

           {/* Looking For */}
           {profile.lookingFor && profile.lookingFor.length > 0 && (
               <div className="space-y-4">
                   <h2 className="text-2xl font-bold flex items-center space-x-2">
                       <Search className="w-6 h-6 text-pink-400" />
                       <span>Looking For</span>
                   </h2>
                   <div className="flex flex-wrap gap-2">
                        {profile.lookingFor.map(item => (
                            <span key={item} className="px-3 py-1 bg-pink-500/10 text-pink-300 rounded-full text-sm border border-pink-500/20">
                                {item}
                            </span>
                        ))}
                   </div>
               </div>
           )}

          {/* Hobbies */}
          {profile.hobbies && profile.hobbies.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <Music className="w-6 h-6 text-purple-400" />
                <span>Interests & Hobbies</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {profile.hobbies.map((hobby, index) => (
                  <div
                    key={index}
                    className="bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {hobby}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {user?.id !== profile.id && (
          <div className="sticky bottom-0 bg-gray-900/90 backdrop-blur-xl border-t border-gray-700/50 p-4">
            <div className="flex items-center justify-center space-x-4 max-w-md mx-auto">
              <button
                onClick={() => navigate(-1)}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 p-4 rounded-full transition-all hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={handleMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Message</span>
              </button>

              <button
                onClick={() => console.log("Like", profile.name)}
                className="bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-400 p-4 rounded-full transition-all hover:scale-110"
              >
                <FaithBlissMark className="w-6 h-6" alt="Like" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Gallery Modal */}
      <FullScreenGallery
        isOpen={isGalleryOpen}
        initialIndex={selectedPhotoIndex}
        photos={photos}
        user={profile}
        onClose={() => setIsGalleryOpen(false)}
        onLike={handleLike}
        onPass={handlePass}
        onMessage={handleMessage}
      />
    </div>
  );
};

export default ProfilePage;
