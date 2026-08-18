"use client";

import { useEffect, useState } from "react";
import DashboardBackButton from "@/app/components/DashboardBackButton";

type ServiceCost = {
  id: string;
  name: string;
  amount: string | number;
};

type Service = {
  id: string;
  name: string;
  description?: string | null;
  baseHourlyRate?: string | number | null;
  defaultQuantity?: string | number;
  costs: ServiceCost[];
};

type CostForm = {
  name: string;
  amount: string;
};

const COMPANY_ID = "cmstaaoh30000nt60wfy3hm3r";

function formatMoney(value: string | number) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function PrecificacaoPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [defaultQuantity, setDefaultQuantity] = useState("1");

  const [costs, setCosts] = useState<CostForm[]>([]);

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/services?companyId=${COMPANY_ID}`,
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Não foi possível carregar os serviços.",
        );
      }

      setServices(data.services || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os serviços.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setHourlyRate("");
    setDefaultQuantity("1");
    setCosts([]);
    setMessage("");
    setError("");
  }

  function openNewServiceForm() {
    resetForm();
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    resetForm();
  }

  function addCost() {
    setCosts((current) => [
      ...current,
      {
        name: "",
        amount: "",
      },
    ]);
  }

  function updateCost(
    index: number,
    field: keyof CostForm,
    value: string,
  ) {
    setCosts((current) =>
      current.map((cost, i) =>
        i === index
          ? {
              ...cost,
              [field]: value,
            }
          : cost,
      ),
    );
  }

  function removeCost(index: number) {
    setCosts((current) =>
      current.filter((_, i) => i !== index),
    );
  }

  function calculateCostTotal() {
    const labor =
      Number(hourlyRate || 0) *
      Number(defaultQuantity || 0);

    const additionalCosts = costs.reduce(
      (total, cost) => total + Number(cost.amount || 0),
      0,
    );

    return labor + additionalCosts;
  }

  async function saveService() {
    if (!name.trim()) {
      setError("Informe o nome do serviço.");
      return;
    }

    const parsedHourlyRate = Number(hourlyRate || 0);
    const parsedQuantity = Number(defaultQuantity || 1);

    if (parsedHourlyRate < 0) {
      setError("O valor da hora não pode ser negativo.");
      return;
    }

    if (parsedQuantity <= 0) {
      setError("Informe uma quantidade de horas maior que zero.");
      return;
    }

    const invalidCost = costs.find(
      (cost) =>
        cost.name.trim() && Number(cost.amount || 0) < 0,
    );

    if (invalidCost) {
      setError("Os valores dos custos não podem ser negativos.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          baseHourlyRate: parsedHourlyRate,
          defaultQuantity: parsedQuantity,
          costs: costs
            .filter((cost) => cost.name.trim())
            .map((cost) => ({
              name: cost.name.trim(),
              amount: Number(cost.amount || 0),
            })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Não foi possível salvar o serviço.",
        );
      }

      setMessage("Serviço cadastrado com sucesso!");
      setShowForm(false);
      resetForm();

      await loadServices();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o serviço.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <header className="top">
        <div className="brand">
          Orca<span>Zap</span>
        </div>

        <div className="muted">Precificação</div>
      </header>

      <section className="main">
        <div style={{ marginBottom: "24px" }}>
          <DashboardBackButton />
        </div>

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
            <div className="eyebrow">PRECIFICAÇÃO</div>

            <h1 className="title">Meus serviços.</h1>

            <p className="subtitle">
              Cadastre os serviços que você presta e seus
              principais custos.
            </p>
          </div>

          <button
            type="button"
            className="button"
            onClick={openNewServiceForm}
            disabled={showForm}
          >
            + Novo serviço
          </button>
        </div>

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px 16px",
              borderRadius: "10px",
              background: "#eef8f0",
              color: "#237a3b",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="card"
            style={{
              marginTop: "20px",
            }}
          >
            <div className="error-box">{error}</div>

            <button
              type="button"
              className="button"
              onClick={loadServices}
              disabled={loading}
              style={{ marginTop: "16px" }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {showForm && (
          <div
            className="card"
            style={{
              marginTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div>
                <div className="eyebrow">NOVO SERVIÇO</div>

                <h2 style={{ marginTop: "6px" }}>
                  Cadastrar serviço
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                style={{
                  background: "transparent",
                  color: "#666",
                  padding: 0,
                }}
              >
                Fechar
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              <div>
                <label>Nome do serviço</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Instalação elétrica"
                  style={{
                    width: "100%",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div>
                <label>Valor da hora (R$)</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) =>
                    setHourlyRate(e.target.value)
                  }
                  placeholder="80,00"
                  style={{
                    width: "100%",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div>
                <label>Horas padrão</label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={defaultQuantity}
                  onChange={(e) =>
                    setDefaultQuantity(e.target.value)
                  }
                  style={{
                    width: "100%",
                    marginTop: "6px",
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label>Descrição</label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Descreva o serviço..."
                rows={3}
                style={{
                  width: "100%",
                  marginTop: "6px",
                  resize: "vertical",
                }}
              />
            </div>

            <div
              style={{
                marginTop: "28px",
                paddingTop: "24px",
                borderTop: "1px solid #eee",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3>Itens e custos</h3>

                  <p className="muted">
                    Cadastre materiais, deslocamentos ou
                    outros custos deste serviço.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addCost}
                  disabled={saving}
                  style={{
                    background: "transparent",
                    color: "#111",
                    padding: 0,
                    fontWeight: 700,
                  }}
                >
                  + Adicionar custo
                </button>
              </div>

              {costs.length === 0 && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "18px",
                    borderRadius: "10px",
                    background: "#f7f7f5",
                  }}
                >
                  <p className="muted">
                    Nenhum custo adicionado ainda.
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gap: "10px",
                  marginTop: "16px",
                }}
              >
                {costs.map((cost, index) => (
                  <div
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "minmax(0, 1fr) 180px auto",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      value={cost.name}
                      onChange={(e) =>
                        updateCost(
                          index,
                          "name",
                          e.target.value,
                        )
                      }
                      placeholder="Ex.: Material elétrico"
                      disabled={saving}
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cost.amount}
                      onChange={(e) =>
                        updateCost(
                          index,
                          "amount",
                          e.target.value,
                        )
                      }
                      placeholder="Valor"
                      disabled={saving}
                    />

                    <button
                      type="button"
                      onClick={() => removeCost(index)}
                      disabled={saving}
                      style={{
                        background: "transparent",
                        color: "#b42318",
                        padding: "8px",
                      }}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: "24px",
                padding: "18px",
                borderRadius: "10px",
                background: "#f5f5f3",
              }}
            >
              <div className="muted">
                Custo estimado do serviço
              </div>

              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  marginTop: "4px",
                }}
              >
                {formatMoney(calculateCostTotal())}
              </div>

              <p
                className="muted"
                style={{ marginTop: "6px" }}
              >
                Mão de obra + custos adicionais cadastrados.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "24px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                style={{
                  background: "transparent",
                  color: "#555",
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="button"
                onClick={saveService}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar serviço"}
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gap: "16px",
            marginTop: "28px",
          }}
        >
          {loading && (
            <div className="card">
              <p className="muted">
                Carregando serviços...
              </p>
            </div>
          )}

          {!loading &&
            services.length === 0 &&
            !showForm && (
              <div className="card">
                <h2>Nenhum serviço cadastrado.</h2>

                <p className="muted">
                  Cadastre seus serviços para que eles
                  possam ser utilizados automaticamente nos
                  orçamentos.
                </p>

                <button
                  type="button"
                  className="button"
                  onClick={openNewServiceForm}
                  style={{ marginTop: "16px" }}
                >
                  Cadastrar primeiro serviço
                </button>
              </div>
            )}

          {!loading &&
            services.map((service) => {
              const labor =
                Number(service.baseHourlyRate || 0) *
                Number(service.defaultQuantity || 0);

              const costsTotal = service.costs.reduce(
                (total, cost) =>
                  total + Number(cost.amount || 0),
                0,
              );

              const totalCost = labor + costsTotal;

              return (
                <div
                  key={service.id}
                  className="card"
                  style={{ margin: 0 }}
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
                      <div className="eyebrow">SERVIÇO</div>

                      <h2
                        style={{
                          marginTop: "6px",
                        }}
                      >
                        {service.name}
                      </h2>

                      {service.description && (
                        <p className="muted">
                          {service.description}
                        </p>
                      )}
                    </div>

                    <div
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <div className="muted">
                        Custo estimado
                      </div>

                      <div className="price-highlight">
                        {formatMoney(totalCost)}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "12px",
                      marginTop: "20px",
                    }}
                  >
                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "10px",
                        background: "#f7f7f5",
                      }}
                    >
                      <div className="muted">
                        Valor/hora
                      </div>

                      <strong>
                        {formatMoney(
                          service.baseHourlyRate || 0,
                        )}
                      </strong>
                    </div>

                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "10px",
                        background: "#f7f7f5",
                      }}
                    >
                      <div className="muted">
                        Horas padrão
                      </div>

                      <strong>
                        {String(
                          service.defaultQuantity || 1,
                        )}
                      </strong>
                    </div>

                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "10px",
                        background: "#f7f7f5",
                      }}
                    >
                      <div className="muted">
                        Itens de custo
                      </div>

                      <strong>
                        {service.costs.length}
                      </strong>
                    </div>
                  </div>

                  {service.costs.length > 0 && (
                    <div
                      style={{
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: "1px solid #eee",
                      }}
                    >
                      <strong>
                        Composição dos custos
                      </strong>

                      <div
                        style={{
                          display: "grid",
                          gap: "8px",
                          marginTop: "12px",
                        }}
                      >
                        {service.costs.map((cost) => (
                          <div
                            key={cost.id}
                            style={{
                              display: "flex",
                              justifyContent:
                                "space-between",
                              gap: "20px",
                            }}
                          >
                            <span>{cost.name}</span>

                            <strong>
                              {formatMoney(cost.amount)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>
    </main>
  );
}