import Link from "next/link";

function Icon({
  type,
}: {
  type: "quote" | "clock" | "chart" | "money" | "plus" | "users" | "gear";
}) {
  const paths = {
    quote: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 17l5-5 3 3 7-8" />
        <path d="M15 7h4v4" />
      </>
    ),
    money: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8M9.5 10c.5-1 1.4-1.5 2.5-1.5 1.3 0 2.5.6 2.5 1.7 0 2.8-5 1-5 3.7 0 1.1 1.1 1.8 2.5 1.8 1.1 0 2-.5 2.5-1.5" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    users: (
      <>
        <circle cx="9" cy="9" r="3" />
        <circle cx="16" cy="10" r="2.5" />
        <path d="M3.5 19c.5-3 2.5-4.5 5.5-4.5s5 1.5 5.5 4.5M14 15c2.7-.2 4.5 1.1 5 3.5" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.2-1.6l1.5-1.2-2-3.4-1.8.7a7 7 0 0 0-2.8-1.6L13.5 3h-4l-.3 1.9a7 7 0 0 0-2.8 1.6l-1.8-.7-2 3.4 1.5 1.2A7 7 0 0 0 4 12c0 .6.1 1.1.2 1.6l-1.5 1.2 2 3.4 1.8-.7a7 7 0 0 0 2.8 1.6l.3 1.9h4l.3-1.9a7 7 0 0 0 2.8-1.6l1.8.7 2-3.4-1.5-1.2c.1-.5.2-1 .2-1.6Z" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
}

export default function Dashboard() {
  return (
    <main className="orca-dashboard">

      <header className="orca-header">
        <div className="orca-logo">
          <span className="orca-logo-mark">ϟ</span>
          <span>Orça<span>Zap</span></span>
        </div>

        <div className="orca-version">V1</div>
      </header>

      <section className="orca-hero">

        <div className="orca-hero-content">

          <div className="orca-eyebrow">
            ORÇAMENTOS PROFISSIONAIS
          </div>

          <h1>
            Transforme pedidos em{" "}
            <span>propostas claras.</span>
          </h1>

          <p>
            Uma base simples para prestadores criarem, precificarem e
            compartilharem orçamentos com rapidez.
          </p>

          <Link
            href="/dashboard/orcamentos/novo"
            className="orca-primary-button"
          >
            <Icon type="plus" />
            Abrir painel
          </Link>

        </div>

        <div className="orca-hero-visual">
          <div className="orca-floating-dot dot-one" />
          <div className="orca-floating-dot dot-two" />

          <div className="orca-document">
            <div className="document-line document-title" />
            <div className="document-line" />
            <div className="document-line" />
            <div className="document-line short" />
          </div>

          <div className="orca-check">✓</div>
        </div>

      </section>

      <section className="orca-metrics">

        <div className="orca-metric">
          <div className="metric-icon purple">
            <Icon type="quote" />
          </div>

          <div>
            <span>Orçamentos</span>
            <strong>0</strong>
            <small>Total de orçamentos</small>
          </div>
        </div>

        <div className="orca-metric">
          <div className="metric-icon yellow">
            <Icon type="clock" />
          </div>

          <div>
            <span>Em negociação</span>
            <strong>R$ 0</strong>
            <small>Valor em negociação</small>
          </div>
        </div>

        <div className="orca-metric">
          <div className="metric-icon green">
            <Icon type="chart" />
          </div>

          <div>
            <span>Conversão</span>
            <strong>—</strong>
            <small>Taxa de conversão</small>
          </div>
        </div>

        <div className="orca-metric">
          <div className="metric-icon blue">
            <Icon type="money" />
          </div>

          <div>
            <span>Valor fechado</span>
            <strong>R$ 0</strong>
            <small>Valor de orçamentos fechados</small>
          </div>
        </div>

      </section>

      <section className="orca-quick">

        <div className="orca-section-heading">
          <h2>Acesso rápido</h2>
          <p>Escolha uma opção para começar</p>
        </div>

        <div className="orca-actions">

          <Link
            href="/dashboard/orcamentos/novo"
            className="orca-action-card featured"
          >
            <div className="action-icon">
              <Icon type="plus" />
            </div>

            <div>
              <h3>Novo orçamento</h3>

              <p>
                Crie um orçamento profissional e descubra quanto cobrar pelo
                seu serviço.
              </p>

              <strong>Criar orçamento →</strong>
            </div>
          </Link>

          <Link
            href="/dashboard/clientes"
            className="orca-action-card"
          >
            <div className="action-icon">
              <Icon type="users" />
            </div>

            <div>
              <h3>Clientes</h3>

              <p>
                Cadastre e organize os dados dos seus clientes em um único
                lugar.
              </p>

              <strong>Ver clientes →</strong>
            </div>
          </Link>

          <Link
            href="/dashboard/precificacao"
            className="orca-action-card"
          >
            <div className="action-icon">
              <Icon type="gear" />
            </div>

            <div>
              <h3>Precificação</h3>

              <p>
                Cadastre seus serviços, custos, horas e valores para calcular
                preços com mais segurança.
              </p>

              <strong>Gerenciar serviços →</strong>
            </div>
          </Link>

          <Link
            href="/dashboard/followups"
            className="orca-action-card"
          >
            <div className="action-icon green-action">
              <Icon type="chart" />
            </div>

            <div>
              <h3>Follow-ups</h3>

              <p>
                Saiba quais clientes precisam de retorno e não deixe
                oportunidades para trás.
              </p>

              <strong>Acompanhar →</strong>
            </div>
          </Link>

        </div>

      </section>

      <section className="orca-tip">
        <div className="tip-bulb">✦</div>

        <div>
          <strong>Dica do OrçaZap</strong>

          <p>
            Cadastre seus serviços e custos na Precificação para agilizar a
            criação dos próximos orçamentos.
          </p>
        </div>
      </section>

    </main>
  );
}