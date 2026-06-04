"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function RecoveryHandler() {
  const router = useRouter();
 const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;

    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.replace("#", "?"));
    const type = params.get("type");
    const accessToken = params.get("access_token");

    if (type === "recovery") {
      handledRef.current = true;
      if (accessToken) {
        window.history.replaceState(null, "", "/reset-password");
        router.replace(`/reset-password?token=${accessToken}`);
      }
    }
  }, [router]);

  return null;
}