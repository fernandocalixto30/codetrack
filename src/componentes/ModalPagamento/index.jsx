const ModalPagamento = ({
  paying,
  pay,
  setPay,
  setPaying,
  register
}) => {
  if (!paying) return null;

  return (
    <div className="ct-overlay">
      <form className="ct-modal" onSubmit={register}>
        <button
          type="button"
          className="ct-x"
          onClick={() => setPaying(null)}
        >
          ×
        </button>

        <h2>Registrar pagamento</h2>
        <p>{paying.titulo}</p>

        <label>
          Valor recebido
          <input
            required
            type="number"
            min=".01"
            step=".01"
            value={pay.valor}
            onChange={(e) =>
              setPay({ ...pay, valor: e.target.value })
            }
          />
        </label>

        <label>
          Data
          <input
            required
            type="date"
            value={pay.data}
            onChange={(e) =>
              setPay({ ...pay, data: e.target.value })
            }
          />
        </label>

        <label>
          Observação
          <input
            value={pay.obs}
            onChange={(e) =>
              setPay({ ...pay, obs: e.target.value })
            }
          />
        </label>

        <button>Salvar pagamento</button>
      </form>
    </div>
  );
};

export default ModalPagamento;
