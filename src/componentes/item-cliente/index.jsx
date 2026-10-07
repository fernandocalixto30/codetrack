import { FaTrash } from "react-icons/fa";
import './style.css';

const ItemCliente = ({ imagem, cliente, nome, telefone, servico, onDelete, id, mostrarModal, setMostrarModal, setClienteIdExcluir }) => {
  const handleDelete = () => {
    // Exibe o modal de confirmação e passa o id do cliente a ser excluído
    setClienteIdExcluir(id);
    setMostrarModal(true);
  };

  return (
    <tr>
      <td>
        {imagem ? <img src={imagem} alt="Foto do Cliente" className="content-clientes__img" /> : ""}
      </td>
      <td>{cliente}</td>
      <td>{nome}</td>
      <td>{telefone}</td>
      <td>{servico}</td>
      <td className="content-clientes__icones">
        <FaTrash className="content-clientes__icon--delete" onClick={handleDelete} />
      </td>
    </tr>
  );
};

export default ItemCliente;
