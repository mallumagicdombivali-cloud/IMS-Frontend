// lib/api.ts

// Helper function to get a cookie value by name
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    // Pop the last part and strip away any trailing garbage
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  // 1. Try to get token from Cookie first
  let token = getCookie("token");

  // 2. Fallback to LocalStorage (just in case)
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem("token");
  }

  // Debug Log
  if (!token) {
    console.warn("⚠️ No token found in Cookie or LocalStorage");
  }

  // 3. Prepare Headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    // Remove any accidental quotes that sometimes creep in
    const cleanToken = token.replace(/"/g, '');
    defaultHeaders["Authorization"] = `Bearer ${cleanToken}`;
  }

  const headers = {
    ...defaultHeaders,
    ...(options.headers as Record<string, string>),
  };

  // ... inside apiFetch, just before 'const response = await fetch...'

  // DEBUG: Check exactly what we are sending
  console.log("🍪 Raw Cookie String:", typeof document !== 'undefined' ? document.cookie : 'Server Side');
  console.log("🔑 Extracted Token:", token ? `${token.substring(0, 10)}...` : "NULL");
  console.log("📤 Final Auth Header:", headers["Authorization"]);

  const response = await fetch(url, {
    ...options,
    headers,
  });


  // 5. Handle Unauthorized Globally
  if (response.status === 401) {
    console.error("❌ Unauthorized (401). Token is likely expired.");
    // Optional: Redirect to login if needed
    // if (typeof window !== 'undefined') window.location.href = "/login";
  }

  return response;
}