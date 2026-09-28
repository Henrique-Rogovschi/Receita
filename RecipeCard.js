"use client";
import { categoryById } from "@/lib/categories";

export default function RecipeCard({ recipe, onOpen, onToggleFavorite }) {
  const cat = categoryById(recipe.category);
  return (
    <article className="card" style={{ "--cat": cat.color }}>
      <button className="card-hit" onClick={() => onOpen(recipe)} aria-label={`Abrir ${recipe.title}`}>
        <div className="card-media">
          {recipe.thumbnail ? (
            <img src={recipe.thumbnail} alt="" loading="lazy" />
          ) : (
            <div className="card-placeholder">
              <span aria-hidden>{cat.emoji}</span>
            </div>
          )}
          <span className={`platform platform-${recipe.platform}`}>
            {recipe.platform === "instagram" ? "Instagram" : "YouTube"}
          </span>
        </div>
        <div className="card-body">
          <span className="card-cat">{cat.emoji} {cat.label}</span>
          <h3>{recipe.title}</h3>
          {recipe.addedBy && <span className="card-by">Adicionada por {recipe.addedBy}</span>}
        </div>
      </button>
      <button
        className={`fav ${recipe.favorite ? "is-on" : ""}`}
        onClick={() => onToggleFavorite(recipe)}
        aria-pressed={!!recipe.favorite}
        aria-label={recipe.favorite ? "Tirar das favoritas" : "Marcar como favorita"}
      >
        {recipe.favorite ? "♥" : "♡"}
      </button>
    </article>
  );
}
