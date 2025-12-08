"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react"; // Optional icons for better UI

export default function Dashboard() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // 1. Call the backend to invalidate the session/token
      // We use the proxy path we set up earlier
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // If your backend needs the token in the body or header, add it here.
        // Usually, cookies are sent automatically, or Authorization header if needed:
        // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
      // We continue to clear client data even if server call fails
    } finally {
      // 2. Delete the auth cookie
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      
      // 3. Clear localStorage
      localStorage.clear();
      
      // 4. Redirect to login
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-camel">Dashboard</h1>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Log Out
              </>
            )}
          </button>
        </div>
        
        <div className="p-6 rounded-2xl border border-taupe bg-foreground/5 backdrop-blur-sm">
          <h2 className="text-xl font-medium text-camel mb-2">Welcome to the protected area!</h2>
          <p className="text-muted-foreground">
            You are now authenticated. This page is protected by Middleware.
          </p>
          
          {/* Example of retrieving user data */}
          <div className="mt-6 p-4 bg-background/50 rounded-xl border border-white/10">
            <p className="text-sm font-mono text-gray-500">
              Session Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}