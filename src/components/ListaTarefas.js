import { useEffect, useState } from 'react';
import api from '../api/api';
import CadastroTarefa from './CadastroTarefa';

const ListaTarefas = () => {
    const [tarefas, setTarefas] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [tarefaEditando, setTarefaEditando] = useState(null);
    const [tarefaAtualizada, setTarefaAtualizada] = useState({ nome: '', descricao: '', status: '', data_inicio: '', data_fim: '' })

    const carregarTarefas = async () => {
        const { data, error } = await api
            .from('tarefas')
            .select('*');

        if (error) {
            console.error('Erro ao Carregar Tarefas:', error.message);
            return;
        }

        setTarefas(data)

    };

    useEffect(() => {
        carregarTarefas();
    }, []);

    const handleDelete = async (id) => {
        try {
            const { error } = await api
                .from('tarefas')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            setTarefas(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error.message || error);
        }
    };

    const handleEditClick = (tarefa) => {
        setTarefaEditando(tarefa.id);
        setTarefaAtualizada({
            nome: tarefa.nome,
            descricao: tarefa.descricao,
            status: tarefa.status,
            data_inicio: tarefa.data_inicio ? tarefa.data_inicio.split('T')[0] : '',
            data_fim: tarefa.data_fim ? tarefa.data_fim.split('T')[0] : '',
        });
    };

    const handleSave = async (id) => {
        console.log(tarefaAtualizada);
        if (!tarefaAtualizada) {
            console.error('Nenhum dado para Atualizar.');
            return;
        }
        try {
            const { error } = await api
                .from('tarefas')
                .update(tarefaAtualizada)
                .eq('id', id);

            if (error) throw error;

            setTarefaEditando(null);
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error.message || error);
        }
    };

    return (
        <div>
            <button
                className="btn btn-success mb-3"
                onClick={() => setMostrarFormulario(prev => !prev)}
            >
                {mostrarFormulario ? 'Fechar Formulário' : 'Nova Tarefa'}
            </button>

            {mostrarFormulario && (
                <CadastroTarefa onTarefaCadastrada={carregarTarefas} />
            )}

            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Título</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Status</th>
                        <th scope="col">Data Início</th>
                        <th scope="col">Data Fim</th>
                        <th scope="col">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {tarefas.map((tarefa, indice) => (
                        <tr key={tarefa.id}>
                            <th scope="row">{indice + 1}</th>
                            {tarefaEditando === tarefa.id ? (
                                <>
                                    <td>
                                        <textarea
                                            value={tarefaAtualizada.nome}
                                            onChange={(e) => setTarefaAtualizada({ ...tarefaAtualizada, nome: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <textarea
                                            value={tarefaAtualizada.descricao}
                                            onChange={(e) => setTarefaAtualizada({ ...tarefaAtualizada, descricao: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type='date'
                                            value={tarefaAtualizada.data_inicio}
                                            onChange={(e) => setTarefaAtualizada({ ...tarefaAtualizada, data_inicio: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type='date'
                                            value={tarefaAtualizada.data_fim}
                                            onChange={(e) => setTarefaAtualizada({ ...tarefaAtualizada, data_fim: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            value={tarefaAtualizada.status}
                                            onChange={(e) => setTarefaAtualizada({ ...tarefaAtualizada, status: e.target.value })}
                                        >
                                            <option value='Pendente'>Pendente</option>
                                            <option value='Em andamento'>Em andamento</option>
                                            <option value='Concluída'>Concluída</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button type='button' className='btn' onClick={() => handleSave(tarefa.id)}>
                                            Salvar
                                        </button>
                                        <button type='button' className='btn' onClick={() => setTarefaEditando(null)}>
                                            Cancelar
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{tarefa.nome}</td>
                                    <td>{tarefa.descricao}</td>
                                    <td>{tarefa.data_inicio ? tarefa.data_inicio.split('T')[0].split('-').reverse().join('/') : ''}</td>
                                    <td>{tarefa.data_fim ? tarefa.data_fim.split('T')[0].split('-').reverse().join('/') : ''}</td>
                                    <td>{tarefa.status}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => handleEditClick(tarefa)}
                                        >
                                            <i className="bi bi-pencil-square text-primary"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => handleDelete(tarefa.id)}
                                        >
                                            <i className="bi bi-trash text-danger"></i>
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaTarefas;
