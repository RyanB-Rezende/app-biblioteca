import { useState, useEffect } from "react";

const BookForm = ({ onSave, currentBook, onCancel }) => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [capa, setCapa] = useState("");
  const [avaliacao, setAvaliacao] = useState(1);

  useEffect(() => {
    if (currentBook) {
      setTitulo(currentBook.titulo);
      setDescricao(currentBook.descricao);
      setCapa(currentBook.capa);
      setAvaliacao(currentBook.avaliacao);
    } else {
      setTitulo("");
      setDescricao("");
      setCapa("");
      setAvaliacao(1);
    }
  }, [currentBook]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      titulo,
      descricao,
      capa,
      avaliacao: parseFloat(avaliacao),
    });
    setTitulo("");
    setDescricao("");
    setCapa("");
    setAvaliacao(1);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
      <h4>{currentBook ? "Editar Livro" : "Novo Livro"}</h4>

      <div className="mb-3">
        <label className="form-label">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="form-control"
          placeholder="Digite o título"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="form-control"
          placeholder="Digite a descrição"
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">URL da Capa</label>
        <input
          type="url"
          value={capa}
          onChange={(e) => setCapa(e.target.value)}
          className="form-control"
          placeholder="http://..."
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Avaliação (1 a 5)</label>
        <input
          type="number"
          value={avaliacao}
          min="1"
          max="5"
          step="0.1"
          onChange={(e) => setAvaliacao(e.target.value)}
          className="form-control"
        />
      </div>

      <button type="submit" className="btn btn-success me-2">
        <i className="bi bi-check-circle me-1"></i>
        {currentBook ? "Salvar Alterações" : "Adicionar Livro"}
      </button>

      {currentBook && (
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <i className="bi bi-x-circle me-1"></i>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default BookForm;
