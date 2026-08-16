"use client";

import { useRouter } from "next/navigation";

export default function DashboardBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/dashboard")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        color: "#374151",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <span aria-hidden="true">&larr;</span>
      Dashboard
    </button>
  );
}