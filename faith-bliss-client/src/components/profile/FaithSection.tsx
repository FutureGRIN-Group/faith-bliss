import React from 'react';
import { useProfileStore } from '@/store/profileStore';
import { ProfileSelect, ProfileTextArea } from './ProfileField';
import { DENOMINATION_OPTIONS, FAITH_JOURNEY_OPTIONS, SUNDAY_ACTIVITY_OPTIONS } from '@/constants/profileOptions';

const FaithSection: React.FC = () => {
  const { draft, updateDraft, errors } = useProfileStore();

  if (!draft) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gray-800/50 rounded-3xl p-6 sm:p-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6">Faith Journey</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileSelect
            label="Denomination"
            value={draft.denomination || ''}
            onChange={(e) => updateDraft({ denomination: e.target.value })}
            options={DENOMINATION_OPTIONS}
            error={errors.denomination}
          />
          
          <ProfileSelect
            label="Where are you in your walk?"
            value={draft.faithJourney || ''}
            onChange={(e) => updateDraft({ faithJourney: e.target.value as any })}
            options={FAITH_JOURNEY_OPTIONS}
            error={errors.faithJourney}
          />
          
          <ProfileSelect
            label="Sunday Activity"
            value={draft.sundayActivity || ''}
            onChange={(e) => updateDraft({ sundayActivity: e.target.value as any })}
            options={SUNDAY_ACTIVITY_OPTIONS}
            error={errors.sundayActivity}
          />
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-3xl p-6 sm:p-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6">Favorite Verse</h2>
        <ProfileTextArea
          label="Verse Reference or Text"
          value={draft.favoriteVerse || ''}
          onChange={(e) => updateDraft({ favoriteVerse: e.target.value })}
          placeholder="e.g. Jeremiah 29:11"
          error={errors.favoriteVerse}
          helperText={`${(draft.favoriteVerse || '').length}/150 characters`}
          maxLength={150}
        />
      </div>
    </div>
  );
};

export default FaithSection;
