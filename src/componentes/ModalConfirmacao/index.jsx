import './style.css';

const ModalConfirmacao = ({ onConfirm, onCancel }) => {
  const confirmarExclusao = () => {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este cliente?'
    );

    if (confirmar) {
      onConfirm();
    } else {
      onCancel();
    }
  };

  confirmarExclusao();

  return ;
};

export default ModalConfirmacao;