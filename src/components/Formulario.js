import { useState, useEffect } from "react";
import { addBook, updateBook, uploadCover } from './book_services.js';


const Formulario = ({ livroEditar, onSucesso, onCancelar }) => {
  // livroEditar = objeto livro para editar, ou null pra novo
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(1);
  const [coverFile, setCoverFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (livroEditar) {
      setTitle(livroEditar.title || "");
      setDescription(livroEditar.description || "");
      setRating(livroEditar.rating || 1);
      setCoverFile(null); // não carregamos arquivo, só permitimos trocar
    } else {
      setTitle("");
      setDescription("");
      setRating(1);
      setCoverFile(null);
    }
  }, [livroEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Título obrigatório");

    setIsSubmitting(true);
    try {
      let cover_url = livroEditar?.cover_url || null;
      if (coverFile) {
        cover_url = await uploadCover(coverFile);
      }

      const dados = {
        title: title.trim(),
        description: description.trim(),
        rating,
        cover_url,
      };

      if (livroEditar) {
        await updateBook(livroEditar.id, dados);
      } else {
        await addBook(dados);
      }

      onSucesso();
    } catch (error) {
      alert("Erro: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Título do livro"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
      />
      <textarea
        className="form-control mb-2"
        placeholder="Descrição do livro"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSubmitting}
      />
      <label>Avaliação:</label>
      <select
        className="form-control mb-2"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        disabled={isSubmitting}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} estrela{n > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <label>Capa do livro (imagem):</label>
      <input
        type="file"
        accept="image/*"
        className="form-control mb-2"
        onChange={(e) => setCoverFile(e.target.files[0])}
        disabled={isSubmitting}
      />
      <button type="submit" className="btn btn-primary me-2" disabled={isSubmitting}>
        {livroEditar ? "Atualizar" : "Adicionar"} Livro
      </button>
      {livroEditar && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancelar}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
      )}
    </form>
  );
};

export default Formulario;
