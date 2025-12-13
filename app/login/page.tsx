"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInPage, Testimonial } from "../components/SignInPage"; // Ensure path is correct

// ... (Keep your sampleTestimonials array here) ...
const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/35.jpg",
    name: "Arun Kumar",
    handle: "@arun_k_eats",
    text: "The most authentic Kerala food I've had outside of Kerala! The fish curry and appams at Mallu Magic transported me straight back home."
  },
  // ... other testimonials
];

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Note: Ensure this points to your functioning API or Proxy
      const response = await fetch("/api/auth/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // --- CRITICAL CHANGE: SET COOKIE ---
        // Middleware can only read Cookies, not LocalStorage.
        // We set a cookie named 'token' that expires in 1 day (86400s).
        // Explicitly set path=/ so /dashboard/inventory can see it
        document.cookie = `token=${data.data.token}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem("token", data.data.token);
        // Optional: Still keep localStorage for client-side access if needed
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Redirect to Dashboard
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <SignInPage
        heroImageSrc="/images/login-images.jpg" // Ensure this image exists in public/images
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        isLoading={isLoading}
        error={error}
      />
  );
};