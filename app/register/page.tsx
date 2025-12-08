"use client";

import React from "react";
import { SignInPage, Testimonial } from "../components/SignInPage";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/35.jpg",
    name: "Arun Kumar",
    handle: "@arun_k_eats",
    text: "The most authentic Kerala food I've had outside of Kerala! The fish curry and appams at Mallu Magic transported me straight back home. Incredible flavors!"
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/42.jpg",
    name: "Priya Menon",
    handle: "@priya.menon_foodie",
    text: "Mallu Magic is a hidden gem. Their Malabar biryani is absolutely divine, and the service feels so personal and warm. A must-visit for any food lover."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/50.jpg",
    name: "Rajesh Pillai",
    handle: "@rajeshpillai_reviews",
    text: "The Sadhya here is just perfect, every dish had that genuine homemade taste. The ambience is lovely, too. Highly recommend Mallu Magic for a true taste of Kerala."
  },
];

export default function LoginPage() {
  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Sign In submitted:", data);
    // Add your actual login logic here
  };

  const handleGoogleSignIn = () => {
    console.log("Continue with Google clicked");
  };
  
  const handleResetPassword = () => {
    console.log("Reset Password clicked");
  }

  const handleCreateAccount = () => {
    console.log("Create Account clicked");
  }

  return (
      <SignInPage
        heroImageSrc="/images/login-images.jpg"
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
  );
};