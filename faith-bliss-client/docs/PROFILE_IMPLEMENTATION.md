# User Profile Feature Implementation

## Overview
The User Profile feature has been completely overhauled to support a comprehensive set of profile fields, including Photos, Basic Info, Lifestyle, Work & Education, Faith Journey, and Interests.

## Architecture

### Backend
- **Model**: `User` model (Mongoose) updated to include new fields (`educationLevel`, `company`, `smoking`, `drinking`, `kids`, `height`, etc.).
- **Controller**: `userController.ts` updated to use `zod` for request validation. It now supports updating all new fields in Firestore.
- **Validation**: Strict validation ensures data integrity (e.g., age >= 18, enums for gender/smoking/drinking).

### Frontend
- **State Management**: `useProfileStore` (Zustand) manages the profile state, draft editing, and optimistic updates.
- **Validation**: `profileSchema` (Zod) validates the form on the client side before submission.
- **Components**:
  - `ProfilePage`: Main container with tab navigation.
  - `PhotoGrid`: Interactive photo uploader with drag-and-drop support (via file input).
  - `BasicInfoSection`: Form for personal details using `ProfileField` and `ProfileSelect`.
  - `PassionsSection`: Interest selection using `ChipSelector`.
  - `FaithSection`: Faith-specific details.
  - `UserProfileView`: Public view of the profile, updated to display all new information.

## Key Features
1.  **Draft Mode**: Edits are stored in a draft state and only committed when "Save" is clicked.
2.  **Optimistic UI**: Photo uploads/removals update the UI immediately.
3.  **Validation**: Real-time validation for age, bio length, and required fields.
4.  **Accessibility**: Form fields have proper labels, and interactive elements have ARIA attributes.
5.  **Responsiveness**: The layout adapts to mobile and desktop screens.

## Testing
- **Unit Tests**: `profileStore.test.ts` covers the core logic of fetching, updating, and saving profiles.
- **Integration**: The components are integrated and tested manually to ensure smooth data flow.

## Deviations from Design
- **Photo Limit**: Set to 6 photos based on backend schema, whereas some designs might show 9.
- **Save Button**: Implemented as a floating action button on mobile for better accessibility.
