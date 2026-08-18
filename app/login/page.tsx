"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(
          data.error || "Não foi possível realizar o login.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Erro no login:", error);

      setError(
        "Não foi possível conectar ao OrçaZap. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f7f5fb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: 800,
              color: "#6d4aff",
              marginBottom: "8px",
            }}
          >
            Orça<span style={{ color: "#111827" }}>Zap</span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "26px",
              color: "#111827",
            }}
          >
            Bem-vindo!
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#6b7280",
            }}
          >
            Entre para acessar seus orçamentos.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="seu@email.com"
              autoComplete="email"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 14px",
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Senha
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 14px",
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              textAlign: "right",
              marginBottom: "22px",
            }}
          >
            <Link
              href="/esqueci-senha"
              style={{
                color: "#6d4aff",
                fontSize: "14px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Esqueci minha senha
            </Link>
          </div>

          {error && (
            <div
              style={{
                marginBottom: "18px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#fef2f2",
                color: "#b91c1c",
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
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              background: loading
                ? "#a78bfa"
                : "#6d4aff",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading ? "Entrando..." : "Entrar no OrçaZap"}
          </button>
        </form>

        <p
          style={{
            marginTop: "28px",
            textAlign: "center",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          Seus dados ficam protegidos e separados dos
          demais usuários.
        </p>
      </div>
    </main>
  );
}