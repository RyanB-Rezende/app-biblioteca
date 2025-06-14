import { useState, useEffect } from "react";
import Header from './components/Header';
import Footer from './components/Footer';
import BookForm from './components/bookform';
import BookList from './components/booklist';
import { addBook, getLivros, deleteLivros, updateLivros } from './components/book_services';

const App = () => {
  const [livros, setLivros] = useState([]);
  const [message, setMessage] = useState("");
  const [currentBook, setCurrentBook] = useState(null);

  const fetchLivros = async () => {
    const data = await getLivros();
    setLivros(data);
  };

  const handleSave = async (book) => {
    try {
      if (currentBook) {
        await updateLivros(currentBook.id, book);
        setMessage("✅ Livro atualizado!");
        setCurrentBook(null);
      } else {
        await addBook(book);
        setMessage("✅ Livro adicionado!");
      }
      fetchLivros();
    } catch (error) {
      console.error(error);
      setMessage("❌ Erro ao salvar livro.");
    }
  };

  const handleEdit = (livro) => {
    setCurrentBook(livro);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apagar este livro?")) {
      await deleteLivros(id);
      setMessage("🗑️ Livro removido!");
      fetchLivros();
    }
  };

  const handleCancel = () => {
    setCurrentBook(null);
  };

  useEffect(() => {
    fetchLivros();
  }, []);

  return (
    <div className="container mt-4">
      <Header />

      {message && (
        <div className="alert alert-info">{message}</div>
      )}

      <BookForm onSave={handleSave} currentBook={currentBook} onCancel={handleCancel} />

      <BookList livros={livros} onEdit={handleEdit} onDelete={handleDelete} />

      <Footer />
    </div>
  );
};

export default App;
