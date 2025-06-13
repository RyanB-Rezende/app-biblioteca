import { useState } from 'react';

const ListaLivros = ({
  livros,
  removerLivro,
  editandoId,
  iniciarEdicao,
  salvarEdicao,
}) => {
  const [novoTitle, setNovoTitle] = useState('');
  const [novaDescription, setNovaDescription] = useState('');
  const [novaCoverUrl, setNovaCoverUrl] = useState('');
  const [novoRating, setNovoRating] = useState(1);

  const cancelarEdicao = () => {
    setNovoTitle('');
    setNovaDescription('');
    setNovaCoverUrl('');
    setNovoRating(1);
    iniciarEdicao(null); // Sai do modo edição
  };

  return (
    <ul className="list-group">
      {livros.map((livro) => (
        <li key={livro.id} className="list-group-item">
          {editandoId === livro.id ? (
            <div className="d-flex flex-column gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Título"
                value={novoTitle}
                onChange={(e) => setNovoTitle(e.target.value)}
                required
              />
              <textarea
                rows={3}
                className="form-control"
                placeholder="Descrição"
                value={novaDescription}
                onChange={(e) => setNovaDescription(e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                placeholder="URL da Capa"
                value={novaCoverUrl}
                onChange={(e) => setNovaCoverUrl(e.target.value)}
              />
              <label>Avaliação:</label>
              <select
                className="form-select"
                value={novoRating}
                onChange={(e) => setNovoRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} estrela{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>

              <div className="mt-2 d-flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() =>
                    salvarEdicao(livro.id, {
                      title: novoTitle || livro.title,
                      description: novaDescription || livro.description,
                      cover_url: novaCoverUrl || livro.cover_url,
                      rating: novoRating || livro.rating,
                    })
                  }
                >
                  Salvar
                </button>
                <button className="btn btn-sm btn-secondary" onClick={cancelarEdicao}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              {/* Capa + Texto */}
              <div className="d-flex gap-3 flex-grow-1">
                {livro.cover_url ? (
                  <img
                    src={livro.cover_url}
                    alt={livro.title}
                    style={{ width: '70px', height: '90px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '70px',
                      height: '90px',
                      backgroundColor: '#ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: 12,
                    }}
                  >
                    Sem Capa
                  </div>
                )}

                <div>
                  <h5 className="mb-1">{livro.title}</h5>
                  <p className="mb-1">{livro.description || 'Sem descrição'}</p>
                  <p className="mb-0">
                    Avaliação: {livro.rating} estrela{livro.rating > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Botões */}
              <div className="ms-3 d-flex align-items-center flex-shrink-0">
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => {
                    setNovoTitle(livro.title);
                    setNovaDescription(livro.description);
                    setNovaCoverUrl(livro.cover_url);
                    setNovoRating(livro.rating || 1);
                    iniciarEdicao(livro.id);
                  }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    if (window.confirm('Deseja excluir este livro?')) {
                      removerLivro(livro.id);
                    }
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ListaLivros;
