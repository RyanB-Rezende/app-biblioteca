import api from '../api/api';; // ajuste o caminho conforme necessário

// Listar todos os livros
export async function getBooks() {
  const { data, error } = await api
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Inserir livro
export async function addBook(book) {
  const { error } = await api.from('books').insert(book);
  if (error) throw error;
}

// Atualizar livro
export async function updateBook(id, updates) {
  const { error } = await api.from('books').update(updates).eq('id', id);
  if (error) throw error;
}

// Deletar livro
export async function deleteBook(id) {
  const { error } = await api.from('books').delete().eq('id', id);
  if (error) throw error;
}

// Upload da capa
export async function uploadCover(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await api.storage
    .from('book-covers')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = api.storage.from('book-covers').getPublicUrl(filePath);
  return data.publicUrl;
}
