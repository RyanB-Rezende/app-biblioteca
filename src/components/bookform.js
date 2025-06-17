import { useState, useEffect } from "react";
import AvaliacaoInput from "./AvaliacaoInput"; // importa o input customizado

const BookForm = ({ onSave, currentBook, onCancel }) => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [capa, setCapa] = useState("");
  const [avaliacao, setAvaliacao] = useState("1,0"); // string formatada com vírgula
  const [autor, setAutor] = useState("");
  const [dataPublicacao, setDataPublicacao] = useState("");
  const [status, setStatus] = useState("para-ler");

  useEffect(() => {
    if (currentBook) {
      setTitulo(currentBook.titulo);
      setDescricao(currentBook.descricao);
      setCapa(currentBook.capa);
      // formata para string com vírgula (ex: "3,5")
      setAvaliacao(
        currentBook.avaliacao !== undefined
          ? currentBook.avaliacao.toString().replace(".", ",")
          : "1,0"
      );
      setAutor(currentBook.autor || "");
      setDataPublicacao(currentBook.data_publicacao || "");
      setStatus("para-ler");
    } else {
      setTitulo("");
      setDescricao("");
      setCapa("");
      setAvaliacao("1,0");
      setAutor("");
      setDataPublicacao("");
      setStatus("para-ler");
    }
  }, [currentBook]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      titulo,
      descricao,
      capa,
      // converte string "x,y" para float x.y
      avaliacao: parseFloat(avaliacao.replace(",", ".")) || 0,
      autor,
      data_publicacao: dataPublicacao,
      status
    });
    setTitulo("");
    setDescricao("");
    setCapa("");
    setAvaliacao("1,0");
    setAutor("");
    setDataPublicacao("");
    setStatus("para-ler");
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
        <label className="form-label">Autor</label>
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          className="form-control"
          placeholder="Digite o autor"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Data de Publicação</label>
        <input
          type="date"
          value={dataPublicacao}
          onChange={(e) => setDataPublicacao(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="form-select"
        >
          <option value="para-ler">📚 Para Ler</option>
          <option value="lendo">📖 Lendo</option>
          <option value="concluido">✅ Concluído</option>
        </select>
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
        <label className="form-label">Avaliação (0,0 a 5,0)</label>
        <AvaliacaoInput
          value={avaliacao}
          onChange={setAvaliacao}
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
