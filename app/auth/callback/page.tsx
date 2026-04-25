"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Verifying session...");
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash (Supabase OAuth callback)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth error:", error);
          setStatus("Authentication failed. Redirecting...");
          setTimeout(() => router.push("/login?error=auth_failed"), 2000);
          return;
        }

        if (session) {
          setStatus("Session verified! Redirecting...");

          // Check user role and redirect accordingly
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          const userRole = profile?.role || "client";

          if (userRole === "lawyer") {
            router.push("/dashboard");
          } else {
            router.push("/portal");
          }
        } else {
          // No session - redirect to login
          setStatus("No session found. Redirecting...");
          setTimeout(() => router.push("/login"), 2000);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setStatus("Something went wrong. Redirecting...");
        setTimeout(() => router.push("/login?error=unexpected"), 2000);
      }
    };

    handleAuthCallback();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">{status}</p>
      </div>
    </div>
  );
}