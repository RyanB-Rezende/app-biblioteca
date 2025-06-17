import { useState, useEffect } from "react";
import Header from './components/Header';
import Footer from './components/Footer';
import BookForm from './components/bookform';
import BookList from './components/booklist';
import UpdateForm from './components/UpdateForm';
import { addBook, getLivros, deleteLivros, updateLivros } from './components/book_services';

const App = () => {
  const [livros, setLivros] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formVisible, setFormVisible] = useState(false); // controle visibilidade com delay
  const [currentBook, setCurrentBook] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);

  // Busca livros
  const fetchLivros = async () => {
    const data = await getLivros();
    setLivros(data);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSave = async (book) => {
    try {
      await addBook(book);  // Espera o livro ser adicionado
      showMessage("✅ Livro adicionado!");
      setShowForm(false);
      await fetchLivros();  // Atualiza a lista de livros
    } catch (error) {
      console.error(error);
      showMessage("❌ Erro ao salvar livro.");
    }
  };

  const handleEdit = (livro) => {
    setCurrentBook(livro);
    setShowUpdate(true);
  };

  const handleUpdate = async (updatedBook) => {
    try {
      await updateLivros(currentBook.id, updatedBook);
      showMessage("✅ Livro atualizado!");
      setShowUpdate(false);
      setCurrentBook(null);
      fetchLivros();
    } catch (error) {
      console.error(error);
      showMessage("❌ Erro ao atualizar livro.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apagar este livro?")) {
      await deleteLivros(id);
      showMessage("🗑️ Livro removido!");
      fetchLivros();
    }
  };

  // Controle animado para BookForm aparecer e sumir
  useEffect(() => {
    if (showForm) {
      setFormVisible(true);
    } else {
      // Delay para manter o componente enquanto anima
      const timer = setTimeout(() => setFormVisible(false), 300); // mesma duração do CSS
      return () => clearTimeout(timer);
    }
  }, [showForm]);

  useEffect(() => {
    fetchLivros();
  }, []);

  return (
    <div className="container mt-4">
      <Header />

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <div className="mb-3">
        <button
          className={`btn ${showForm ? "btn-secondary" : "btn-primary"}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Fechar Formulário" : "Adicionar Livro"}
        </button>
      </div>

      {/* Renderiza o formulário enquanto estiver visível, e controla animação com classe */}
      {formVisible && (
        <div className={`form-animation ${showForm ? "show" : "hide"}`}>
          <BookForm
            onSave={handleSave}
          />
        </div>
      )}

      <BookList livros={livros} onEdit={handleEdit} onDelete={handleDelete} />

      <UpdateForm
        show={showUpdate}
        livro={currentBook}
        onUpdate={handleUpdate}
        onClose={() => setShowUpdate(false)}
      />

      <Footer />
    </div>
  );
};

export default App;
