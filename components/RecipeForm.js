"use client";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { parseVideo } from "@/lib/video";

export default function RecipeForm({ initial, onSave, onClose }) {
  const [link, setLink] = useState(initial?.url || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [ingredients, setIngredients] = useState((initial?.ingredients || []).join("\n"));
  const [notes, setNotes] = useState(initial?.notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const video = parseVideo(link);

  // Preenche o título automaticamente para links do YouTube
  useEffect(() => {
    if (!video || video.platform !== "youtube" || title) return;
    let alive = true;
    fetch(`/api/oembed?url=${encodeURIComponent(video.url)}`)
      .then((r) => r.json())
      .then((d) => alive && d.title && setTitle((t) => t || d.title))
      .catch(() => {});
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!video) return setError("Cole um link de vídeo do YouTube ou do Instagram.");
    if (!title.trim()) return setError("Dê um nome para a receita.");
    if (!category) return setError("Escolha o tipo da receita.");
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        category,
        url: video.url,
        platform: video.platform,
        videoId: video.id,
        embedUrl: video.embedUrl,
        thumbnail: video.thumbnail,
        vertical: !!video.vertical,
        ingredients: ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
        notes: notes.trim(),
      });
    } catch (err) {
      setError("Não foi possível salvar. Verifique sua conexão e tente de novo.");
      setSaving(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onSubmit={submit} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Receita">
        <button type="button" className="close" onClick={onClose} aria-label="Fechar">×</button>
        <h2>{initial ? "Editar receita" : "Nova receita"}</h2>

        <label className="field">
          <span>Link do vídeo</span>
          <input
            type="url"
            inputMode="url"
            placeholder="Cole aqui o link do Instagram ou YouTube"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            autoFocus={!initial}
          />
          {link && !video && <small className="form-error">Esse link não parece ser de um vídeo do YouTube ou Instagram.</small>}
          {video && (
            <small className="found">
              {video.platform === "youtube" ? "Vídeo do YouTube reconhecido" : "Post do Instagram reconhecido"} ✓
            </small>
          )}
        </label>

        <label className="field">
          <span>Nome da receita</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Nhoque de batata com manteiga e sálvia" />
        </label>

        <fieldset className="field">
          <span>Tipo</span>
          <div className="chips">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`chip ${category === c.id ? "is-on" : ""}`}
                style={{ "--cat": c.color }}
                onClick={() => setCategory(c.id)}
                aria-pressed={category === c.id}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span>Ingredientes <em>(um por linha, opcional)</em></span>
          <textarea rows={4} value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder={"500 g de batata\n1 ovo\nFarinha a gosto"} />
        </label>

        <label className="field">
          <span>Anotações <em>(opcional)</em></span>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex.: dobrar o alho, fica melhor com parmesão" />
        </label>

        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Salvando…" : initial ? "Salvar alterações" : "Adicionar receita"}
          </button>
        </div>
      </form>
    </div>
  );
}
