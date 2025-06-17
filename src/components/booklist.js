import { useState } from "react";

const BookList = ({ livros, onEdit, onDelete, onStatusChange }) => {
  const [expandedIds, setExpandedIds] = useState([]);
  const [statusOptionsVisibleIds, setStatusOptionsVisibleIds] = useState([]);

  const toggleDescription = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleStatusOptions = (id) => {
    setStatusOptionsVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDENTE":
        return "Para Ler";
      case "LENDO":
        return "Lendo";
      case "CONCLUIDO":
        return "Concluído";
      default:
        return "Desconhecido";
    }
  };

  if (!livros || livros.length === 0) {
    return <div className="alert alert-secondary text-center">Nenhum livro cadastrado ainda.</div>;
  }

  return (
    <div className="row">
      {livros.map((livro) => {
        const expanded = expandedIds.includes(livro.id);
        const statusOptionsVisible = statusOptionsVisibleIds.includes(livro.id);

        return (
          <div key={livro.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              {livro.capa && (
                <img
                  src={livro.capa}
                  alt="Capa do livro"
                  className="card-img-top"
                  style={{ objectFit: "cover", height: "200px" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{livro.titulo}</h5>

                <p className="card-text text-muted mb-2">
                  {expanded || !livro.descricao || livro.descricao.length <= 100
                    ? livro.descricao
                    : `${livro.descricao.slice(0, 100)}...`}
                </p>
                <div className="mb-2">
                    {livro.autor && (
                      <p className="mb-1">
                        <strong>Autor:</strong> {livro.autor}
                      </p>
                    )}
                    {livro.data_publicacao && (
                      <p className="mb-1">
                        <strong>Publicado em:</strong>{" "}
                        {new Date(livro.data_publicacao).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>

                {livro.descricao && livro.descricao.length > 100 && (
                  <button
                    className="btn btn-sm btn-link p-0 mb-2"
                    onClick={() => toggleDescription(livro.id)}
                  >
                    {expanded ? "Ver menos ▲" : "Ver mais ▼"}
                  </button>
                )}

                <span className="badge bg-info mb-2 align-self-start">
                  ⭐ {livro.avaliacao}
                </span>

                <span
                  className="badge bg-secondary mb-3 align-self-start"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleStatusOptions(livro.id)}
                  title="Clique para mudar o status"
                >
                  📚 {getStatusLabel(livro.status)}
                </span>

                {statusOptionsVisible && (
                  <div className="mb-3 d-flex gap-1 flex-wrap">
                    <button
                      className={`btn btn-sm ${livro.status === "PENDENTE"
                          ? "btn-primary"
                          : "btn-outline-primary"
                        }`}
                      onClick={() => onStatusChange(livro.id, "PENDENTE")}
                    >
                      Para Ler
                    </button>
                    <button
                      className={`btn btn-sm ${livro.status === "LENDO" ? "btn-warning" : "btn-outline-warning"
                        }`}
                      onClick={() => onStatusChange(livro.id, "LENDO")}
                    >
                      Lendo
                    </button>
                    <button
                      className={`btn btn-sm ${livro.status === "CONCLUIDO"
                          ? "btn-success"
                          : "btn-outline-success"
                        }`}
                      onClick={() => onStatusChange(livro.id, "CONCLUIDO")}
                    >
                      Concluído
                    </button>
                  </div>
                )}

                <div className="mt-auto d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEdit(livro)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(livro.id)}
                    title="Apagar"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookList;