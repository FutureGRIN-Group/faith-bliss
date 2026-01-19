import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(18, "You must be at least 18 years old").max(120, "Invalid age"),
  gender: z.enum(["MALE", "FEMALE"]),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  
  // Faith & Values
  denomination: z.string().optional(),
  faithJourney: z.string().optional(),
  sundayActivity: z.string().optional(),
  favoriteVerse: z.string().max(150, "Verse must be less than 150 characters").optional(),
  values: z.array(z.string()).max(5, "Select up to 5 values").optional(),
  
  // Lifestyle & Background
  fieldOfStudy: z.string().max(100).optional(),
  profession: z.string().max(100).optional(),
  educationLevel: z.string().optional(),
  company: z.string().max(100).optional(),
  smoking: z.enum(["YES", "NO", "SOMETIMES"]).optional(),
  drinking: z.enum(["YES", "NO", "SOMETIMES"]).optional(),
  kids: z.string().optional(),
  height: z.number().min(50).max(300).optional(), // cm
  
  // Interests
  hobbies: z.array(z.string()).max(10, "Select up to 10 hobbies").optional(),
  lookingFor: z.array(z.string()).optional(),
  
  // Location
  location: z.object({
    address: z.string(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  }).optional(),
  
  // Photos
  photos: z.array(z.string()).min(1, "At least 1 photo is required").max(6, "Maximum 6 photos allowed"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
