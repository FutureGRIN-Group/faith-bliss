// src/config/firebase-admin.ts (FINAL DEPLOYMENT FIX)

import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { Buffer } from "buffer"; // Import Buffer for decoding
// import * as path from 'path'; // Removed path dependency

const base64Credentials = process.env.FIREBASE_CREDENTIALS_BASE64;

if (!base64Credentials) {
  // Crucial: Throwing an error if the new variable is missing
  throw new Error("FIREBASE_CREDENTIALS_BASE64 environment variable not set.");
}

if (!admin.apps.length) {
  try {
    // 1. Decode the Base64 string into a JSON string
    const credentialsJsonString = Buffer.from(
      base64Credentials,
      "base64"
    ).toString("utf-8");

    // DEBUG: Log the first few chars to check validity (DON'T LOG THE WHOLE KEY)
    console.log("Decoded Credentials Snippet:", credentialsJsonString.substring(0, 20) + "...");

    // 2. Parse the JSON string into the ServiceAccount object
    const serviceAccount = JSON.parse(credentialsJsonString) as ServiceAccount;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully."); // Added log for verification
  } catch (error) {
    console.warn(
      "⚠️ WARNING: Could not initialize Firebase Admin SDK. Backend is running in limited mode."
    );
    console.warn("Reason:", error instanceof Error ? error.message : String(error));
    // Mock Admin SDK for dev/preview (TEMPORARY FIX)
    // This allows the server to start but endpoints using admin auth will fail
  }
}

// FIX: Export 'db' here.
// Safely export mock if admin failed
export const db = admin.apps.length ? admin.firestore() : ({} as FirebaseFirestore.Firestore);

// Firestore user profile collection reference
export const usersCollection = admin.apps.length ? db.collection("users") : ({} as FirebaseFirestore.CollectionReference);

// Re-export admin for field values, etc.
export { admin };
