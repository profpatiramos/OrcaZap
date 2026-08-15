"use client";

import { useState } from "react";

type Props = {
  token: string;
  status: string;
};

export default function AcceptQuoteButton({
  token,
  status,
}: Props) {
  const [processing, setProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [error, setError] = useState("");

  async function handleAccept() {
    if (processing) return;

    const confirmed = window.confirm(
      "Você confirma o aceite deste orçamento?",
    );

    if (!confirmed) return;

    setProcessing(true);
    setError("");

    try {
      const response = await fetch(
        `/api/public/quotes/${token}/accept`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error ||
            "Não foi possível registrar o aceite.",
        );
      }

      setCurrentStatus("ACCEPTED");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível registrar o aceite.",
      );
    } finally {
      setProcessing(false);
    }
  }

  async function handleReject() {
    if (processing) return;

    const confirmed = window.confirm(
      "Você confirma a recusa deste orçamento?",
    );

    if (!confirmed) return;

    setProcessing(true);
    setError("");

    try {
      const response = await fetch(
        `/api/public/quotes/${token}/reject`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error ||
            "Não foi possível registrar a recusa.",
        );
      }

      setCurrentStatus("REJECTED");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível registrar a recusa.",
      );
    } finally {
      setProcessing(false);
    }
  }

  if (currentStatus === "ACCEPTED") {
    return (
      <div
        style={{
          marginTop: "32px",
          padding: "18px",
          borderRadius: "12px",
          background: "#eef8f0",
          color: "#237a3b",
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        ✓ Orçamento aceito com sucesso!
      </div>
    );
  }

  if (currentStatus === "REJECTED") {
    return (
      <div
        style={{
          marginTop: "32px",
          padding: "18px",
          borderRadius: "12px",
          background: "#fff1f0",
          color: "#b42318",
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        ✕ Orçamento recusado.
      </div>
    );
  }

  if (
    currentStatus === "EXPIRED" ||
    currentStatus === "CANCELLED"
  ) {
    return (
      <div
        style={{
          marginTop: "32px",
          padding: "18px",
          borderRadius: "12px",
          background: "#f5f5f5",
          color: "#666",
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        Este orçamento não está mais disponível para aceite.
      </div>
    );
  }

  if (
    currentStatus === "DRAFT"
  ) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "32px",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        <button
          type="button"
          onClick={handleAccept}
          disabled={processing}
          style={{
            width: "100%",
            padding: "16px 24px",
            border: "none",
            borderRadius: "10px",
            background: "#111",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 700,
            cursor: processing ? "wait" : "pointer",
          }}
        >
          {processing
            ? "Processando..."
            : "Aceitar orçamento"}
        </button>

        <button
          type="button"
          onClick={handleReject}
          disabled={processing}
          style={{
            width: "100%",
            padding: "16px 24px",
            border: "1px solid #ef4444",
            borderRadius: "10px",
            background: "#fff",
            color: "#dc2626",
            fontSize: "16px",
            fontWeight: 700,
            cursor: processing ? "wait" : "pointer",
          }}
        >
          {processing
            ? "Processando..."
            : "Recusar orçamento"}
        </button>
      </div>

      {error && (
        <div
          style={{
            marginTop: "12px",
            color: "#b42318",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}