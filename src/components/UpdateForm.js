import { useState, useEffect } from "react";
import AvaliacaoInput from "./AvaliacaoInput"; // importar o input customizado
import "./UpdateForm.css";

const UpdateForm = ({ show, livro, onUpdate, onClose }) => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [capa, setCapa] = useState("");
  const [avaliacao, setAvaliacao] = useState("1,0");
  const [visible, setVisible] = useState(false);

  // Controla abrir e fechar com animação + trava scroll
  useEffect(() => {
    if (show) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "auto";
    }
  }, [show]);

  // Preenche campos quando abrir para edição
  useEffect(() => {
    if (livro) {
      setTitulo(livro.titulo || "");
      setDescricao(livro.descricao || "");
      setCapa(livro.capa || "");
      setAvaliacao(
        livro.avaliacao !== undefined
          ? livro.avaliacao.toString().replace(".", ",")
          : "1,0"
      );
    }
  }, [livro]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      titulo,
      descricao,
      capa,
      avaliacao: parseFloat(avaliacao.replace(",", ".")) || 0,
    });
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!show && !visible) return null;

  return (
    <>
      <div className={`modal-backdrop-custom ${visible ? "show" : ""}`}></div>
      <div
        className={`modal-custom ${visible ? "show" : ""}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Atualizar Livro</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descrição</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">URL da capa</label>
                  <input
                    type="text"
                    className="form-control"
                    value={capa}
                    onChange={(e) => setCapa(e.target.value)}
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
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateForm;
