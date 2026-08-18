"use client";

import { useEffect, useState } from "react";
import DashboardBackButton from "@/app/components/DashboardBackButton";

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

  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [savingCustomer, setSavingCustomer] = useState(false);

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
  const [customerMessage, setCustomerMessage] = useState("");

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

  async function handleCreateCustomer() {
    if (!newCustomerName.trim()) {
      setCustomerMessage("Informe o nome do cliente.");
      return;
    }

    setSavingCustomer(true);
    setCustomerMessage("");
    setError("");

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: COMPANY_ID,
          name: newCustomerName.trim(),
          email: newCustomerEmail.trim() || null,
          phone: newCustomerPhone.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Não foi possível cadastrar o cliente.",
        );
      }

      const newCustomer = data.customer as Customer;

      setCustomers((current) => [
        newCustomer,
        ...current,
      ]);

      setCustomerId(newCustomer.id);

      setNewCustomerName("");
      setNewCustomerEmail("");
      setNewCustomerPhone("");

      setShowNewCustomer(false);

      setCustomerMessage(
        "Cliente cadastrado com sucesso.",
      );
    } catch (err) {
      setCustomerMessage(
        err instanceof Error
          ? err.message
          : "Não foi possível cadastrar o cliente.",
      );
    } finally {
      setSavingCustomer(false);
    }
  }

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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <DashboardBackButton />

          <div className="muted">Novo orçamento</div>
        </div>
      </header>

      <section className="main">
        <div className="eyebrow">NOVO ORÇAMENTO</div>

        <h1 className="title">
          Vamos criar sua proposta.
        </h1>

        <p className="subtitle">
          Primeiro, vamos escolher o cliente e entender o serviço.
        </p>

        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ margin: 0 }}>
              Cliente
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowNewCustomer((current) => !current);
                setCustomerMessage("");
              }}
              style={{
                border: "none",
                background: "transparent",
                color: "#6d45ff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {showNewCustomer
                ? "Cancelar"
                : "+ Cadastrar novo cliente"}
            </button>
          </div>

          {showNewCustomer && (
            <div
              style={{
                border: "1px solid #e1e5ef",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                background: "#fafbff",
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                Novo cliente
              </h3>

              <label>Nome *</label>

              <input
                type="text"
                value={newCustomerName}
                onChange={(e) =>
                  setNewCustomerName(e.target.value)
                }
                placeholder="Nome do cliente"
              />

              <label>E-mail</label>

              <input
                type="email"
                value={newCustomerEmail}
                onChange={(e) =>
                  setNewCustomerEmail(e.target.value)
                }
                placeholder="cliente@email.com"
              />

              <label>Telefone / WhatsApp</label>

              <input
                type="text"
                value={newCustomerPhone}
                onChange={(e) =>
                  setNewCustomerPhone(e.target.value)
                }
                placeholder="(45) 99999-9999"
              />

              <button
                type="button"
                onClick={handleCreateCustomer}
                disabled={savingCustomer}
                className="button"
              >
                {savingCustomer
                  ? "Salvando..."
                  : "Cadastrar cliente"}
              </button>

              {customerMessage && (
                <div
                  style={{
                    marginTop: "12px",
                    color: customerMessage.includes("sucesso")
                      ? "#16834b"
                      : "#c62828",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {customerMessage}
                </div>
              )}
            </div>
          )}

          <label>Selecione o cliente</label>

          {loadingCustomers ? (
            <p className="muted">
              Carregando clientes...
            </p>
          ) : customers.length === 0 ? (
            <p className="muted">
              Nenhum cliente cadastrado. Use o botão acima para cadastrar
              seu primeiro cliente.
            </p>
          ) : (
            <>
              <select
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  setCustomerMessage("");
                }}
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

              {selectedCustomer && (
                <p
                  className="muted"
                  style={{ marginTop: "10px" }}
                >
                  {selectedCustomer.email || ""}
                  {selectedCustomer.email &&
                  selectedCustomer.phone
                    ? " • "
                    : ""}
                  {selectedCustomer.phone || ""}
                </p>
              )}
            </>
          )}
        </div>

        <div
          className="card"
          style={{ marginTop: "24px" }}
        >
          <h2>Dados do serviço</h2>

          <label>Nome do serviço</label>

          <input
            type="text"
            value={serviceName}
            onChange={(e) =>
              setServiceName(e.target.value)
            }
            placeholder="Ex.: Instalação elétrica"
          />

          <label>Horas de trabalho</label>

          <input
            type="number"
            min="0"
            value={hours}
            onChange={(e) =>
              setHours(e.target.value)
            }
            placeholder="Ex.: 8"
          />

          <label>Valor da hora</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={hourlyRate}
            onChange={(e) =>
              setHourlyRate(e.target.value)
            }
            placeholder="Ex.: 80"
          />

          <label>Materiais</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={materials}
            onChange={(e) =>
              setMaterials(e.target.value)
            }
            placeholder="R$ 0,00"
          />

          <label>Outros custos</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={otherExpenses}
            onChange={(e) =>
              setOtherExpenses(e.target.value)
            }
            placeholder="R$ 0,00"
          />

          <label>Margem desejada (%)</label>

          <input
            type="number"
            min="0"
            max="90"
            value={margin}
            onChange={(e) =>
              setMargin(e.target.value)
            }
            placeholder="Ex.: 40"
          />

          <button
            type="button"
            onClick={handleCalculate}
            disabled={loading || !customerId}
            className="button"
          >
            {loading
              ? "Calculando..."
              : "Calcular preço"}
          </button>

          {error && (
            <div
              className="error-box"
              style={{ marginTop: "16px" }}
            >
              {error}
            </div>
          )}
        </div>

        {result && (
          <div
            className="card result-card"
            style={{ marginTop: "24px" }}
          >
            <div className="eyebrow">
              RESULTADO DA PRECIFICAÇÃO
            </div>

            <p
              className="muted"
              style={{ marginBottom: "4px" }}
            >
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