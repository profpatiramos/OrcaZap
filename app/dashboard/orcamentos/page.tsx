"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
};

type Quote = {
  id: string;
  number: string;
  title: string;
  description?: string | null;
  total: string | number;
  status: string;
  createdAt: string;
  customer: Customer;
};

function formatMoney(value: string | number) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

function formatStatus(status: string) {
  switch (status) {
    case "DRAFT":
      return "Rascunho";

    case "SENT":
      return "Enviado";

    case "VIEWED":
      return "Visualizado";

    case "ACCEPTED":
      return "Aceito";

    case "REJECTED":
      return "Recusado";

    case "EXPIRED":
      return "Expirado";

    case "CANCELLED":
      return "Cancelado";

    default:
      return status;
  }
}

export default function OrcamentosPage() {
  const router = useRouter();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadQuotes() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/quotes");

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Não foi possível carregar os orçamentos.",
        );
      }

      setQuotes(data.quotes || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os orçamentos.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  return (
    <main>
      <header className="top">
        <div className="brand">
          Orca<span>Zap</span>
        </div>

        <div className="muted">Meus orçamentos</div>
      </header>

      <section className="main">
        <div className="eyebrow">ORÇAMENTOS</div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "10px",
          }}
        >
          <div>
            <h1 className="title">Meus orçamentos.</h1>

            <p className="subtitle">
              Consulte e acompanhe todos os orçamentos criados.
            </p>
          </div>

          <a
            href="/dashboard/orcamentos/novo"
            className="button"
            style={{
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            + Novo orçamento
          </a>
        </div>

        {loading && (
          <div className="card">
            <p className="muted">Carregando orçamentos...</p>
          </div>
        )}

        {error && (
          <div className="card">
            <div className="error-box">{error}</div>

            <button
              type="button"
              className="button"
              onClick={loadQuotes}
              style={{ marginTop: "16px" }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && quotes.length === 0 && (
          <div className="card">
            <h2>Nenhum orçamento ainda.</h2>

            <p className="muted">
              Crie seu primeiro orçamento para começar.
            </p>

            <a
              href="/dashboard/orcamentos/novo"
              className="button"
              style={{
                display: "inline-block",
                textDecoration: "none",
                marginTop: "16px",
              }}
            >
              Criar primeiro orçamento
            </a>
          </div>
        )}

        {!loading && !error && quotes.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {quotes.map((quote) => (
              <div
                key={quote.id}
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
                  }}
                >
                  <div>
                    <div className="eyebrow">{quote.number}</div>

                    <h2 style={{ marginTop: "8px" }}>
                      {quote.title}
                    </h2>

                    <p className="muted">
                      Cliente: <strong>{quote.customer?.name}</strong>
                    </p>

                    <p className="muted">
                      Criado em {formatDate(quote.createdAt)}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div className="price-highlight">
                      {formatMoney(quote.total)}
                    </div>

                    <div
                      className="muted"
                      style={{
                        marginTop: "6px",
                        fontWeight: 600,
                      }}
                    >
                      {formatStatus(quote.status)}
                    </div>
                  </div>
                </div>

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
                      router.push(
                        `/dashboard/orcamentos/${quote.id}`,
                      )
                    }
                  >
                    Abrir orçamento
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}