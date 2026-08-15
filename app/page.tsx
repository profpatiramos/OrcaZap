import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="brand">
          Orça<span>Zap</span>
        </div>

        <div className="header-right">
          <span>Meu painel</span>
        </div>
      </header>

      <section className="dashboard-container">

        {/* CABEÇALHO */}
        <div className="dashboard-welcome">
          <div>
            <div className="eyebrow">PAINEL DE CONTROLE</div>

            <h1>
              Olá! <span className="wave">👋</span>
            </h1>

            <p>
              Organize seus clientes, serviços e orçamentos em um só lugar.
            </p>
          </div>

          <Link
            href="/dashboard/orcamentos/novo"
            className="primary-button"
          >
            <span>＋</span>
            Novo orçamento
          </Link>
        </div>

        {/* MÉTRICAS */}
        <div className="metrics-grid">

          <div className="metric-card">
            <div className="metric-icon metric-blue">👥</div>
            <div>
              <span>Clientes</span>
              <strong>—</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon metric-purple">📄</div>
            <div>
              <span>Orçamentos</span>
              <strong>—</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon metric-orange">⚙</div>
            <div>
              <span>Serviços</span>
              <strong>—</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon metric-green">↗</div>
            <div>
              <span>Follow-ups</span>
              <strong>—</strong>
            </div>
          </div>

        </div>

        {/* ACESSO RÁPIDO */}
        <div className="section-heading">
          <div className="eyebrow">ACESSO RÁPIDO</div>
          <h2>O que você deseja fazer?</h2>
        </div>

        <div className="actions-grid">

          <Link
            href="/dashboard/orcamentos/novo"
            className="action-card action-featured"
          >
            <div className="action-icon">＋</div>

            <div className="action-content">
              <h3>Novo orçamento</h3>

              <p>
                Crie um orçamento profissional e descubra quanto cobrar
                pelo seu serviço.
              </p>

              <span>Criar orçamento →</span>
            </div>
          </Link>

          <Link
            href="/dashboard/clientes"
            className="action-card"
          >
            <div className="action-icon action-blue">👥</div>

            <div className="action-content">
              <h3>Clientes</h3>

              <p>
                Cadastre e organize os dados dos seus clientes em um
                único lugar.
              </p>

              <span>Ver clientes →</span>
            </div>
          </Link>

          <Link
            href="/dashboard/precificacao"
            className="action-card"
          >
            <div className="action-icon action-purple">⚙</div>

            <div className="action-content">
              <h3>Precificação</h3>

              <p>
                Cadastre seus serviços, custos, horas e valores para
                calcular preços com mais segurança.
              </p>

              <span>Gerenciar serviços →</span>
            </div>
          </Link>

          <Link
            href="/dashboard/followups"
            className="action-card"
          >
            <div className="action-icon action-green">↗</div>

            <div className="action-content">
              <h3>Follow-ups</h3>

              <p>
                Saiba quais clientes precisam de retorno e não deixe
                oportunidades para trás.
              </p>

              <span>Acompanhar →</span>
            </div>
          </Link>

        </div>

        {/* DICA */}
        <div className="dashboard-tip">
          <div className="tip-icon">💡</div>

          <div>
            <strong>Dica do OrçaZap</strong>

            <p>
              Cadastre seus serviços e custos na Precificação para
              agilizar a criação dos próximos orçamentos.
            </p>
          </div>
        </div>

      </section>
    </main>
  );
}