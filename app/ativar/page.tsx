"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AtivarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!token) {
      setError(
        "Link de ativação inválido. Verifique o link recebido.",
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "A senha deve ter pelo menos 8 caracteres.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/activate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(
          data.error ||
            "Não foi possível ativar sua conta.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(
        "Não foi possível conectar ao servidor. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "480px",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "40px",
        boxShadow:
          "0 10px 40px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "36px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          <span style={{ color: "#6846ff" }}>
            Orça
          </span>
          Zap
        </h1>

        <h2
          style={{
            marginTop: "24px",
            marginBottom: "8px",
            fontSize: "26px",
            color: "#111827",
          }}
        >
          Ative sua conta
        </h2>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "16px",
          }}
        >
          Crie sua senha para acessar o OrçaZap.
        </p>
      </div>

      {!token ? (
        <div
          style={{
            background: "#fff1f2",
            color: "#be123c",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "15px",
          }}
        >
          Link de ativação inválido.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#1e293b",
            }}
          >
            Nova senha
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Mínimo de 8 caracteres"
            autoComplete="new-password"
            disabled={loading}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#1e293b",
            }}
          >
            Confirme sua senha
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="Digite a senha novamente"
            autoComplete="new-password"
            disabled={loading}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          />

          {error && (
            <div
              style={{
                background: "#fff1f2",
                color: "#be123c",
                padding: "14px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: 0,
              borderRadius: "10px",
              padding: "15px",
              background: "#6846ff",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Ativando conta..."
              : "Ativar minha conta"}
          </button>
        </form>
      )}

      <p
        style={{
          textAlign: "center",
          marginTop: "28px",
          marginBottom: 0,
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        Seus dados ficam protegidos e separados
        dos demais usuários.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "480px",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "40px",
        textAlign: "center",
        boxShadow:
          "0 10px 40px rgba(0,0,0,0.08)",
        color: "#64748b",
      }}
    >
      Carregando...
    </div>
  );
}

export default function AtivarPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        padding: "24px",
      }}
    >
      <Suspense fallback={<LoadingState />}>
        <AtivarForm />
      </Suspense>
    </main>
  );
}