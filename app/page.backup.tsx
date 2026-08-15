"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            <span className="logo-main">Orça</span>
            <span className="logo-accent">Zap</span>
          </div>

          <div className="header-right">
            <span className="version">V1</span>

            <Link href="/dashboard" className="header-button">
              Entrar no painel
            </Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="eyebrow">
              ORÇAMENTOS PROFISSIONAIS
            </div>

            <h1>
              Transforme pedidos em
              <span> propostas que vendem.</span>
            </h1>

            <p className="hero-description">
              O OrçaZap ajuda prestadores de serviços a calcular preços,
              criar orçamentos profissionais e acompanhar seus clientes
              em um único lugar.
            </p>

            <div className="hero-actions">
              <Link
                href="/dashboard"
                className="primary-button"
              >
                Abrir meu painel
                <span>→</span>
              </Link>

              <span className="hero-note">
                Simples. Profissional. Rápido.
              </span>
            </div>

            <div className="trust">
              <div className="trust-item">
                <strong>01</strong>
                <span>Cadastre seus serviços</span>
              </div>

              <div className="trust-item">
                <strong>02</strong>
                <span>Calcule quanto cobrar</span>
              </div>

              <div className="trust-item">
                <strong>03</strong>
                <span>Envie seu orçamento</span>
              </div>
            </div>
          </div>

          <div className="hero-preview">
            <div className="preview-window">
              <div className="preview-top">
                <div className="preview-logo">
                  Orça<span>Zap</span>
                </div>

                <div className="preview-status">
                  Painel
                </div>
              </div>

              <div className="preview-body">
                <div className="preview-welcome">
                  <div>
                    <small>PAINEL DE CONTROLE</small>
                    <h2>Olá!</h2>
                  </div>

                  <div className="preview-button">
                    + Novo orçamento
                  </div>
                </div>

                <div className="preview-metrics">
                  <div>
                    <small>CLIENTES</small>
                    <strong>24</strong>
                  </div>

                  <div>
                    <small>ORÇAMENTOS</small>
                    <strong>38</strong>
                  </div>

                  <div>
                    <small>EM NEGOCIAÇÃO</small>
                    <strong>R$ 8.450</strong>
                  </div>
                </div>

                <div className="preview-section">
                  <small>ACESSO RÁPIDO</small>
                  <h3>O que você deseja fazer?</h3>
                </div>

                <div className="preview-cards">
                  <div className="preview-card featured">
                    <div className="preview-icon">+</div>
                    <div>
                      <strong>Novo orçamento</strong>
                      <span>Criar proposta profissional</span>
                    </div>
                  </div>

                  <div className="preview-card">
                    <div className="preview-icon blue">◉</div>
                    <div>
                      <strong>Clientes</strong>
                      <span>Organizar seus clientes</span>
                    </div>
                  </div>

                  <div className="preview-card">
                    <div className="preview-icon purple">◈</div>
                    <div>
                      <strong>Precificação</strong>
                      <span>Calcular seus preços</span>
                    </div>
                  </div>

                  <div className="preview-card">
                    <div className="preview-icon green">↗</div>
                    <div>
                      <strong>Follow-ups</strong>
                      <span>Acompanhar propostas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-one">
              <span className="floating-icon">✓</span>
              <div>
                <strong>Orçamento enviado</strong>
                <small>Cliente recebeu sua proposta</small>
              </div>
            </div>

            <div className="floating-card floating-card-two">
              <span className="floating-value">R$ 784,31</span>
              <small>Preço recomendado</small>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-heading">
            <span>FEITO PARA QUEM PRESTA SERVIÇOS</span>
            <h2>
              Menos tempo calculando.
              <br />
              Mais tempo trabalhando.
            </h2>
          </div>

          <div className="feature-grid">
            <div className="feature">
              <div className="feature-number">01</div>
              <h3>Precifique melhor</h3>
              <p>
                Considere seus custos, horas de trabalho, margem e
                despesas para chegar a um preço mais seguro.
              </p>
            </div>

            <div className="feature">
              <div className="feature-number">02</div>
              <h3>Orçamentos profissionais</h3>
              <p>
                Crie propostas claras e organizadas para apresentar
                seu serviço com mais profissionalismo.
              </p>
            </div>

            <div className="feature">
              <div className="feature-number">03</div>
              <h3>Não perca oportunidades</h3>
              <p>
                Acompanhe seus orçamentos e saiba quando é hora de
                entrar novamente em contato com o cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <div>
            <span>ORÇAZAP</span>
            <h2>Seu serviço merece um orçamento profissional.</h2>
          </div>

          <Link href="/dashboard" className="primary-button light">
            Começar agora
            <span>→</span>
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="logo">
            <span className="logo-main">Orça</span>
            <span className="logo-accent">Zap</span>
          </div>

          <span>
            Uma solução <strong>MY DIGITAL BOX</strong>
          </span>
        </div>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .home {
          min-height: 100vh;
          background: #f7f8fc;
          color: #10234f;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .container {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
        }

        .header {
          height: 76px;
          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid #e8eaf1;
        }

        .header-inner {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-size: 25px;
          font-weight: 850;
          letter-spacing: -1.2px;
        }

        .logo-main {
          color: #10234f;
        }

        .logo-accent {
          color: #6357e8;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .version {
          color: #7d879c;
          font-size: 13px;
        }

        .header-button {
          text-decoration: none;
          color: #10234f;
          font-size: 14px;
          font-weight: 700;
          padding: 10px 16px;
          border: 1px solid #dfe3ed;
          border-radius: 10px;
          background: white;
        }

        .hero {
          padding: 82px 0 96px;
          overflow: hidden;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 70px;
          align-items: center;
        }

        .eyebrow {
          color: #6357e8;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
          margin-bottom: 20px;
        }

        h1 {
          margin: 0;
          max-width: 620px;
          font-size: clamp(42px, 5vw, 68px);
          line-height: 0.98;
          letter-spacing: -3.5px;
          font-weight: 850;
        }

        h1 span {
          color: #6357e8;
        }

        .hero-description {
          max-width: 570px;
          margin: 28px 0 0;
          color: #5f6d87;
          font-size: 18px;
          line-height: 1.7;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 22px;
          margin-top: 34px;
        }

        .primary-button {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          text-decoration: none;
          background: #6357e8;
          color: white;
          padding: 15px 21px;
          border-radius: 12px;
          font-weight: 750;
          font-size: 15px;
          box-shadow: 0 12px 30px rgba(99, 87, 232, 0.25);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 35px rgba(99, 87, 232, 0.32);
        }

        .primary-button span {
          font-size: 20px;
        }

        .hero-note {
          color: #7d879c;
          font-size: 13px;
        }

        .trust {
          display: flex;
          gap: 28px;
          margin-top: 58px;
          padding-top: 24px;
          border-top: 1px solid #e1e5ee;
        }

        .trust-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .trust-item strong {
          color: #6357e8;
          font-size: 12px;
        }

        .trust-item span {
          color: #66738a;
          font-size: 12px;
        }

        .hero-preview {
          position: relative;
          padding: 25px;
        }

        .preview-window {
          position: relative;
          z-index: 2;
          background: white;
          border: 1px solid #e2e5ee;
          border-radius: 22px;
          box-shadow: 0 30px 80px rgba(29, 42, 77, 0.14);
          overflow: hidden;
        }

        .preview-top {
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 22px;
          border-bottom: 1px solid #edf0f5;
        }

        .preview-logo {
          font-size: 17px;
          font-weight: 850;
          color: #10234f;
        }

        .preview-logo span {
          color: #6357e8;
        }

        .preview-status {
          font-size: 11px;
          color: #7e889d;
        }

        .preview-body {
          padding: 25px;
        }

        .preview-welcome {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .preview-welcome small,
        .preview-section small,
        .preview-metrics small {
          font-size: 8px;
          letter-spacing: 0.1em;
          color: #8791a5;
          font-weight: 800;
        }

        .preview-welcome h2 {
          margin: 5px 0 0;
          font-size: 27px;
          letter-spacing: -1px;
        }

        .preview-button {
          background: #6357e8;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 10px 13px;
          border-radius: 8px;
        }

        .preview-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 22px;
        }

        .preview-metrics > div {
          padding: 15px;
          border: 1px solid #edf0f5;
          border-radius: 12px;
          background: #fafbfe;
        }

        .preview-metrics strong {
          display: block;
          margin-top: 7px;
          font-size: 16px;
          color: #10234f;
        }

        .preview-section {
          margin: 27px 0 14px;
        }

        .preview-section h3 {
          margin: 5px 0 0;
          font-size: 16px;
        }

        .preview-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .preview-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          border: 1px solid #e8ebf2;
          border-radius: 12px;
        }

        .preview-card.featured {
          border-color: #d9d4ff;
          background: #faf9ff;
        }

        .preview-icon {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #eeecff;
          color: #6357e8;
          font-weight: 800;
        }

        .preview-icon.blue {
          background: #edf4ff;
          color: #3b70d9;
        }

        .preview-icon.purple {
          background: #f5edff;
          color: #8b55d9;
        }

        .preview-icon.green {
          background: #eaf9f2;
          color: #1ba875;
        }

        .preview-card strong {
          display: block;
          font-size: 11px;
        }

        .preview-card span {
          display: block;
          margin-top: 4px;
          color: #8791a5;
          font-size: 8px;
        }

        .floating-card {
          position: absolute;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 1px solid #e5e8ef;
          border-radius: 13px;
          padding: 12px 15px;
          box-shadow: 0 15px 35px rgba(29, 42, 77, 0.13);
        }

        .floating-card-one {
          left: -5px;
          bottom: 42px;
        }

        .floating-card-two {
          right: -8px;
          top: 42px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .floating-icon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eaf9f2;
          color: #17a673;
          font-weight: 800;
        }

        .floating-card strong {
          display: block;
          font-size: 10px;
        }

        .floating-card small {
          display: block;
          color: #8791a5;
          font-size: 8px;
        }

        .floating-value {
          color: #6357e8;
          font-weight: 850;
          font-size: 15px;
        }

        .features {
          padding: 92px 0;
          background: white;
          border-top: 1px solid #e8ebf2;
          border-bottom: 1px solid #e8ebf2;
        }

        .section-heading > span {
          color: #6357e8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .section-heading h2 {
          margin: 14px 0 50px;
          font-size: 39px;
          line-height: 1.08;
          letter-spacing: -1.8px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .feature {
          padding: 30px;
          border: 1px solid #e5e8ef;
          border-radius: 18px;
          background: #fbfcfe;
        }

        .feature-number {
          color: #6357e8;
          font-size: 12px;
          font-weight: 800;
        }

        .feature h3 {
          margin: 42px 0 10px;
          font-size: 20px;
        }

        .feature p {
          margin: 0;
          color: #68758c;
          font-size: 14px;
          line-height: 1.65;
        }

        .cta {
          padding: 80px 0;
          background: #10234f;
          color: white;
        }

        .cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .cta-inner > div > span {
          color: #a8a1ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .cta h2 {
          max-width: 650px;
          margin: 12px 0 0;
          font-size: 38px;
          line-height: 1.1;
          letter-spacing: -1.5px;
        }

        .primary-button.light {
          flex-shrink: 0;
          background: white;
          color: #10234f;
          box-shadow: none;
        }

        .footer {
          background: #0b1939;
          color: #8995ae;
        }

        .footer-inner {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
        }

        .footer .logo {
          font-size: 18px;
        }

        .footer strong {
          color: #b8bfd0;
        }

        @media (max-width: 950px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }

          .hero-content {
            max-width: 720px;
          }

          .hero-preview {
            max-width: 680px;
            margin: 0 auto;
            width: 100%;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .container {
            width: min(100% - 32px, 1180px);
          }

          .header-button,
          .version {
            display: none;
          }

          .hero {
            padding: 55px 0 70px;
          }

          h1 {
            font-size: 43px;
            letter-spacing: -2.2px;
          }

          .hero-description {
            font-size: 16px;
          }

          .hero-actions {
            align-items: flex-start;
            flex-direction: column;
          }

          .trust {
            gap: 15px;
            flex-wrap: wrap;
          }

          .hero-preview {
            padding: 5px;
          }

          .floating-card {
            display: none;
          }

          .preview-body {
            padding: 17px;
          }

          .preview-metrics {
            grid-template-columns: 1fr;
          }

          .preview-cards {
            grid-template-columns: 1fr;
          }

          .section-heading h2,
          .cta h2 {
            font-size: 31px;
          }

          .cta-inner {
            align-items: flex-start;
            flex-direction: column;
          }

          .footer-inner {
            padding: 18px 0;
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </main>
  );
}