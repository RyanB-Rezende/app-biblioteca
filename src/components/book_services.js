import api from "../api/api";

// CRUD de livros usando Supabase

// CREATE
export const addBook = async (book) => {
  const { data, error } = await api
    .from('livros')
    .insert([{ 
      titulo: book.titulo, 
      descricao: book.descricao, 
      capa: book.capa, 
      avaliacao: book.avaliacao,
      autor: book.autor,
      data_publicacao: book.DataPublicacao
    }]);

  if (error) {
    throw error;  // lança o erro para ser capturado no App.js
  }
  return data;  // retorna os dados inseridos
};

// READ
export const getLivros = async () => {
  const { data, error } = await api
    .from("livros")
    .select("*")
    .order("titulo", { ascending: true });

  if (error) throw error;
  return data;
};

// UPDATE
export const updateLivros = async (id, book) => {
  const { data, error } = await api
    .from("livros")
    .update(book)
    .eq("id", id);

  if (error) throw error;
  return data;
};

// DELETE
export const deleteLivros = async (id) => {
  const { error } = await api
    .from("livros")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
