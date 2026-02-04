# Security Incident Report: Exposed Firebase API Key

**Date:** 2026-02-04
**Severity:** High
**Status:** Remediation in Progress

## Incident Description
A Firebase API Key (`AIzaSy...`) was hardcoded in `src/firebase/config.ts` and committed to the Git repository. This exposure could potentially allow unauthorized usage of Firebase services (Firestore, Auth, Storage) associated with the `faithbliss-b4fad` project, leading to data leakage or quota abuse.

## Immediate Remediation Steps Taken
1.  **Codebase Hardening**:
    - The hardcoded key and configuration values have been removed from `src/firebase/config.ts`.
    - A `.env` file has been created in `faith-bliss-client/` to store these values securely.
    - The application code now loads these values via `import.meta.env`.
    - Verified that `.env` is listed in `.gitignore` to prevent future commits.

## Required Actions (User to Execute)

### 1. Key Revocation & Rotation (Google Cloud Console)
*   **Action**: Log in to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
*   **Step**: Locate the exposed API Key (`AIzaSy...`).
*   **Step**: **Restrict** the key immediately (if not already) to specific domains (e.g., `localhost`, your production domain) and specific APIs (Auth, Firestore).
*   **Step**: **Rotate** the key: Create a new API key and delete the old one. Update your local `.env` file with the new key.

### 2. Git History Cleanup
The key still exists in the Git history. You must remove it to prevent it from being found in previous commits.

**WARNING**: This operation rewrites history. Ensure all team members have pushed their changes and are ready to re-clone the repo.

**Using BFG Repo-Cleaner (Recommended):**
```bash
# 1. Download BFG (requires Java)
java -jar bfg.jar --replace-text passwords.txt .git

# 2. Where passwords.txt contains the exposed key:
# AIzaSyBmr2NmdT0gtaWZucdBf2XNuSak2YuMvzY

# 3. Clean the reflog and force push
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

### 3. Monitoring
*   Check the [Firebase Console Usage](https://console.firebase.google.com/) tab for any spikes in traffic or unrecognized operations.
*   Review Google Cloud Audit Logs for unauthorized access attempts.

## Prevention
*   **Pre-commit Hooks**: Install `git-secrets` or `husky` to scan for high-entropy strings before committing.
*   **Environment Variables**: Enforce the use of `.env` files for all configuration secrets.
