import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { LogOut } from "lucide-react"; // Ícone de logout
import "./style.css";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState(null);
  const [clientesCadastrados, setClientesCadastrados] = useState(0);
  const [tipoPessoa, setTipoPessoa] = useState(null); // Adicionando estado para tipo de pessoa
  const navigate = useNavigate(); // Para redirecionar o usuário após logout

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUsuario(data.user);
        setEmail(data.user.email);
        setTipoPessoa(data.user.user_metadata?.tipo_pessoa || "Não informado"); // Pegando o tipo de pessoa
        contarClientes(data.user.id);
      }
    };

    getUser();
  }, []);

  const contarClientes = async (userId) => {
    const { count, error } = await supabase
      .from("clientes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (!error) {
      setClientesCadastrados(count);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Faz o logout
    navigate("/login"); // Redireciona para a página de login
  };

  return (
    <section className="container-perfil">
      <div className="content-perfil">
        <h2>{usuario?.user_metadata?.nome || "Usuário"}</h2>
        <p className="email-user">{email}</p>
        <p><strong>Clientes cadastrados:</strong> {clientesCadastrados}</p>
        <p><strong>Tipo de Pessoa:</strong> {tipoPessoa}</p> {/* Agora a variável está definida */}
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} /> Sair
        </button>
      </div>
    </section>
  );
};

export default Perfil;
