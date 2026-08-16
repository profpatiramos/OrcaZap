import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import AcceptQuoteButton from "./components/AcceptQuoteButton";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

function formatMoney(value: string | number) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("pt-BR");
}

export default async function OrcamentoPublicoPage({
  params,
}: PageProps) {
  const { token } = await params;

  const quote = await db.quote.findUnique({
    where: {
      publicToken: token,
    },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!quote) {
    notFound();
  }

  // Registra que o orçamento foi visualizado.
  if (!quote.publicViewedAt) {
    await db.quote.update({
      where: {
        id: quote.id,
      },
      data: {
        publicViewedAt: new Date(),
      },
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f5",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        {/* CABEÇALHO */}
        <div
          style={{
            background: "#111",
            color: "#fff",
            borderRadius: "16px 16px 0 0",
            padding: "24px 28px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            Orca<span style={{ color: "#7dd3fc" }}>Zap</span>
          </div>

          <div
            style={{
              marginTop: "6px",
              opacity: 0.7,
              fontSize: "14px",
            }}
          >
            Proposta comercial
          </div>
        </div>

        {/* CONTEÚDO */}
        <div
          style={{
            background: "#fff",
            borderRadius: "0 0 16px 16px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          {/* INFORMAÇÕES PRINCIPAIS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "24px",
              flexWrap: "wrap",
              marginBottom: "32px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#777",
                }}
              >
                ORÇAMENTO
              </div>

              <h1
                style={{
                  margin: "8px 0 6px",
                  fontSize: "30px",
                }}
              >
                {quote.title}
              </h1>

              <div
                style={{
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                {quote.number} • Criado em{" "}
                {formatDate(quote.createdAt)}
              </div>
            </div>

            <div
              style={{
                textAlign: "right",
              }}
            >
              <div
                style={{
                  color: "#777",
                  fontSize: "13px",
                }}
              >
                Cliente
              </div>

              <strong
                style={{
                  display: "block",
                  marginTop: "4px",
                  fontSize: "18px",
                }}
              >
                {quote.customer.name}
              </strong>
            </div>
          </div>

          {/* SERVIÇO */}
          <div
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "28px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#777",
              }}
            >
              SERVIÇO
            </div>

            <h2
              style={{
                marginTop: "8px",
              }}
            >
              {quote.title}
            </h2>

            {quote.description && (
              <p
                style={{
                  color: "#666",
                  lineHeight: 1.6,
                }}
              >
                {quote.description}
              </p>
            )}
          </div>

          {/* ITENS */}
          <div
            style={{
              marginTop: "28px",
              borderTop: "1px solid #eee",
            }}
          >
            {quote.items.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "20px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong>{item.description}</strong>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "20px",
                    marginTop: "14px",
                  }}
                >
                  {/* QUANTIDADE */}
                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#777",
                        fontSize: "13px",
                      }}
                    >
                      Quantidade
                    </span>

                    <strong>{String(item.quantity)}</strong>
                  </div>

                  {/* VALOR UNITÁRIO */}
                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#777",
                        fontSize: "13px",
                      }}
                    >
                      Valor unitário
                    </span>

                    <strong>
                      {formatMoney(item.unitPrice.toNumber())}
                    </strong>
                  </div>

                  {/* TOTAL DO ITEM */}
                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#777",
                        fontSize: "13px",
                      }}
                    >
                      Total
                    </span>

                    <strong>
                      {formatMoney(item.total.toNumber())}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL DA PROPOSTA */}
          <div
            style={{
              marginTop: "32px",
              padding: "24px",
              borderRadius: "12px",
              background: "#f5f5f3",
              textAlign: "right",
            }}
          >
            <div
              style={{
                color: "#777",
                fontSize: "14px",
              }}
            >
              Valor total da proposta
            </div>

            <AcceptQuoteButton
              token={token}
              status={quote.status}
            />

            <div
              style={{
                marginTop: "6px",
                fontSize: "32px",
                fontWeight: 800,
              }}
            >
              {formatMoney(quote.total.toNumber())}
            </div>
          </div>

          {/* RODAPÉ */}
          <div
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid #eee",
              color: "#777",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            Esta proposta foi enviada através do OrcaZap.
          </div>
        </div>
      </div>
    </main>
  );
}