/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useProfileStore } from '@/store/profileStore';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import PhotosSection from '@/components/profile/PhotosSection';
import BasicInfoSection from '@/components/profile/BasicInfoSection';
import PassionsSection from '@/components/profile/PassionsSection';
import FaithSection from '@/components/profile/FaithSection';
import SaveButton from '@/components/profile/SaveButton';

const ProfilePage: React.FC = () => {
  const { accessToken } = useAuth();
  const { 
    fetchProfile, 
    isLoading, 
    profile, 
    draft, 
    initDraft, 
    isSaving, 
    saveProfile, 
    message,
    clearMessage,
    uploadPhoto,
    removePhoto
  } = useProfileStore();

  const [activeSection, setActiveSection] = useState<'photos' | 'basics' | 'passions' | 'faith'>('photos');

  // Initial Fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Init draft when profile loads
  useEffect(() => {
    if (profile && !draft) {
      initDraft();
    }
  }, [profile, draft, initDraft]);

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(clearMessage, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  const handleSave = async () => {
    if (accessToken) {
      await saveProfile(accessToken);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (accessToken) {
        await uploadPhoto(file, accessToken);
    }
  };

  const handlePhotoRemove = async (index: number) => {
      if (accessToken) {
          await removePhoto(index, accessToken);
      }
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500" />
        <p className="ml-4 text-lg">Loading profile...</p>
      </div>
    );
  }

  // Use draft for rendering if available (for editing), fallback to profile
  // Actually, we should always render from draft when editing.
  // The store ensures draft is initialized.
  const displayData = draft || (profile as any);

  if (!displayData) {
      return null; // or error state
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white pb-20 no-horizontal-scroll dashboard-main">
      <ProfileHeader />
      <ProfileTabs activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="max-w-4xl mx-auto p-4 pb-20">
        {activeSection === 'photos' && (
          <PhotosSection
            photos={displayData.photos || []}
            onUpload={handlePhotoUpload}
            onRemove={handlePhotoRemove}
          />
        )}

        {activeSection === 'basics' && (
          <BasicInfoSection />
        )}

        {activeSection === 'passions' && (
          <PassionsSection />
        )}

        {activeSection === 'faith' && (
          <FaithSection />
        )}
      </div>

      <SaveButton 
        isSaving={isSaving} 
        saveMessage={message || ''} 
        handleSave={handleSave} 
      />

      <div className="h-32" />
    </div>
  );
};

export default function ProtectedProfileWrapper() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
