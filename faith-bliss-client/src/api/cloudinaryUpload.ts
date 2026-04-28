import { getAuth } from "firebase/auth";

function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (raw == null || String(raw).trim() === "") {
    throw new Error(
      "VITE_API_URL is not configured. Set it to your backend base URL (e.g. https://api.example.com) in the environment."
    );
  }
  return String(raw).replace(/\/$/, "");
}

/** Parse JSON from a fetch Response; avoids "Unexpected end of JSON input" on empty bodies. */
function parseJsonFromText(
  res: Response,
  raw: string
): Record<string, unknown> {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error(
      `Empty response from server (${res.status} ${res.statusText}). Check that VITE_API_URL points to your running backend and that /api/uploads/upload-photos is reachable.`
    );
  }
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    throw new Error(
      `Server did not return JSON (${res.status}): ${trimmed.slice(0, 200)}`
    );
  }
}

export const uploadPhotosToCloudinary = async (files: File[]) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken();

  const formData = new FormData();
  files.forEach((file) => formData.append("photos", file));

  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/uploads/upload-photos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const raw = await res.text();
  const body = parseJsonFromText(res, raw);

  if (!res.ok) {
    const msg =
      (typeof body.error === "string" && body.error) ||
      (typeof body.message === "string" && body.message) ||
      `Upload failed (${res.status})`;
    throw new Error(msg);
  }

  const urls = body.urls;
  if (!Array.isArray(urls)) {
    throw new Error("Upload response missing urls array");
  }
  return urls as string[];
};
