// components/filters.js

/**
 * Filtra livros com base em múltiplos critérios.
 *
 * @param {Array} livros - Lista de livros completa.
 * @param {Object} filtros - Objeto de filtros ativos.
 * @returns {Array} - Lista filtrada.
 */
export const filterBooks = (livros, filtros) => {
  return livros.filter((livro) => {
    // 🔍 Busca geral no título, autor, descrição
    if (filtros.query) {
      const q = filtros.query.toLowerCase();
      const matchesQuery =
        livro.titulo?.toLowerCase().includes(q) ||
        livro.autor?.toLowerCase().includes(q) ||
        livro.descricao?.toLowerCase().includes(q);
      if (!matchesQuery) return false;
    }

    // ✅ Status específico (PENDENTE, LENDO, CONCLUIDO)
    if (filtros.status && filtros.status !== "TODOS") {
      if (livro.status !== filtros.status) return false;
    }

    // ⭐ Avaliação mínima
    if (filtros.minRating) {
      if (parseFloat(livro.avaliacao) < filtros.minRating) return false;
    }

    // 📅 Ano de publicação
    if (filtros.anoPublicacao) {
      const ano = new Date(livro.data_publicacao).getFullYear();
      if (ano !== parseInt(filtros.anoPublicacao)) return false;
    }

    // ✅ Passou em todos os filtros
    return true;
  });
};
