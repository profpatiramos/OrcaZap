"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Customer = {
  id: string;
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
  total: string | number;
  customerId: string;
  customer: Customer;
  items: QuoteItem[];
};

function formatMoney(value: string | number) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function EditarOrcamentoPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [quotesResponse, customersResponse] = await Promise.all([
          fetch("/api/quotes"),
          fetch("/api/customers?companyId=cmstaaoh30000nt60wfy3hm3r"),
        ]);

        const quotesData = await quotesResponse.json();
        const customersData = await customersResponse.json();

        if (!quotesResponse.ok || !quotesData.ok) {
          throw new Error(
            quotesData.error ||
              "Não foi possível carregar o orçamento.",
          );
        }

        const found = quotesData.quotes.find(
          (item: Quote) => item.id === id,
        );

        if (!found) {
          throw new Error("Orçamento não encontrado.");
        }

        setQuote(found);

        setCustomerId(found.customerId);
        setTitle(found.title);
        setDescription(found.description || "");

        const firstItem = found.items?.[0];

        if (firstItem) {
          setQuantity(String(firstItem.quantity));
          setUnitPrice(String(firstItem.unitPrice));
        }

        if (customersResponse.ok && customersData.ok) {
          setCustomers(customersData.customers || []);
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

    loadData();
  }, [id]);

  async function handleSave() {
    if (!customerId) {
      setError("Selecione um cliente.");
      return;
    }

    if (!title.trim()) {
      setError("Informe o serviço.");
      return;
    }

    const qty = Number(quantity) || 1;
    const price = Number(unitPrice) || 0;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/quotes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          title,
          description,
          quantity: qty,
          unitPrice: price,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Não foi possível salvar o orçamento.",
        );
      }

      router.push(`/dashboard/orcamentos/${id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o orçamento.",
      );
    } finally {
      setSaving(false);
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

  if (!quote) {
    return (
      <main>
        <section className="main">
          <div className="card">
            <div className="error-box">
              {error || "Orçamento não encontrado."}
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/orcamentos")
              }
            >
              Voltar para orçamentos
            </button>
          </div>
        </section>
      </main>
    );
  }

  const calculatedTotal =
    (Number(quantity) || 0) * (Number(unitPrice) || 0);

  return (
    <main>
      <header className="top">
        <div className="brand">
          Orca<span>Zap</span>
        </div>

        <div className="muted">Editar orçamento</div>
      </header>

      <section className="main">
        <button
          type="button"
          onClick={() =>
            router.push(`/dashboard/orcamentos/${id}`)
          }
          style={{
            marginBottom: "24px",
            background: "transparent",
            color: "#555",
            padding: 0,
          }}
        >
          ← Voltar para orçamento
        </button>

        <div className="eyebrow">EDITAR ORÇAMENTO</div>

        <h1 className="title">Vamos ajustar sua proposta.</h1>

        <p className="subtitle">
          Altere os dados abaixo e salve as mudanças.
        </p>

        <div className="card">
          <h2>Cliente</h2>

          <label>Cliente</label>

          <select
            value={customerId}
            onChange={(e) =>
              setCustomerId(e.target.value)
            }
          >
            <option value="">
              Selecione um cliente
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div
          className="card"
          style={{ marginTop: "24px" }}
        >
          <h2>Dados do serviço</h2>

          <label>Nome do serviço</label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Ex.: Instalação elétrica"
          />

          <label>Descrição</label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Descreva o serviço..."
            rows={4}
          />

          <label>Quantidade</label>

          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
          />

          <label>Valor unitário</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={(e) =>
              setUnitPrice(e.target.value)
            }
            placeholder="R$ 0,00"
          />
        </div>

        <div
          className="card"
          style={{ marginTop: "24px" }}
        >
          <div className="eyebrow">
            NOVO TOTAL
          </div>

          <div className="price-highlight">
            {formatMoney(calculatedTotal)}
          </div>

          <p className="muted">
            O total será atualizado com base na
            quantidade e no valor unitário informados.
          </p>

          {error && (
            <div
              className="error-box"
              style={{ marginTop: "16px" }}
            >
              {error}
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
                  `/dashboard/orcamentos/${id}`,
                )
              }
              style={{
                background: "transparent",
                color: "#555",
              }}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="button"
            >
              {saving
                ? "Salvando..."
                : "Salvar alterações"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}