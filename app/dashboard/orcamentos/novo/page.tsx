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
          `/api/customers?companyId=${COMPANY_ID}`
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
          data.error || "Não foi possível calcular o preço."
        );
      }

      setResult(data.result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível calcular o preço."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveQuote() {
    if (!result || !customerId || !serviceName.trim()) {
      setError("Calcule o preço antes de salvar o orçamento.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          title: serviceName,
          description: `Serviço: ${serviceName}`,
          quantity: 1,
          unitPrice: result.recommendedPrice,
          pricingSnapshot: {
            result,
            inputs: {
              hours: Number(hours) || 0,
              hourlyRate: Number(hourlyRate) || 0,
              materials: Number(materials) || 0,
              otherExpenses: Number(otherExpenses) || 0,
              margin: Number(margin) || 0,
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Não foi possível salvar o orçamento."
        );
      }

      window.location.href = `/dashboard/orcamentos/${data.quote.id}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o orçamento."
      );
    } finally {
      setLoading(false);
    }
  }

  const selectedCustomer = customers.find(
    (customer) => customer.id === customerId
  );

  return (
    <main className="app-page">
      <header className="app-header">
        <div className="brand">
          Orça<span>Zap</span>
        </div>

        <div className="header-label">Novo orçamento</div>
      </header>

      <section className="app-container">

        <div className="page-intro">
          <div>
            <div className="eyebrow">NOVO ORÇAMENTO</div>

            <h1 className="page-title">
              Vamos criar sua proposta.
            </h1>

            <p className="page-subtitle">
              Escolha o cliente, informe os dados do serviço e descubra
              quanto cobrar.
            </p>
          </div>
        </div>

        <div className="form-card">

          <div className="form-card-header">
            <div className="step-number">1</div>

            <div>
              <h2>Cliente</h2>
              <p>Para quem você está preparando este orçamento?</p>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="customer">
              Cliente
            </label>

            {loadingCustomers ? (
              <div className="loading-field">
                Carregando clientes...
              </div>
            ) : customers.length === 0 ? (
              <div className="empty-field">
                Nenhum cliente cadastrado. Cadastre um cliente antes de
                criar um orçamento.
              </div>
            ) : (
              <>
                <select
                  id="customer"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  <option value="">
                    Selecione um cliente
                  </option>

                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>

                {selectedCustomer && (
                  <div className="customer-info">
                    {selectedCustomer.email && (
                      <span>{selectedCustomer.email}</span>
                    )}

                    {selectedCustomer.phone && (
                      <span>{selectedCustomer.phone}</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="form-card">

          <div className="form-card-header">
            <div className="step-number">2</div>

            <div>
              <h2>Dados do serviço</h2>
              <p>Informe os custos para calcular um preço adequado.</p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-field full-width">
              <label htmlFor="serviceName">
                Nome do serviço
              </label>

              <input
                id="serviceName"
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Ex.: Instalação elétrica"
              />
            </div>

            <div className="form-field">
              <label htmlFor="hours">
                Horas de trabalho
              </label>

              <input
                id="hours"
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Ex.: 8"
              />
              <span className="field-help">
                Quantidade de horas previstas
              </span>
            </div>

            <div className="form-field">
              <label htmlFor="hourlyRate">
                Valor da hora
              </label>

              <input
                id="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="Ex.: 80"
              />
              <span className="field-help">
                Quanto vale sua hora de trabalho
              </span>
            </div>

            <div className="form-field">
              <label htmlFor="materials">
                Materiais
              </label>

              <input
                id="materials"
                type="number"
                min="0"
                step="0.01"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="0,00"
              />
              <span className="field-help">
                Materiais utilizados no serviço
              </span>
            </div>

            <div className="form-field">
              <label htmlFor="otherExpenses">
                Outros custos
              </label>

              <input
                id="otherExpenses"
                type="number"
                min="0"
                step="0.01"
                value={otherExpenses}
                onChange={(e) => setOtherExpenses(e.target.value)}
                placeholder="0,00"
              />
              <span className="field-help">
                Deslocamento, taxas e outros gastos
              </span>
            </div>

            <div className="form-field">
              <label htmlFor="margin">
                Margem desejada
              </label>

              <div className="input-suffix">
                <input
                  id="margin"
                  type="number"
                  min="0"
                  max="90"
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  placeholder="40"
                />
                <span>%</span>
              </div>

              <span className="field-help">
                Margem de lucro desejada
              </span>
            </div>

          </div>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={loading || !customerId}
              className="primary-button"
            >
              {loading ? "Calculando..." : "Calcular preço"}
            </button>
          </div>

        </div>

        {result && (
          <div className="result-card-new">

            <div className="result-header">
              <div>
                <div className="eyebrow">
                  RESULTADO DA PRECIFICAÇÃO
                </div>

                <h2>{serviceName}</h2>

                <p>
                  Cliente: <strong>{selectedCustomer?.name}</strong>
                </p>
              </div>

              <div className="recommended-price">
                <span>Preço recomendado</span>
                <strong>
                  {formatMoney(result.recommendedPrice)}
                </strong>
              </div>
            </div>

            <p className="result-description">
              Este é o valor recomendado para atingir a margem
              informada.
            </p>

            <div className="result-grid-new">

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

            <div className="result-actions">
              <button
                type="button"
                onClick={handleSaveQuote}
                disabled={loading}
                className="primary-button"
              >
                {loading
                  ? "Salvando..."
                  : "Salvar orçamento"}
              </button>
            </div>

          </div>
        )}

      </section>
    </main>
  );
}