"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  phone?: string | null;
  whatsapp?: string | null;
};

type Quote = {
  id: string;
  number: string;
  title: string;
  total: string | number;
  status: string;
};

type FollowUp = {
  id: string;
  dueAt: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  suggestedMessage?: string | null;
  customer?: Customer | null;
  quote?: Quote | null;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value: string | number) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function FollowUpsPage() {
  const router = useRouter();

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  async function loadFollowUps() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/followups");

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Não foi possível carregar os follow-ups.",
        );
      }

      setFollowUps(data.followUps || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os follow-ups.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFollowUps();
  }, []);

  async function updateStatus(
    id: string,
    status: "COMPLETED" | "CANCELLED",
  ) {
    try {
      setUpdating(id);

      const response = await fetch(`/api/followups/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Não foi possível atualizar o follow-up.",
        );
      }

      await loadFollowUps();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar o follow-up.",
      );
    } finally {
      setUpdating("");
    }
  }

  function openWhatsApp(followUp: FollowUp) {
    const phone =
      followUp.customer?.whatsapp ||
      followUp.customer?.phone;

    if (!phone) {
      setError(
        "Este cliente não possui telefone ou WhatsApp cadastrado.",
      );
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    const message =
      followUp.suggestedMessage ||
      `Olá, ${followUp.customer?.name || ""}! Tudo bem? Estou entrando em contato para saber se você conseguiu avaliar o orçamento ${followUp.quote?.number || ""}. Fico à disposição para qualquer dúvida ou ajuste.`;

    const url =
      `https://wa.me/55${cleanPhone}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }

  const pending = followUps.filter(
    (item) => item.status === "PENDING",
  );

  const completed = followUps.filter(
    (item) => item.status === "COMPLETED",
  );

  return (
    <main>
      <header className="top">
        <div className="brand">
          Orca<span>Zap</span>
        </div>

        <div className="muted">Follow-ups</div>
      </header>

      <section className="main">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{
            marginBottom: "24px",
            background: "transparent",
            color: "#555",
            padding: 0,
            border: "none",
            cursor: "pointer",
          }}
        >
          ← Voltar ao painel
        </button>

        <div className="eyebrow">FOLLOW-UPS</div>

        <h1 className="title">Acompanhe seus clientes.</h1>

        <p className="subtitle">
          Saiba quais orçamentos precisam de retorno.
        </p>

        {error && (
          <div className="card">
            <div className="error-box">{error}</div>

            <button
              type="button"
              className="button"
              onClick={loadFollowUps}
              style={{ marginTop: "16px" }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {loading && (
          <div className="card">
            <p className="muted">
              Carregando follow-ups...
            </p>
          </div>
        )}

        {!loading && !error && pending.length === 0 && (
          <div className="card">
            <h2>Nenhum follow-up pendente.</h2>

            <p className="muted">
              Quando você publicar um orçamento, o OrçaZap
              criará automaticamente um lembrete de retorno.
            </p>
          </div>
        )}

        {!loading && !error && pending.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {pending.map((followUp) => (
              <div
                key={followUp.id}
                className="card"
                style={{
                  margin: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div className="eyebrow">
                      RETORNO PENDENTE
                    </div>

                    <h2 style={{ marginTop: "8px" }}>
                      {followUp.customer?.name ||
                        "Cliente"}
                    </h2>

                    {followUp.quote && (
                      <p className="muted">
                        Orçamento:{" "}
                        <strong>
                          {followUp.quote.number}
                        </strong>
                        {" — "}
                        {followUp.quote.title}
                      </p>
                    )}

                    <p className="muted">
                      Retorno em{" "}
                      <strong>
                        {formatDate(followUp.dueAt)}
                      </strong>{" "}
                      às{" "}
                      <strong>
                        {formatTime(followUp.dueAt)}
                      </strong>
                    </p>

                    {followUp.quote && (
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          marginTop: "10px",
                        }}
                      >
                        {formatMoney(followUp.quote.total)}
                      </p>
                    )}
                  </div>
                </div>

                {followUp.suggestedMessage && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "16px",
                      borderRadius: "10px",
                      background: "#f7f7f5",
                      lineHeight: 1.6,
                      color: "#555",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "#222",
                      }}
                    >
                      Mensagem sugerida
                    </strong>

                    {followUp.suggestedMessage}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    className="button"
                    onClick={() =>
                      openWhatsApp(followUp)
                    }
                  >
                    WhatsApp
                  </button>

                  {followUp.quote && (
                    <button
                      type="button"
                      className="button"
                      onClick={() =>
                        router.push(
                          `/dashboard/orcamentos/${followUp.quote?.id}`,
                        )
                      }
                    >
                      Ver orçamento
                    </button>
                  )}

                  <button
                    type="button"
                    className="button"
                    disabled={updating === followUp.id}
                    onClick={() =>
                      updateStatus(
                        followUp.id,
                        "COMPLETED",
                      )
                    }
                  >
                    ✓ Concluir
                  </button>

                  <button
                    type="button"
                    disabled={updating === followUp.id}
                    onClick={() =>
                      updateStatus(
                        followUp.id,
                        "CANCELLED",
                      )
                    }
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && completed.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <div className="eyebrow">
              HISTÓRICO
            </div>

            <h2 style={{ marginTop: "8px" }}>
              Follow-ups concluídos
            </h2>

            <div
              style={{
                display: "grid",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              {completed.map((followUp) => (
                <div
                  key={followUp.id}
                  className="card"
                  style={{
                    margin: 0,
                    padding: "18px 20px",
                    opacity: 0.7,
                  }}
                >
                  <strong>
                    {followUp.customer?.name ||
                      "Cliente"}
                  </strong>

                  <div className="muted">
                    {followUp.quote?.number || ""}
                    {" — "}
                    Concluído
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}