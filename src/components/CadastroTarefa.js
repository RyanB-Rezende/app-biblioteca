import React, { useState } from 'react';
import api from '../api/api';

const CadastroTarefa = ({ onTarefaCadastrada }) => {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [status, setStatus] = useState('Pendente');
    const [dataInicio, setDataInicio] = useState(formatDate(Date.now()));
    const [dataFim, setDataFim] = useState(formatDate(Date.now()));

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const novaTarefa = { nome, descricao, status, data_inicio: dataInicio, data_fim: dataFim };
            const {data, error} = await api
              .from('tarefas')
              .insert([novaTarefa])
              .select();
              if (error) throw error

            if (onTarefaCadastrada && data) {
                onTarefaCadastrada(data[0]);
            }

            // Limpar formulário após envio
            setNome('');
            setDescricao('');
            setStatus('Pendente');
            setDataInicio(formatDate(Date.now()));
            setDataFim(formatDate(Date.now()));
        } catch (error) {
            console.error('Erro ao cadastrar tarefa:', error.message || error);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Cadastrar Nova Tarefa</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                        className="form-select"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        required
                    >
                        <option value="Pendente">Pendente</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Concluída">Concluída</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Data início</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dataInicio}
                        onChange={e => setDataInicio(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Data fim</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dataFim}
                        onChange={e => setDataFim(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Cadastrar</button>
            </form>
        </div>
    );
};

export default CadastroTarefa;
