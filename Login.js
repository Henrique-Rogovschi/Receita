"use client";

export default function Login({ onLogin, denied, email, onLogout, error }) {
  return (
    <main className="login">
      <div className="login-card">
        <span className="login-emoji" aria-hidden>🍳</span>
        <h1>Nosso caderno de receitas</h1>
        {denied ? (
          <>
            <p>
              A conta <strong>{email}</strong> não tem acesso a este caderno. Entre com o e-mail que foi cadastrado.
            </p>
            <button className="btn btn-primary" onClick={onLogout}>Trocar de conta</button>
          </>
        ) : (
          <>
            <p>Entre com sua conta Google para ver e adicionar receitas.</p>
            <button className="btn btn-primary" onClick={onLogin}>Entrar com Google</button>
          </>
        )}
        {error && <p className="form-error">{error}</p>}
      </div>
    </main>
  );
}
