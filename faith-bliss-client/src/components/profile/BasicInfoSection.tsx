import React from 'react';
import { useProfileStore } from '@/store/profileStore';
import { ProfileField, ProfileTextArea, ProfileSelect } from './ProfileField';
import { GENDER_OPTIONS, YES_NO_OPTIONS } from '@/constants/profileOptions';

const BasicInfoSection: React.FC = () => {
  const { draft, updateDraft, errors } = useProfileStore();

  if (!draft) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gray-800/50 rounded-3xl p-6 sm:p-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6">Basic Info</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField
            label="Full Name"
            value={draft.name}
            onChange={(e) => updateDraft({ name: e.target.value })}
            error={errors.name}
          />
          
          <div className="grid grid-cols-2 gap-4">
             <ProfileField
                label="Age"
                type="number"
                value={draft.age}
                onChange={(e) => updateDraft({ age: parseInt(e.target.value) || 0 })}
                error={errors.age}
             />
             
             <ProfileSelect
                label="Gender"
                value={draft.gender}
                onChange={(e) => updateDraft({ gender: e.target.value as any })}
                options={GENDER_OPTIONS}
                error={errors.gender}
             />
          </div>

          <div className="md:col-span-2">
            <ProfileTextArea
              label="Bio"
              value={draft.bio || ''}
              onChange={(e) => updateDraft({ bio: e.target.value })}
              placeholder="Tell us about yourself..."
              error={errors.bio}
              helperText={`${(draft.bio || '').length}/500 characters`}
              maxLength={500}
            />
          </div>
          
          <ProfileField
            label="Location"
            value={draft.location?.address || ''}
            onChange={(e) => updateDraft({ location: { ...draft.location, address: e.target.value, latitude: null, longitude: null } })}
            placeholder="City, Country"
            error={errors['location.address']}
          />

          <ProfileField
             label="Height (cm)"
             type="number"
             value={draft.height || ''}
             onChange={(e) => updateDraft({ height: parseInt(e.target.value) || undefined })}
             error={errors.height}
          />

        </div>
      </div>

      <div className="bg-gray-800/50 rounded-3xl p-6 sm:p-8 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-6">Work & Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField
                label="Profession / Job Title"
                value={draft.profession || ''}
                onChange={(e) => updateDraft({ profession: e.target.value })}
                error={errors.profession}
              />
               <ProfileField
                label="Company / Employer"
                value={draft.company || ''}
                onChange={(e) => updateDraft({ company: e.target.value })}
                error={errors.company}
              />
              <ProfileField
                label="School / University"
                value={draft.fieldOfStudy || ''}
                onChange={(e) => updateDraft({ fieldOfStudy: e.target.value })}
                error={errors.fieldOfStudy}
              />
              <ProfileField
                label="Education Level"
                value={draft.educationLevel || ''}
                onChange={(e) => updateDraft({ educationLevel: e.target.value })}
                error={errors.educationLevel}
              />
          </div>
      </div>

      <div className="bg-gray-800/50 rounded-3xl p-6 sm:p-8 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-6">Lifestyle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ProfileSelect
                label="Smoking"
                value={draft.smoking || ''}
                onChange={(e) => updateDraft({ smoking: e.target.value as any })}
                options={YES_NO_OPTIONS}
                error={errors.smoking}
             />
             <ProfileSelect
                label="Drinking"
                value={draft.drinking || ''}
                onChange={(e) => updateDraft({ drinking: e.target.value as any })}
                options={YES_NO_OPTIONS}
                error={errors.drinking}
             />
             <ProfileField
                label="Kids"
                value={draft.kids || ''}
                onChange={(e) => updateDraft({ kids: e.target.value })}
                placeholder="e.g. Have them, Want them"
                error={errors.kids}
             />
          </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
