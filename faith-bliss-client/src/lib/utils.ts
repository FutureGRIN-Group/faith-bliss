import api from "@/services/axios";
import type { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getConversationId(
  profileId: string,
  errorShowed: boolean,
  setErrorShowed: (value: boolean) => void
) {
  try {
    const response = await api.get(`/api/conversations/with-user/${profileId}`);
    return response.data.data.conversationId;
  } catch (error) {
    const err = error as AxiosError;
    if (!errorShowed) {
      toast.error(
        (err.response?.data as { message?: string })?.message || err.message
      );
      setErrorShowed(true);
    }
    return null;
  }
}
