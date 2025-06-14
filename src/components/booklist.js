import { useState } from "react";

const BookCard = ({ livro, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="col-md-4 mb-4">
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

          {livro.descricao && livro.descricao.length > 100 && (
            <button
              className="btn btn-sm btn-link p-0 mb-2"
              onClick={toggleDescription}
            >
              {expanded ? "Ver menos ▲" : "Ver mais ▼"}
            </button>
          )}

          <span className="badge bg-info mb-3 align-self-start">
            ⭐ {livro.avaliacao}
          </span>

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
};

const BookList = ({ livros, onEdit, onDelete }) => {
  if (livros.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        Nenhum livro cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="row">
      {livros.map((livro) => (
        <BookCard
          key={livro.id}
          livro={livro}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BookList;
