import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './style.css';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: senha,
            });

            if (error) {
                setErro(error.message);
                return;
            }

            if (data?.user) {
                navigate('/');
            } else {
                setErro('Usuário não encontrado ou erro no login.');
            }

        } catch (err) {
            console.error('Erro ao tentar login:', err);
            setErro('Erro inesperado, tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="login-container" onSubmit={handleSubmit}>
            <h2>Login</h2>

            <div className="login-input-container">
                <label>E-mail</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="login-input-container">
                <label>Senha</label>
                <input
                    type="password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Carregando...' : 'Login'}
            </button>

            <div className='erro-container'>
                {erro && <div className="erro">{erro}</div>}
            </div>

            <div className="links">
                <Link to="/esqueci-senha" className="link-esqueceu-senha">Esqueceu a senha?</Link>
                <p className="link-cadastrar">
                    Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
                </p>
            </div>
        </form>
    );
};

export default Login;
