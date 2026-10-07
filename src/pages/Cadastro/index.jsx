import { useState } from "react";
import "./style.css";
import { supabase } from "../../supabaseClient";

const Cadastro = () => {
    const [pessoa, setPessoa] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [erros, setErros] = useState({});

    const validar = {
        email: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        senha: (value) => value.length >= 8,
        confirmaSenha: (value, senha) => value === senha,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const errosValidacao = {};
        if (!nome.trim()) errosValidacao.nome = 'O nome é obrigatório';
        if (!pessoa) errosValidacao.pessoa = 'Selecione o tipo de pessoa';
        if (!validar.email(email)) errosValidacao.email = 'E-mail inválido';
        if (!validar.senha(senha)) errosValidacao.senha = 'A senha deve conter no mínimo 8 caracteres';
        if (!validar.confirmaSenha(confirmaSenha, senha)) errosValidacao.confirmaSenha = 'Senhas não coincidem';
    
        if (Object.keys(errosValidacao).length > 0) {
            setErros(errosValidacao);
            return;
        }
    
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password: senha,
                options: {
                    data: { 
                        nome,
                        tipo_pessoa: pessoa 
                    }
                }
            });
    
            if (error) {
                console.error('Erro ao criar conta:', error);
                setErros((prevErros) => ({
                    ...prevErros,
                    geral: error.message || 'Houve um problema ao criar sua conta. Por favor, tente novamente.',
                }));
                return;
            } else {
                setErros((prevErros) => ({
                    ...prevErros,
                    sucesso: 'Cadastro realizado com sucesso! Verifique seu e-mail.',
                }));
            }
        } catch (err) {
            console.error("Erro inesperado:", err);
            setErros((prevErros) => ({
                ...prevErros,
                geral: "Erro inesperado. Tente novamente.",
            }));
        }
    };
    

    return (
        <form className="cadastro-container" onSubmit={handleSubmit}>
            <h2>Cadastro</h2>

            <div className="input-container">
                <label htmlFor="tipoPessoa">Tipo de Pessoa</label>
                <select 
                    id="tipoPessoa" 
                    className='input-container-select'
                    onChange={(e) => setPessoa(e.target.value)} 
                    value={pessoa}
                >
                    <option value="">Selecione...</option>
                    <option value="fisica">Pessoa Física</option>
                    <option value="juridica">Pessoa Jurídica</option>
                </select>
                {erros.pessoa && <span className="mensagem-erro">{erros.pessoa}</span>}
            </div>
            
            <div className="input-container">
                <label>Nome</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    minLength={3}
                    required
                />
                {erros.nome && <span className="mensagem-erro">{erros.nome}</span>}
            </div>

            <div className="input-container">
                <label>E-mail</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {erros.email && <span className="mensagem-erro">{erros.email}</span>}
            </div>

            <div className="input-container">
                <label>Senha</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                {erros.senha && <span className="mensagem-erro">{erros.senha}</span>}
            </div>

            <div className="input-container">
                <label>Confirmar Senha</label>
                <input
                    type="password"
                    value={confirmaSenha}
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                />
                {erros.confirmaSenha && <span className="mensagem-erro">{erros.confirmaSenha}</span>}
            </div>

            <button type="submit" className="btn-submit">Cadastrar</button>

            {erros.geral ? (
                <span className="mensagem-erro">{erros.geral}</span>
            ) : erros.sucesso ? (
                <span className="mensagem-sucesso">{erros.sucesso}</span>
            ) : null}
        </form>
    );
};

export default Cadastro;
