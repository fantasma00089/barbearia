"use client";

/** Último recurso: erro no layout raiz. Usa estilos inline (CSS global pode não ter carregado). */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: "#0a0a0a", color: "#f3efe8", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
          <div>
            <h1 style={{ fontSize: 32, textTransform: "uppercase", letterSpacing: 1 }}>Algo deu errado</h1>
            <p style={{ color: "#a8a29e", maxWidth: 420, margin: "12px auto 24px" }}>
              Não foi possível carregar o site agora. Tente novamente em instantes.
            </p>
            <button
              onClick={reset}
              style={{ background: "#d9a441", color: "#0a0a0a", border: 0, borderRadius: 999, padding: "12px 24px", fontWeight: 600, cursor: "pointer" }}
            >
              Tentar novamente
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
