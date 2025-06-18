import { useState, useEffect } from "react";
import AvaliacaoInput from "./AvaliacaoInput";

/**
 * Filtra livros com base em múltiplos critérios.
 *
 * @param {Array} livros - Lista de livros completa.
 * @param {Object} filtros - Objeto de filtros ativos.
 * @returns {Array} - Lista filtrada.
 */
export const filterBooks = (livros, filtros) => {
  return livros.filter((livro) => {
    if (filtros.query) {
      const q = filtros.query.toLowerCase();
      const matchesQuery =
        livro.titulo?.toLowerCase().includes(q) ||
        livro.autor?.toLowerCase().includes(q) ||
        livro.descricao?.toLowerCase().includes(q);
      if (!matchesQuery) return false;
    }

    if (filtros.status && filtros.status !== "TODOS") {
      if (livro.status !== filtros.status) return false;
    }

    if (filtros.minRating) {
      if (parseFloat(livro.avaliacao) < filtros.minRating) return false;
    }

    if (filtros.anoPublicacao) {
      const ano = new Date(livro.data_publicacao).getFullYear();
      if (ano !== parseInt(filtros.anoPublicacao)) return false;
    }

    return true;
  });
};

/**
 * Mini janela para configurar filtros — igual ao UpdateForm.
 * Props:
 * - visible: boolean
 * - onClose: função para fechar
 * - filtros: objeto atual de filtros
 * - setFiltros: função para atualizar filtros
 */
export const FiltersWindow = ({ visible, onClose, filtros, setFiltros }) => {
  const [internalVisible, setInternalVisible] = useState(visible);

  useEffect(() => {
    setInternalVisible(visible);
  }, [visible]);

  const handleClose = () => {
    setInternalVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleReset = () => {
    setFiltros({
      status: "TODOS",
      minRating: 0,
      anoPublicacao: "",
      query: "",
    });
  };

  return (
    <div
      className={`modal fade ${internalVisible ? "show d-block" : ""}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Filtros Avançados</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <label className="form-label">Status</label>
            <select
              className="form-select mb-3"
              value={filtros.status}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="TODOS">Todos</option>
              <option value="PENDENTE">Para Ler</option>
              <option value="LENDO">Lendo</option>
              <option value="CONCLUIDO">Concluído</option>
            </select>

            <div className="mb-3">
              <label className="form-label">Avaliação Mínima</label>
              <AvaliacaoInput
                value={filtros.minRating}
                onChange={(valor) =>
                  setFiltros((prev) => ({
                    ...prev,
                    minRating: valor || 0,
                  }))
                }
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Ano de Publicação</label>
              <input
                type="text"
                className="form-control"
                maxLength={4}
                value={filtros.anoPublicacao}
                placeholder="Ex: 2024"
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setFiltros((prev) => ({
                      ...prev,
                      anoPublicacao: val,
                    }));
                  }
                }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>
              Fechar
            </button>
            <button className="btn btn-outline-danger" onClick={handleReset}>
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
