import { useState, useEffect } from "react";
import Pesquisa from "../../componentes/search";
import ItemCliente from "../../componentes/item-cliente";
import ModalConfirmacao from "../../componentes/ModalConfirmacao";
import "./style.css";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";

const Clientes = () => {
  const [erro, setErro] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [filtroPessoa, setFiltroPessoa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteIdExcluir, setClienteIdExcluir] = useState(null);

  // ==============================
  // EXCLUIR CLIENTE
  // ==============================
  const handleDelete = async () => {
    try {
      setCarregando(true);
      setErro(null);

      if (!clienteIdExcluir) {
        console.error("ID do cliente não encontrado.");
        setErro("Erro ao deletar cliente. ID não encontrado.");
        return;
      }

      // Verifica usuário autenticado
      const {
        data: authData,
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authData?.user) {
        throw new Error("Usuário não autenticado.");
      }

      const userId = authData.user.id;

      // Exclui somente o cliente pertencente ao usuário logado
      const { data, error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", clienteIdExcluir)
        .eq("user_id", userId)
        .select();

      if (error) {
        console.error("Erro retornado pelo Supabase:", error);
        throw error;
      }

      console.log("Cliente excluído:", data);

      // Remove o cliente da lista da tela
      setClientes((clientesAtuais) =>
        clientesAtuais.filter(
          (cliente) => cliente.id !== clienteIdExcluir
        )
      );

      // Limpa estados
      setClienteIdExcluir(null);
      setMostrarModal(false);

    } catch (error) {
      console.error("Erro ao deletar cliente:", error);

      setErro(
        `Erro ao deletar cliente: ${
          error?.message || "Tente novamente."
        }`
      );
    } finally {
      setCarregando(false);
    }
  };

  // ==============================
  // CANCELAR EXCLUSÃO
  // ==============================
  const cancelarExclusao = () => {
    setMostrarModal(false);
    setClienteIdExcluir(null);
  };

  // ==============================
  // BUSCAR CLIENTES
  // ==============================
  useEffect(() => {
    const buscarClientes = async () => {
      try {
        setCarregando(true);
        setErro(null);

        // Verifica usuário autenticado
        const {
          data: authData,
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!authData?.user) {
          setErro("Usuário não autenticado.");
          setCarregando(false);
          return;
        }

        // Busca somente os clientes do usuário logado
        let query = supabase
          .from("clientes")
          .select(
            "id, user_id, cliente, nome, servico, telefone, imagem"
          )
          .eq("user_id", authData.user.id);

        // ==============================
        // FILTRO PESSOA
        // ==============================

        let filtroCorreto = null;

        if (filtroPessoa === "fisica") {
          filtroCorreto = "Pessoa Física";
        } else if (filtroPessoa === "juridica") {
          filtroCorreto = "Pessoa Jurídica";
        }

        if (filtroCorreto) {
          query = query.eq("cliente", filtroCorreto);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        // ==============================
        // ORDENAÇÃO
        // ==============================

        let clientesOrdenados = [...(data || [])];

        // ==============================
        // PESQUISA
        // ==============================

        const textoPesquisa = pesquisa.toLowerCase();

        const clientesFiltrados = clientesOrdenados.filter(
          (cliente) =>
            (cliente.nome || "")
              .toLowerCase()
              .includes(textoPesquisa)
        );

        setClientes(clientesFiltrados);

      } catch (error) {
        console.error("Erro ao buscar clientes:", error);

        setErro(
          `Erro ao buscar clientes: ${
            error?.message || "Tente novamente."
          }`
        );
      } finally {
        setCarregando(false);
      }
    };

    buscarClientes();
  }, [filtroPessoa, pesquisa]);

  // ==============================
  // INTERFACE
  // ==============================

  return (
    <>
      <section className="ct-page ct-clientes-page">
      <header className="ct-heading">
        <div>
          <div className="ct-breadcrumb"><span>CodeTrack</span><b>/</b><span>Gestão</span></div>
          <h1>Clientes</h1>
          <p>Gerencie seus clientes, contatos e serviços em um só lugar.</p>
        </div>
        <Link className="ct-heading-action" to="/Cadastro-clientes">+ Cadastrar cliente</Link>
      </header>

        {/* FILTROS */}
        <div className="content-filtros-container">

          <div className="content-filtros">

            <select
              className="content-filtros__select"
              onChange={(e) =>
                setFiltroPessoa(e.target.value)
              }
              value={filtroPessoa}
            >
              <option value="">Todos</option>
              <option value="fisica">
                Pessoa Física
              </option>
              <option value="juridica">
                Pessoa Jurídica
              </option>
            </select>

            <span className="content-cadastrar-user">
              <Link to="/Cadastro-clientes">
                Cadastrar clientes
              </Link>
            </span>

          </div>

          <Pesquisa setPesquisa={setPesquisa} />

        </div>

        {/* LISTA DE CLIENTES */}
        <div className="content-clientes-container-list">

          <table className="content-clientes">

            <thead>
              <tr>
                <th>Foto</th>
                <th>Contratante</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Serviço</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>

              {carregando ? (

                <tr>
                  <td colSpan="6">
                    Carregando...
                  </td>
                </tr>

              ) : clientes.length > 0 ? (

                clientes.map((cliente) => (

                  <ItemCliente
                    key={cliente.id}

                    cliente={cliente.cliente}
                    nome={cliente.nome}
                    telefone={cliente.telefone}
                    servico={cliente.servico}
                    imagem={cliente.imagem || ""}

                    id={cliente.id}

                    onDelete={setClienteIdExcluir}

                    mostrarModal={mostrarModal}
                    setMostrarModal={setMostrarModal}

                    setClienteIdExcluir={
                      setClienteIdExcluir
                    }
                  />

                ))

              ) : (

                <tr>
                  <td colSpan="6">
                    {erro || "Nenhum cliente encontrado"}
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

    </section>

      {/* MODAL DE CONFIRMAÇÃO */}
      {mostrarModal && (

        <ModalConfirmacao
          onConfirm={handleDelete}
          onCancel={cancelarExclusao}
          setCarregando={setCarregando}
        />

      )}

    </>
  );
};

export default Clientes;
