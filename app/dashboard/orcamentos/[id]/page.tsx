"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Customer = {
  name: string;
  email?: string | null;
  phone?: string | null;
};

type QuoteItem = {
  id: string;
  description: string;
  quantity: string | number;
  unitPrice: string | number;
  total: string | number;
};

type Quote = {
  id: string;
  number: string;
  title: string;
  description?: string | null;
  subtotal: string | number;
  total: string | number;
  status: string;
  createdAt: string;
  customer: Customer;
  items: QuoteItem[];
  pricingSnapshot?: any;
  publicToken?: string | null;
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

export default function AbrirOrcamentoPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [publishing, setPublishing] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");
  const [publishMessage, setPublishMessage] = useState("");

  useEffect(() => {
    async function loadQuote() {
      try {
        setLoading(true);

        const response = await fetch("/api/quotes");

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(
            data.error || "Não foi possível carregar o orçamento.",
          );
        }

        const found = data.quotes.find(
          (item: Quote) => item.id === id,
        );

        if (!found) {
          throw new Error("Orçamento não encontrado.");
        }

        setQuote(found);

        if (found.publicToken) {
          setPublicUrl(
            `${window.location.origin}/orcamento/${found.publicToken}`,
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o orçamento.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuote();
  }, [id]);

  async function handlePublish() {
    setPublishing(true);
    setError("");
    setPublishMessage("");

    try {
      const response = await fetch(`/api/quotes/${id}/publish`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Não foi possível publicar o orçamento.",
        );
      }

      const fullUrl = `${window.location.origin}${data.publicUrl}`;

      setPublicUrl(fullUrl);
      setPublishMessage("Orçamento publicado com sucesso!");

      setQuote((current) =>
        current
          ? {
              ...current,
              publicToken: data.publicToken,
            }
          : current,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível publicar o orçamento.",
      );
    } finally {
      setPublishing(false);
    }
  }

  async function handleCopyLink() {
    if (!publicUrl) return;

    try {
      await navigator.clipboard.writeText(publicUrl);
      setPublishMessage("Link copiado!");
    } catch {
      setPublishMessage(
        "Não foi possível copiar automaticamente. Selecione o link e copie.",
      );
    }
  }

  if (loading) {
    return (
      <main>
        <section className="main">
          <p className="muted">Carregando orçamento...</p>
        </section>
      </main>
    );
  }

  if (error && !quote) {
    return (
      <main>
        <section className="main">
          <div className="card">
            <div className="error-box">
              {error || "Orçamento não encontrado."}
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard/orcamentos")}
            >
              Voltar para orçamentos
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!quote) {
    return null;
  }

  const pricing = quote.pricingSnapshot?.result;

  return (
    <main>
      <header className="top">
        <div className="brand">
          Orca<span>Zap</span>
        </div>

        <div className="muted">Orçamento</div>
      </header>

      <section className="main">
        <button
          type="button"
          onClick={() => router.push("/dashboard/orcamentos")}
          style={{
            marginBottom: "24px",
            background: "transparent",
            color: "#555",
            padding: 0,
          }}
        >
          ← Voltar para orçamentos
        </button>

        <div className="eyebrow">ORÇAMENTO</div>

        <h1 className="title">{quote.title}</h1>

        <p className="subtitle">
          {quote.number} • Criado em {formatDate(quote.createdAt)}
        </p>

        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="eyebrow">CLIENTE</div>

              <h2>{quote.customer.name}</h2>

              {quote.customer.email && (
                <p className="muted">
                  {quote.customer.email}
                </p>
              )}

              {quote.customer.phone && (
                <p className="muted">
                  {quote.customer.phone}
                </p>
              )}
            </div>

            <div style={{ textAlign: "right" }}>
              <div className="muted">Status</div>

              <strong>
                {quote.status === "DRAFT"
                  ? "Rascunho"
                  : quote.status}
              </strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="eyebrow">SERVIÇO</div>

          <h2>{quote.title}</h2>

          {quote.description && (
            <p className="muted">
              {quote.description}
            </p>
          )}

          {quote.items.map((item) => (
            <div
              key={item.id}
              style={{
                marginTop: "24px",
                paddingTop: "24px",
                borderTop: "1px solid #eee",
              }}
            >
              <strong>{item.description}</strong>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "16px",
                  marginTop: "16px",
                }}
              >
                <div>
                  <span className="muted">Quantidade</span>

                  <strong style={{ display: "block" }}>
                    {item.quantity}
                  </strong>
                </div>

                <div>
                  <span className="muted">
                    Valor unitário
                  </span>

                  <strong style={{ display: "block" }}>
                    {formatMoney(item.unitPrice)}
                  </strong>
                </div>

                <div>
                  <span className="muted">Total</span>

                  <strong style={{ display: "block" }}>
                    {formatMoney(item.total)}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pricing && (
          <div className="card">
            <div className="eyebrow">
              PRECIFICAÇÃO
            </div>

            <div className="result-grid">
              <div>
                <span>Custo operacional</span>

                <strong>
                  {formatMoney(pricing.operatingCost)}
                </strong>
              </div>

              <div>
                <span>Custo total</span>

                <strong>
                  {formatMoney(pricing.totalCost)}
                </strong>
              </div>

              <div>
                <span>Mão de obra</span>

                <strong>
                  {formatMoney(pricing.laborCost)}
                </strong>
              </div>

              <div>
                <span>Materiais</span>

                <strong>
                  {formatMoney(pricing.materialsCost)}
                </strong>
              </div>

              <div>
                <span>Preço mínimo</span>

                <strong>
                  {formatMoney(pricing.minimumPrice)}
                </strong>
              </div>

              <div>
                <span>Preço premium</span>

                <strong>
                  {formatMoney(pricing.premiumPrice)}
                </strong>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="eyebrow">
            TOTAL DO ORÇAMENTO
          </div>

          <div className="price-highlight">
            {formatMoney(quote.total)}
          </div>

          <p className="muted">
            Valor total apresentado neste orçamento.
          </p>

          {error && (
            <div
              className="error-box"
              style={{ marginTop: "16px" }}
            >
              {error}
            </div>
          )}

          {publishMessage && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "#eefbf3",
                color: "#176b3a",
              }}
            >
              {publishMessage}
            </div>
          )}

          {publicUrl && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                background: "#fafafa",
              }}
            >
              <div
                className="muted"
                style={{ marginBottom: "8px" }}
              >
                Link público do orçamento
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={publicUrl}
                  readOnly
                  style={{
                    flex: 1,
                    minWidth: "280px",
                  }}
                />

                <button
                  type="button"
                  onClick={handleCopyLink}
                >
                  Copiar link
                </button>

                <button
                  type="button"
                  onClick={() =>
                    window.open(publicUrl, "_blank")
                  }
                >
                  Abrir link
                </button>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/orcamentos/${id}/editar`,
                )
              }
            >
              Editar orçamento
            </button>

            <button
              type="button"
              onClick={() => window.print()}
            >
              Gerar PDF
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing
                ? "Publicando..."
                : publicUrl
                  ? "Atualizar link público"
                  : "Publicar orçamento"}
            </button>

            <button
              type="button"
              onClick={() => {
                const phone =
                  quote.customer?.phone?.replace(/\D/g, "");

                if (!phone) {
                  alert(
                    "Este cliente não possui telefone cadastrado.",
                  );
                  return;
                }

                const whatsappPhone = phone.startsWith("55")
                  ? phone
                  : `55${phone}`;

                const message = `Olá, ${quote.customer.name}! Tudo bem?

Preparei com carinho o seu orçamento para o serviço de "${quote.title}".

Orçamento: ${quote.number}
Valor total: ${formatMoney(quote.total)}

Espero que a proposta esteja de acordo com o que você precisa. Se tiver qualquer dúvida ou quiser conversar sobre algum detalhe, estou à disposição para te ajudar!

Um abraço e obrigado(a) pela confiança!`;

                const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  message,
                )}`;

                window.open(url, "_blank");
              }}
            >
              Enviar pelo WhatsApp
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}