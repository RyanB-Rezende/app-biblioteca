import { useState, useEffect, useRef } from "react";
import Header from './components/Header';
import Footer from './components/Footer';
import BookForm from './components/bookform';
import BookList from './components/booklist';
import UpdateForm from './components/UpdateForm';
import { addBook, getLivros, deleteLivros, updateLivros } from './components/book_services';
import { filterBooks, FiltersWindow } from './components/filters';

const App = () => {
  const [livros, setLivros] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageCountdown, setMessageCountdown] = useState(3);
  const messageTimerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  // ✅ ÚNICO STATE DE FILTROS
  const [filtros, setFiltros] = useState({
    status: "TODOS",
    minRating: 0,
    anoPublicacao: ""
  });

  const searchInputRef = useRef(null);
  const autoCloseTimer = useRef(null);

  // Busca livros
  const fetchLivros = async () => {
    const data = await getLivros();
    setLivros(data);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateLivros(id, { status });
      showMessage(`Status atualizado para ${status}`);
      fetchLivros();
    } catch (error) {
      console.error(error);
      showMessage("Erro ao atualizar status");
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setShowMessageBox(true);
    setMessageCountdown(3);

    if (messageTimerRef.current) {
      clearInterval(messageTimerRef.current);
    }

    messageTimerRef.current = setInterval(() => {
      setMessageCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(messageTimerRef.current);
          setMessageCountdown(0);
          setTimeout(() => {
            setShowMessageBox(false);
            setMessage("");
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSave = async (book) => {
    try {
      await addBook(book);
      showMessage("✅ Livro adicionado!");
      setShowForm(false);
      await fetchLivros();
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

  useEffect(() => {
    if (showForm) {
      setFormVisible(true);
    } else {
      const timer = setTimeout(() => setFormVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [showForm]);

  useEffect(() => {
    fetchLivros();
  }, []);

  // ✅ Usa o state 'filtros'
  const filteredBooks = filterBooks(livros, {
    query: searchQuery,
    status: filtros.status,
    minRating: filtros.minRating,
    anoPublicacao: filtros.anoPublicacao
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleToggleSearch = () => {
    if (!isSearchExpanded) {
      setIsSearchExpanded(true);
      searchInputRef.current?.focus();
      startAutoCloseTimer();
    } else {
      setIsSearchExpanded(false);
      setSearchQuery("");
      clearAutoCloseTimer();
    }
  };

  const startAutoCloseTimer = () => {
    clearAutoCloseTimer();
    autoCloseTimer.current = setTimeout(() => {
      setIsSearchExpanded(false);
      setSearchQuery("");
    }, 10000);
  };

  const clearAutoCloseTimer = () => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = null;
    }
  };

  const handleSearchFocus = () => {
    clearAutoCloseTimer();
  };

  const handleSearchBlur = () => {
    if (searchQuery.trim() === "") {
      startAutoCloseTimer();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    clearAutoCloseTimer();
  };

  return (
    <div className="container mt-4">
      <Header />

      {showMessageBox && (
        <div className={`alert alert-info fade ${messageCountdown > 0 ? "show" : ""}`}>
          {message}
          <span className="ms-2 text-muted small">({messageCountdown})</span>
        </div>
      )}

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <button
          className={`btn ${showForm ? "btn-secondary" : "btn-primary"}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Fechar Formulário" : "Adicionar Livro"}
        </button>

        <div className="ms-3 d-flex align-items-center">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Pesquisar livros..."
            className={`form-control search-input ${isSearchExpanded ? "expanded" : ""}`}
            value={searchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onChange={handleSearchChange}
          />
          <button className="btn btn-outline-secondary" onClick={handleToggleSearch}>
            🔍
          </button>
        </div>
        <div>
          <FiltersWindow
            visible={filtersVisible}
            onClose={() => setFiltersVisible(false)}
            filtros={filtros}
            setFiltros={setFiltros}
          />

          <button
            className="btn btn-outline-secondary"
            onClick={() => setFiltersVisible(true)}
          >
            💡 Filtros Avançados
          </button>
        </div>
      </div>

      {formVisible && (
        <div className={`form-animation ${showForm ? "show" : "hide"}`}>
          <BookForm onSave={handleSave} />
        </div>
      )}

      <BookList
        livros={currentBooks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

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
