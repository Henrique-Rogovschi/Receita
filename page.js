"use client";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc,
} from "firebase/firestore";
import { getFirebase, ALLOWED_EMAILS } from "@/lib/firebase";
import { CATEGORIES } from "@/lib/categories";
import Login from "@/components/Login";
import RecipeCard from "@/components/RecipeCard";
import RecipeForm from "@/components/RecipeForm";
import RecipeModal from "@/components/RecipeModal";

export default function Home() {
  const [user, setUser] = useState(undefined); // undefined = carregando
  const [recipes, setRecipes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("todas");
  const [search, setSearch] = useState("");
  const [formFor, setFormFor] = useState(null); // null | "new" | recipe
  const [open, setOpen] = useState(null);
  const [authError, setAuthError] = useState("");

  const allowed = user && ALLOWED_EMAILS.includes((user.email || "").toLowerCase());

  useEffect(() => {
    const { auth } = getFirebase();
    return onAuthStateChanged(auth, (u) => setUser(u || null));
  }, []);

  useEffect(() => {
    if (!allowed) return;
    const { db } = getFirebase();
    const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setRecipes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoaded(true);
    });
  }, [allowed]);

  const counts = useMemo(() => {
    const c = { todas: recipes.length, favoritas: recipes.filter((r) => r.favorite).length };
    recipes.forEach((r) => (c[r.category] = (c[r.category] || 0) + 1));
    return c;
  }, [recipes]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return recipes.filter((r) => {
      if (filter === "favoritas" && !r.favorite) return false;
      if (filter !== "todas" && filter !== "favoritas" && r.category !== filter) return false;
      if (!term) return true;
      return [r.title, r.notes, ...(r.ingredients || [])].join(" ").toLowerCase().includes(term);
    });
  }, [recipes, filter, search]);

  async function login() {
    setAuthError("");
    try {
      const { auth, provider } = getFirebase();
      await signInWithPopup(auth, provider);
    } catch (e) {
      if (e.code !== "auth/popup-closed-by-user") setAuthError("Não foi possível entrar. Tente de novo.");
    }
  }
  const logout = () => signOut(getFirebase().auth);

  async function save(data) {
    const { db } = getFirebase();
    if (formFor && formFor !== "new") {
      await updateDoc(doc(db, "recipes", formFor.id), { ...data, updatedAt: serverTimestamp() });
    } else {
      await addDoc(collection(db, "recipes"), {
        ...data,
        favorite: false,
        addedBy: (user.displayName || user.email).split(" ")[0],
        addedByEmail: user.email,
        createdAt: serverTimestamp(),
      });
    }
    setFormFor(null);
    setOpen(null);
  }

  const toggleFavorite = (r) => updateDoc(doc(getFirebase().db, "recipes", r.id), { favorite: !r.favorite });
  const remove = async (r) => {
    await deleteDoc(doc(getFirebase().db, "recipes", r.id));
    setOpen(null);
  };

  if (user === undefined) return <div className="splash" aria-busy="true">🍳</div>;
  if (!user || !allowed)
    return <Login onLogin={login} denied={!!user && !allowed} email={user?.email} onLogout={logout} error={authError} />;

  const tabs = [
    { id: "todas", label: "Todas", emoji: "📖", color: "#23372B" },
    ...CATEGORIES,
    { id: "favoritas", label: "Favoritas", emoji: "♥", color: "#C8412B" },
  ];

  return (
    <>
      <header className="top">
        <div className="top-inner">
          <h1 className="brand">Nosso caderno de receitas</h1>
          <div className="top-actions">
            <button className="btn btn-primary" onClick={() => setFormFor("new")}>+ Nova receita</button>
            <button className="avatar" onClick={logout} title="Sair" aria-label="Sair">
              {user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : (user.displayName || "?")[0]}
            </button>
          </div>
        </div>
      </header>

      <main className="wrap">
        <nav className="tabs" aria-label="Filtrar por tipo">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab ${filter === t.id ? "is-on" : ""}`}
              style={{ "--cat": t.color }}
              onClick={() => setFilter(t.id)}
              aria-pressed={filter === t.id}
            >
              <span aria-hidden>{t.emoji}</span> {t.label}
              <span className="count">{counts[t.id] || 0}</span>
            </button>
          ))}
        </nav>

        <input
          className="search"
          type="search"
          placeholder="Buscar por nome, ingrediente ou anotação"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {!loaded ? (
          <p className="empty">Abrindo o caderno…</p>
        ) : recipes.length === 0 ? (
          <div className="empty">
            <p>O caderno ainda está em branco. Cole o link do primeiro vídeo que vocês querem testar.</p>
            <button className="btn btn-primary" onClick={() => setFormFor("new")}>Adicionar a primeira receita</button>
          </div>
        ) : visible.length === 0 ? (
          <p className="empty">Nenhuma receita encontrada com esse filtro.</p>
        ) : (
          <section className="grid">
            {visible.map((r) => (
              <RecipeCard key={r.id} recipe={r} onOpen={setOpen} onToggleFavorite={toggleFavorite} />
            ))}
          </section>
        )}
      </main>

      {open && (
        <RecipeModal
          recipe={recipes.find((r) => r.id === open.id) || open}
          onClose={() => setOpen(null)}
          onEdit={(r) => { setOpen(null); setFormFor(r); }}
          onDelete={remove}
        />
      )}
      {formFor && (
        <RecipeForm initial={formFor === "new" ? null : formFor} onSave={save} onClose={() => setFormFor(null)} />
      )}
    </>
  );
}
