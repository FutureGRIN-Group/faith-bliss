/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Custom hooks for API integration - REFACTORED FOR CLIENT-SIDE
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useToast } from "../contexts/ToastContext";
import { getApiClient } from "../services/api-client";

import { useRequireAuth } from "./useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import type { GetUsersResponse } from "@/services/api";
import type { Match } from "../types/Match";

// ✅ Adjusted path

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  cacheTime?: number;
}

export interface ConversationMessagesResponse {
  match: Match;
  messages: Message[];
}

// Global request cache to prevent duplicate requests
const requestCache = new Map<string, { data: any; timestamp: number }>();
const activeRequests = new Map<string, Promise<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Types for messaging
import type { Message } from "@/services/api";
import { useNotificationWebSocket } from "./useNotificationWebSocket";
import type { NotificationPayload } from "../services/notification-websocket";

interface ConversationSummary {
  id: string; // matchId
  otherUser: {
    id: string;
    name: string;
    profilePhoto1: string;
  };
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string; // ISO date string
}

// Generic hook for API calls
export function useApi<T>(
  apiCall: (() => Promise<T>) | null,
  dependencies: unknown[] = [],
  options: UseApiOptions = { showErrorToast: false }
) {
  console.log("🟦 useApi init with deps:", dependencies);

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const {
    immediate = true,
    showErrorToast = false,
    showSuccessToast = false,
    cacheTime = CACHE_DURATION,
  } = options;

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Generate stable cache key from dependencies
  const cacheKey = useMemo(() => JSON.stringify(dependencies), [dependencies]);

  const execute = useCallback(async () => {
    if (!apiCall) return;

    // Check cache first
    if (requestCache.has(cacheKey)) {
      const cached = requestCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cacheTime) {
        if (isMountedRef.current) {
          console.log("✅ Using cached data");
          setState({ data: cached.data, loading: false, error: null });
        }
        return cached.data;
      }
    }

    // Return existing request if one is in flight
    if (activeRequests.has(cacheKey)) {
      return activeRequests.get(cacheKey);
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("⚠️ Previous request aborted");
    }

    abortControllerRef.current = new AbortController();

    if (isMountedRef.current) {
      console.log("🔄 Loading set true");
      setState((prev) => ({ ...prev, loading: true, error: null }));
    }

    // Create the promise for this request
    const requestPromise = (async () => {
      try {
        const data = await apiCall();
        console.log("✅ API call successful:", cacheKey, data);

        if (!isMountedRef.current) return data;

        // Cache the result
        requestCache.set(cacheKey, { data, timestamp: Date.now() });

        setState({ data, loading: false, error: null });

        if (showSuccessToast) {
          showSuccess("Operation completed successfully");
        }

        return data;
      } catch (error: any) {
        console.error("❌ API call failed:", cacheKey, error);
        if (!isMountedRef.current) throw error;

        // ✅ FIX: Check for 'Unauthorized' message thrown by api-client.ts on 401
        if (error?.message?.includes("Unauthorized")) {
          showError(
            "Your session has expired. Please log in again.",
            "Authentication Error"
          );
          navigate("/login"); // Redirect to login
          throw error;
        }

        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));

        if (showErrorToast) {
          showError(errorMessage, "API Error");
        }

        throw error;
      } finally {
        activeRequests.delete(cacheKey);
      }
    })();

    // Track this request
    activeRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }, [
    apiCall,
    cacheKey,
    cacheTime,
    showError,
    showSuccess,
    showErrorToast,
    showSuccessToast,
    navigate,
  ]);

  useEffect(() => {
    console.log("🎬 useApi effect triggered for deps:", dependencies);
    isMountedRef.current = true;

    if (immediate && apiCall) {
      console.log("▶️ Immediate execution triggered");
      execute().catch((err) => console.debug("API call error:", err));
    }

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, apiCall, cacheKey, execute]);

  const refetch = useCallback(async () => {
    requestCache.delete(cacheKey);
    activeRequests.delete(cacheKey);
    return execute();
  }, [execute, cacheKey]);

  return {
    ...state,
    execute,
    refetch,
  };
}

// Hook for user profile
export function useUserProfile(
  currentUserId?: string,
  currentUserEmail?: string
) {
  console.log("👤 useUserProfile init", { currentUserId, currentUserEmail });
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(
    () => getApiClient(accessToken ?? null),
    [accessToken]
  );

  const apiCall = useCallback(async () => {
    console.log("📡 Fetching /api/users/me");
    if (!accessToken) {
      throw new Error("Authentication required. Please log in.");
    }

    const response = await apiClient.User.getMe();
    console.log("✅ Response from /api/users/me:", response);

    if (Array.isArray(response)) {
      console.warn(
        "⚠️ useUserProfile: API returned array instead of object",
        response
      );
      if (currentUserId) {
        const found = response.find(
          (u: any) =>
            String(u.id) === String(currentUserId) ||
            String(u.firebaseUid) === String(currentUserId)
        );
        if (found) return found;
      }
      if (currentUserEmail) {
        const foundByEmail = response.find(
          (u: any) =>
            String(u.email).toLowerCase() ===
            String(currentUserEmail).toLowerCase()
        );
        if (foundByEmail) return foundByEmail;
      }
      if (response.length === 1) return response[0];
      console.warn("⚠️ Multiple users, no match found");
      return null;
    }

    return response;
  }, [apiClient, accessToken, currentUserId, currentUserEmail]);

  const { refetch, execute, ...rest } = useApi(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated, currentUserId, currentUserEmail],
    { immediate: isAuthenticated, showErrorToast: false }
  );

  return { ...rest, execute, refetch };
}

// Hook for potential matches
export function usePotentialMatches() {
  console.log("💘 usePotentialMatches triggered");
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(
    () => getApiClient(accessToken ?? null),
    [accessToken]
  );

  const apiCall = useCallback(() => {
    if (!accessToken) throw new Error("Authentication required.");
    console.log("📡 Fetching potential matches");
    return apiClient.Match.getPotentialMatches();
  }, [apiClient, accessToken]);

  return useApi(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    {
      immediate: isAuthenticated,
      showErrorToast: true,
      cacheTime: 3 * 60 * 1000,
    }
  );
}

// Hook for matches
export function useMatches() {
  console.log("🧩 useMatches init");
  const { accessToken } = useRequireAuth();
  const api = getApiClient(accessToken);
  const [mutual, setMutual] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [received, setReceived] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    console.log("📡 Fetching all match sections...");
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const [mutualData, sentData, receivedData] = await Promise.all([
        api.Match.getMutualMatches(),
        api.Match.getSentMatches(),
        api.Match.getReceivedMatches(),
      ]);

      console.log("✅ Match data fetched:", {
        mutualData,
        sentData,
        receivedData,
      });

      setMutual(mutualData || []);
      setSent(sentData || []);
      setReceived(receivedData || []);
    } catch (err: any) {
      console.error("❌ Error fetching matches:", err);
      setError(err.message || "Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [accessToken]);

  return {
    mutual,
    sent,
    received,
    loading,
    error,
    refetch: fetchMatches,
  };
}

// ✅ Mutual, Sent, Received match hooks with logs
export function useMutualMatches() {
  console.log("🤝 useMutualMatches triggered");
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(
    () => getApiClient(accessToken ?? null),
    [accessToken]
  );

  const apiCall = useCallback(() => {
    if (!accessToken) throw new Error("Authentication required.");
    console.log("📡 Fetching mutual matches");
    return apiClient.Match.getMutualMatches();
  }, [apiClient, accessToken]);

  return useApi<any[]>(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated, showErrorToast: true }
  );
}

export function useSentMatches() {
  console.log("📤 useSentMatches triggered");
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(
    () => getApiClient(accessToken ?? null),
    [accessToken]
  );

  const apiCall = useCallback(() => {
    if (!accessToken) throw new Error("Authentication required.");
    console.log("📡 Fetching sent matches");
    return apiClient.Match.getSentMatches();
  }, [apiClient, accessToken]);

  return useApi<any[]>(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated, showErrorToast: true }
  );
}

export function useReceivedMatches() {
  console.log("📥 useReceivedMatches triggered");
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(
    () => getApiClient(accessToken ?? null),
    [accessToken]
  );

  const apiCall = useCallback(() => {
    if (!accessToken) throw new Error("Authentication required.");
    console.log("📡 Fetching received matches");
    return apiClient.Match.getReceivedMatches();
  }, [apiClient, accessToken]);

  return useApi<any[]>(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated, showErrorToast: true }
  );
}

// Hook for liking/passing users (No change needed)
export function useMatching() {
  const { accessToken } = useRequireAuth();
  const apiClient = useMemo(
    () => getApiClient(accessToken ?? null),
    [accessToken]
  );
  const { showSuccess, showError, showInfo } = useToast();

  // Store toast refs to avoid adding them to dependencies
  const toastRef = useRef({ showSuccess, showError, showInfo });

  // Update refs when they change, but don't trigger callback recreation
  useEffect(() => {
    toastRef.current = { showSuccess, showError, showInfo };
  }, [showSuccess, showError, showInfo]);

  const likeUser = useCallback(
    async (userId: string) => {
      if (!accessToken) {
        throw new Error("Authentication required. Please log in.");
      }
      try {
        const result = await apiClient.Match.likeUser(userId);
        toastRef.current.showSuccess(
          result.isMatch ? "💕 It's a match!" : "👍 Like sent!"
        );
        return result;
      } catch (error: any) {
        if (error.message && error.message.includes("User already liked")) {
          toastRef.current.showInfo(
            "You've already liked this profile!",
            "Already Liked"
          );
          return; // Do not re-throw, just inform the user
        }
        toastRef.current.showError("Failed to like user", "Error");
        throw error; // Re-throw other errors
      }
    },
    [apiClient, accessToken]
  );

  const passUser = useCallback(
    async (userId: string) => {
      if (!accessToken) {
        throw new Error("Authentication required. Please log in.");
      }
      try {
        await apiClient.Match.passUser(userId);
        return true;
      } catch (error) {
        toastRef.current.showError("Failed to pass user", "Error");
        throw error;
      }
    },
    [apiClient, accessToken]
  );

  return { likeUser, passUser };
}

// Hook for completing onboarding
export function useOnboarding() {
  // 🛑 NOTE: completeOnboarding API function is REMOVED from apiClient.
  // The actual Firestore logic should be in useAuth's completeOnboarding method.
  // This hook is now just a stub for client-side API logic if needed.
  const { accessToken, refetchUser } = useRequireAuth();
  const { showSuccess, showError } = useToast();

  const toastRef = useRef({ showSuccess, showError });

  useEffect(() => {
    toastRef.current = { showSuccess, showError };
  }, [showSuccess, showError]);

  // This is a placeholder now, as the main onboarding logic is in useAuth.
  const completeOnboarding = useCallback(async () => {
    if (!accessToken) {
      throw new Error("Authentication required. Please log in.");
    }
    try {
      // 🛑 ERROR: This line is still incorrect if you intended to use the old API.
      // If you are migrating the API call to Firestore, this function should
      // be called from useAuth, and this hook should be removed/re-written
      // if it's not performing any API calls.
      // Since the user is asking for the fully updated code, I am commenting out
      // the now-deleted API call, as per your previous request.
      // const result = await apiClient.Auth.completeOnboarding(onboardingData);

      // *** Assuming the actual API call logic (if any) is now handled elsewhere ***
      const result = { success: true, profilePhotos: { photo1: "" } }; // Placeholder result

      if (refetchUser) {
        await refetchUser();
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      toastRef.current.showSuccess(
        "Profile setup complete! Welcome to FaithBliss! 🎉",
        "Ready to Find Love"
      );
      return result;
    } catch (error: any) {
      console.error("Onboarding error:", error);

      if (error?.message?.includes("Unauthorized")) {
        toastRef.current.showError(
          "Your session has expired. Please login again.",
          "Authentication Error"
        );
      } else {
        toastRef.current.showError(
          "Failed to complete profile setup. Please try again.",
          "Setup Error"
        );
      }

      throw error;
    }
  }, [accessToken, refetchUser]); // apiClient removed from dependencies as it's not used in the body

  return { completeOnboarding };
}

// Hook for WebSocket connection
export function useConversations() {
  const { pathname } = useLocation();
  console.log("useConversations");
  const { accessToken, isAuthenticated } = useRequireAuth();

  const apiClient = useMemo(
    () => getApiClient(accessToken ?? null),
    [accessToken]
  );

  const apiCall = useCallback(async (): Promise<ConversationSummary[]> => {
    if (!accessToken) {
      throw new Error("Authentication required. Please log in.");
    }
    const resp = await apiClient.Message.getMatchConversations();
    console.log("useConversations: ", resp);
    return resp;
  }, [apiClient, accessToken]);

  const { data, loading, error, refetch } = useApi(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: true }
  );

  // Re-fetch when user navigates back to `/messages`
  useEffect(() => {
    if (pathname === "/messages") {
      refetch();
    }
  }, [pathname, refetch]);

  return { data, loading, error, refetch };
}

// Hook for conversation messages (No change needed other than imports)
export function useConversationMessages(
  matchId: string,
  otherUserId?: string,
  page: number = 1,
  limit: number = 50
): {
  execute: () => Promise<ConversationMessagesResponse>;
  refetch: () => Promise<ConversationMessagesResponse>;
  data: ConversationMessagesResponse | null;
  loading: boolean;
  error: string | null;
} {
  console.log("useConversationMessages: ", otherUserId);
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(
    () => getApiClient(accessToken ?? null),
    [accessToken]
  );

  const apiCall =
    useCallback(async (): Promise<ConversationMessagesResponse> => {
      if (!accessToken) throw new Error("Authentication required");

      // Return the full response from backend
      const response = await apiClient.Message.getCreateMatchMessages(
        matchId,
        otherUserId,
        page,
        limit
      );
      console.log("useConversationMessages: ", response);
      return response; // should be { match: ..., messages: [...] }
    }, [apiClient, accessToken, matchId, otherUserId, page, limit]);

  return useApi<ConversationMessagesResponse>(
    isAuthenticated && matchId ? apiCall : null,
    [accessToken, isAuthenticated, matchId, otherUserId, page, limit],
    { immediate: !!(isAuthenticated && matchId) }
  );
}

// Hook for notifications (No change needed other than imports)
export function useNotifications() {
  const { isAuthenticated } = useRequireAuth();
  const notificationWebSocketService = useNotificationWebSocket();
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track handlers for proper cleanup
  const handlersRef = useRef<{
    handleNotification?: (payload: NotificationPayload) => void;
    handleError?: (err: any) => void;
  }>({});

  useEffect(() => {
    if (!isAuthenticated || !notificationWebSocketService) {
      return;
    }

    // Subscribe to notifications
    notificationWebSocketService.subscribeToNotifications();

    // Define handlers
    const handleNotification = (payload: NotificationPayload) => {
      setNotifications((prev) => [...prev, payload]);
    };

    const handleError = (err: any) => {
      setError(err?.message || "Notification WebSocket error");
    };

    // Store handlers in ref for cleanup
    handlersRef.current = { handleNotification, handleError };

    // Subscribe to events
    notificationWebSocketService.onNotification(handleNotification);
    notificationWebSocketService.onError(handleError);

    // Proper cleanup
    return () => {
      if (handlersRef.current.handleNotification) {
        notificationWebSocketService.off(
          "notification",
          handlersRef.current.handleNotification
        );
      }
      if (handlersRef.current.handleError) {
        notificationWebSocketService.off(
          "error",
          handlersRef.current.handleError
        );
      }
      // Don't unsubscribe immediately - let WebSocket manage its own lifecycle
    };
  }, [isAuthenticated, notificationWebSocketService]);

  return {
    data: notifications,
    loading: !isAuthenticated || !notificationWebSocketService,
    error,
  };
}

// Hook for fetching all users (No change needed)
export function useAllUsers(filters?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(
    () => getApiClient(accessToken ?? null),
    [accessToken]
  );

  const apiCall = useCallback(() => {
    if (!accessToken) {
      throw new Error("Authentication required. Please log in.");
    }

    const normalizedFilters = {
      page: filters?.page || 1,
      limit: Math.min(filters?.limit || 20, 20), // Cap at 20 to reduce memory
      search: filters?.search || undefined,
    };

    return apiClient.User.getAllUsers(normalizedFilters);
  }, [apiClient, accessToken, filters?.page, filters?.limit, filters?.search]);

  return useApi<GetUsersResponse>(
    isAuthenticated ? apiCall : null,
    [filters?.page, filters?.limit, filters?.search],
    {
      immediate: isAuthenticated,
      showErrorToast: true,
      cacheTime: 10 * 60 * 1000,
    }
  );
}

// Hook for unread message count (No change needed)
export function useUnreadCount() {
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(
    () => getApiClient(accessToken ?? null),
    [accessToken]
  );

  const apiCall = useCallback(() => {
    if (!accessToken) {
      throw new Error("Authentication required. Please log in.");
    }
    return apiClient.Message.getUnreadCount();
  }, [apiClient, accessToken]);

  return useApi<{ count: number }>(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated }
  );
}

export function useClearApiCache() {
  return useCallback(() => {
    requestCache.clear();
    activeRequests.clear();
  }, []);
}
