import "./Formulario.css";
import CampoTexto from "../CampoTexto/index.jsx";
import ListaSuspensa from "../ListaSuspensa/index.jsx";
import Botao from "../Botao/index.jsx";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient.js";
import { useNavigate } from "react-router-dom";

const Formulario = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imagem, setImagem] = useState("");
  const [cliente, setCliente] = useState("");
  const [servico, setServico] = useState("");
  const [file, setFile] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  const tiposDeCliente = ["", "Pessoa Física", "Pessoa Jurídica"];
  const tiposDeServico = [
    "",
    "Desenvolvimento de Software de Gestão Empresarial",
    "Desenvolvimento de Aplicativos Desktop (Windows/Linux/MacOS)",
    "Desenvolvimento de Software para Internet das Coisas (IoT)",
    "Desenvolvimento de Sites e Aplicativos Web",
    "Desenvolvimento de Aplicativos Móveis (Android/iOS)",
    "Desenvolvimento de APIs e Integrações",
    "Manutenção e Suporte em Sistemas Web e Móveis",
    "Consultoria em Desenvolvimento de Software",
    "Gestão de Redes Sociais",
    "Criação de E-commerce e Lojas Virtuais",
    "Outros",
  ];

 
 
  const formatPhone = (value) => {
 
  value = value.replace(/^(\d{2})/, "($1) ");
  
    // Adiciona o hífen após 5 números do DDD
    if (value.length > 2 && value.length <=13) {
      value = value.replace(/^(\(\d{2}\) \d{4})(\d{1})/, "$1-$2");
    } else if (value.length > 12) {
      value = value.replace(/^(\(\d{2}\) \d{5})(\d{1})/, "$1-$2");
    }
  
    return value;
  };
  
  

  useEffect(() => {
    setTelefone(formatPhone(telefone));
  }, [telefone]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagem(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagem("");
    }
  }, [file]);

  const aoSalvar = async (evento) => {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    if (!cliente || !servico || !nome || !telefone) {
      setErro("Preencha todos os campos para o cadastro do cliente.");
      return;
    }

    const user = await supabase.auth.getUser();
    if (!user || !user.data.user) {
      setErro("Usuário não autenticado. Faça login em sua conta e tente novamente.");
      return;
    }

    const user_id = user.data.user.id;
    const { error } = await supabase.from("clientes").insert([
      { user_id, nome, telefone, imagem, cliente, servico }
    ]);

    if (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setErro(error.message);
    } else {
      setSucesso("Cliente cadastrado com sucesso!");
      setTimeout(() => {
        setSucesso("");
        navigate("/");
      }, 1000);

      setNome("");
      setTelefone("");
      setCliente("");
      setServico("");
      setFile(null);
      setImagem("");
    }
  };

  return (
    <section className="formulario">
      <form onSubmit={aoSalvar}>
        <h2>Preencha os dados para o Cadastro do seu cliente.</h2>

        {erro && <div className="container-erro"><span className="erro-auth">{erro}</span></div>}
        {sucesso && <div className="container-sucesso"><span className="sucesso-auth">{sucesso}</span></div>}

        <div className="input-file-container">
          {imagem && <img src={imagem} className="img-cliente" alt="Prévia da imagem" />}
          <div className="input-file-content">
            <label htmlFor="user-file" className="label-file">Escolher Foto</label>
            <input
              type="file"
              accept="image/*"
              className="input-file"
              id="user-file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>

        <ListaSuspensa
          valor={cliente}
          aoAlterado={setCliente}
          itens={tiposDeCliente}
          label="Selecione o tipo de cliente"
        />

        <CampoTexto
          valor={nome}
          aoAlterado={setNome}
          label="Nome"
          placeholder={cliente === "Pessoa Física" ? "Digite o nome do(a) cliente" : "Digite o nome da empresa"}
        />

        <CampoTexto
          type="tel"
          valor={telefone}
          aoAlterado={(val) => setTelefone(formatPhone(val))}
          label="Telefone"
          placeholder="(XX) XXXXX-XXXX"
        />

        <ListaSuspensa
          valor={servico}
          aoAlterado={setServico}
          itens={tiposDeServico}
          label="Serviço"
        />

        <Botao texto="Cadastrar" />
      </form>
    </section>
  );
};

export default Formulario;
