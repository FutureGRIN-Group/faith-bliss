import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProfileStore } from '../profileStore';
import { API } from '@/services/api';
import { updateProfileClient } from '@/services/api-client';

// Mock dependencies
vi.mock('@/services/api', () => ({
  API: {
    User: {
      getMe: vi.fn(),
      deletePhoto: vi.fn(),
    },
  },
}));

vi.mock('@/services/api-client', () => ({
  updateProfileClient: vi.fn(),
  uploadSpecificPhotoClient: vi.fn(),
}));

describe('profileStore', () => {
  beforeEach(() => {
    useProfileStore.setState({
      profile: null,
      draft: null,
      isLoading: false,
      isSaving: false,
      errors: {},
      message: null,
    });
    vi.clearAllMocks();
  });

  it('fetchProfile should fetch user and set profile', async () => {
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      age: 25,
      gender: 'MALE',
    };
    (API.User.getMe as any).mockResolvedValue(mockUser);

    await useProfileStore.getState().fetchProfile();

    const state = useProfileStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.profile).toEqual(expect.objectContaining({
      name: 'Test User',
      age: 25,
    }));
  });

  it('initDraft should create draft from profile', async () => {
     useProfileStore.setState({
         profile: {
             id: '1',
             name: 'User',
             email: 'email',
             age: 30,
             gender: 'FEMALE',
             photos: []
         } as any
     });

     useProfileStore.getState().initDraft();
     
     const state = useProfileStore.getState();
     expect(state.draft).toEqual(expect.objectContaining({
         name: 'User',
         age: 30,
         gender: 'FEMALE'
     }));
  });

  it('updateDraft should update draft state', () => {
      useProfileStore.setState({ draft: { name: 'Old' } as any });
      useProfileStore.getState().updateDraft({ name: 'New' });
      expect(useProfileStore.getState().draft?.name).toBe('New');
  });
});
