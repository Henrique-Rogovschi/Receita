"use client";
import { useEffect } from "react";
import { categoryById } from "@/lib/categories";

export default function RecipeModal({ recipe, onClose, onEdit, onDelete }) {
  const cat = categoryById(recipe.category);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const vertical = recipe.platform === "instagram" || recipe.vertical;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-wide" role="dialog" aria-modal="true" aria-label={recipe.title} onClick={(e) => e.stopPropagation()} style={{ "--cat": cat.color }}>
        <button className="close" onClick={onClose} aria-label="Fechar">×</button>
        <div className={`detail ${vertical ? "detail-vertical" : ""}`}>
          <div className={`embed ${vertical ? "embed-vertical" : ""}`}>
            <iframe
              src={recipe.embedUrl}
              title={recipe.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="detail-text">
            <span className="card-cat">{cat.emoji} {cat.label}</span>
            <h2>{recipe.title}</h2>
            {recipe.addedBy && <p className="muted">Adicionada por {recipe.addedBy}</p>}

            {recipe.ingredients?.length > 0 && (
              <section>
                <h4>Ingredientes</h4>
                <ul className="ingredients">
                  {recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
                </ul>
              </section>
            )}
            {recipe.notes && (
              <section>
                <h4>Anotações</h4>
                <p className="notes">{recipe.notes}</p>
              </section>
            )}

            <div className="detail-actions">
              <a className="btn btn-ghost" href={recipe.url} target="_blank" rel="noreferrer">
                Abrir no {recipe.platform === "instagram" ? "Instagram" : "YouTube"}
              </a>
              <button className="btn btn-ghost" onClick={() => onEdit(recipe)}>Editar</button>
              <button
                className="btn btn-danger"
                onClick={() => confirm(`Apagar "${recipe.title}"?`) && onDelete(recipe)}
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
