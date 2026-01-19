import React from 'react';
import { useProfileStore } from '@/store/profileStore';
import { ChipSelector } from './ChipSelector';
import { HOBBIES_LIST, VALUES_LIST, LOOKING_FOR_LIST } from '@/constants/profileOptions';

const PassionsSection: React.FC = () => {
  const { draft, updateDraft, errors } = useProfileStore();

  if (!draft) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gray-800/50 rounded-3xl p-6 sm:p-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-2">Interests & Hobbies</h2>
        <p className="text-gray-400 mb-6">Select up to 10 things you enjoy</p>
        
        <ChipSelector
          label=""
          options={HOBBIES_LIST}
          selected={draft.hobbies || []}
          onChange={(selected) => updateDraft({ hobbies: selected })}
          maxSelect={10}
          error={errors.hobbies}
        />
      </div>

      <div className="bg-gray-800/50 rounded-3xl p-6 sm:p-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-2">Core Values</h2>
        <p className="text-gray-400 mb-6">What matters most to you?</p>
        
        <ChipSelector
          label=""
          options={VALUES_LIST}
          selected={draft.values || []}
          onChange={(selected) => updateDraft({ values: selected })}
          maxSelect={5}
          error={errors.values}
        />
      </div>

      <div className="bg-gray-800/50 rounded-3xl p-6 sm:p-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-2">Looking For</h2>
        <p className="text-gray-400 mb-6">What kind of connection are you seeking?</p>
        
        <ChipSelector
          label=""
          options={LOOKING_FOR_LIST}
          selected={draft.lookingFor || []}
          onChange={(selected) => updateDraft({ lookingFor: selected })}
          error={errors.lookingFor}
        />
      </div>
    </div>
  );
};

export default PassionsSection;
