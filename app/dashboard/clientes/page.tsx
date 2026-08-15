"use client";

import { useEffect, useState } from "react";

const COMPANY_ID = "cmstaaoh30000nt60wfy3hm3r";

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

type PricingResult = {
  quantity: number;
  laborCost: number;
  materialsCost: number;
  thirdPartyCost: number;
  travelCost: number;
  otherExpenses: number;
  operatingCost: number;
  taxAmount: number;
  totalCost: number;
  minimumPrice: number;
  recommendedPrice: number;
  premiumPrice: number;
  recommendedMargin: number;
  warning?: string;
};

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function NovoOrcamento() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");

  const [serviceName, setServiceName] = useState("");
  const [hours, setHours] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [materials, setMaterials] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");
  const [margin, setMargin] = useState("40");

  const [result, setResult] = useState<PricingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch(
          `/api/customers?companyId=${COMPANY_ID}`,
        );

        const data = await response.json();

        if (response.ok && data.ok) {
          setCustomers(data.customers || []);
        }
      } catch {
        setError("Não foi possível carregar os clientes.");
      } finally {
        setLoadingCustomers(false);
      }
    }

    loadCustomers();
  }, []);

  async function handleCalculate() {
    if (!customerId) {
      setError("Selecione um cliente antes de calcular o orçamento.");
      return;
    }

    if (!serviceName.trim()) {
      setError("Informe o nome do serviço.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/pricing/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: 1,
          hours: Number(hours) || 0,
          hourlyRate: Number(hourlyRate) || 0,
          materials: Number(materials) || 0,
          thirdPartyCosts: 0,
          travelExpenses: 0,
          otherExpenses: Number(otherExpenses) || 0,
          taxRate: 0,
          desiredMargin: Number(margin) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Não foi possível calcular o preço.",
        );
      }

      setResult(data.result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível calcular o preço.",
      );
    } finally {
      setLoading(false);
    }
  }

  const selectedCustomer = customers.find(
    (customer) => customer.id === customerId,
  );

  return (
    <main>
      <header className="top">
        <div className="brand">
          Orca<span>Zap</span>
        </div>

        <div className="muted">Novo orçamento</div>
      </header>

      <section className="main">
        <div className="eyebrow">NOVO ORÇAMENTO</div>

        <h1 className="title">Vamos criar sua proposta.</h1>

        <p className="subtitle">
          Primeiro, vamos escolher o cliente e entender o serviço.
        </p>

        <div className="card">
          <h2>Cliente</h2>

          <label>Selecione o cliente</label>

          {loadingCustomers ? (
            <p className="muted">Carregando clientes...</p>
          ) : customers.length === 0 ? (
            <p className="muted">
              Nenhum cliente cadastrado. Cadastre um cliente antes de criar
              um orçamento.
            </p>
          ) : (
            <>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">Selecione um cliente</option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>

              {selectedCustomer && (
                <p className="muted" style={{ marginTop: "10px" }}>
                  {selectedCustomer.email || ""}
                  {selectedCustomer.email && selectedCustomer.phone
                    ? " • "
                    : ""}
                  {selectedCustomer.phone || ""}
                </p>
              )}
            </>
          )}
        </div>

        <div className="card" style={{ marginTop: "24px" }}>
          <h2>Dados do serviço</h2>

          <label>Nome do serviço</label>

          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Ex.: Instalação elétrica"
          />

          <label>Horas de trabalho</label>

          <input
            type="number"
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Ex.: 8"
          />

          <label>Valor da hora</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="Ex.: 80"
          />

          <label>Materiais</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            placeholder="R$ 0,00"
          />

          <label>Outros custos</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={otherExpenses}
            onChange={(e) => setOtherExpenses(e.target.value)}
            placeholder="R$ 0,00"
          />

          <label>Margem desejada (%)</label>

          <input
            type="number"
            min="0"
            max="90"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            placeholder="Ex.: 40"
          />

          <button
            type="button"
            onClick={handleCalculate}
            disabled={loading || !customerId}
            className="button"
          >
            {loading ? "Calculando..." : "Calcular preço"}
          </button>

          {error && (
            <div className="error-box" style={{ marginTop: "16px" }}>
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="card result-card" style={{ marginTop: "24px" }}>
            <div className="eyebrow">RESULTADO DA PRECIFICAÇÃO</div>

            <p className="muted" style={{ marginBottom: "4px" }}>
              Cliente
            </p>

            <h2>{selectedCustomer?.name}</h2>

            <p className="muted">
              {serviceName}
            </p>

            <div className="price-highlight">
              {formatMoney(result.recommendedPrice)}
            </div>

            <p className="muted">
              Preço recomendado para atingir a margem informada.
            </p>

            <div className="result-grid">
              <div>
                <span>Custo operacional</span>
                <strong>
                  {formatMoney(result.operatingCost)}
                </strong>
              </div>

              <div>
                <span>Custo total</span>
                <strong>
                  {formatMoney(result.totalCost)}
                </strong>
              </div>

              <div>
                <span>Preço mínimo</span>
                <strong>
                  {formatMoney(result.minimumPrice)}
                </strong>
              </div>

              <div>
                <span>Preço premium</span>
                <strong>
                  {formatMoney(result.premiumPrice)}
                </strong>
              </div>

              <div>
                <span>Mão de obra</span>
                <strong>
                  {formatMoney(result.laborCost)}
                </strong>
              </div>

              <div>
                <span>Materiais</span>
                <strong>
                  {formatMoney(result.materialsCost)}
                </strong>
              </div>
            </div>

            {result.warning && (
              <div className="warning-box">
                {result.warning}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}