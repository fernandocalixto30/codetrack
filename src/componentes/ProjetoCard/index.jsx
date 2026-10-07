import {
  Pencil,
  Trash2,
  Plus,
  CheckCircle2
} from "lucide-react";

const ProjetoCard = ({
  projeto,
  clientes,
  pagamentos,
  money,
  today,
  onPagamento,
  onEditar,
  onExcluir,
  onMarcarPago
}) => {
  const ps = pagamentos.filter(
    (x) => String(x.projeto_id) === String(projeto.id)
  );

  const paid = ps
    .filter((x) => x.status === "Pago")
    .reduce((sum, x) => sum + Number(x.valor || 0), 0);

  const projectPending = Math.max(Number(projeto.valor || 0) - paid, 0);

  const next = ps
    .filter((x) => x.status !== "Pago")
    .sort((a, b) =>
      String(a.data_vencimento || "").localeCompare(
        String(b.data_vencimento || "")
      )
    )[0];

  const clientName =
    clientes.find((c) => String(c.id) === String(projeto.cliente_id))?.nome ||
    "Cliente";

  const progress =
    Number(projeto.valor) > 0
      ? Math.min(100, (paid / Number(projeto.valor)) * 100)
      : 0;

  const initials = projeto.titulo?.trim()?.charAt(0)?.toUpperCase() || "P";

  return (
    <article className="ct-project">
      <div className="ct-project-main">
        <div className="ct-project-avatar">{initials}</div>

        <div className="ct-project-info">
          <div className="ct-project-title-row">
            <div>
              <h3>{projeto.titulo}</h3>
              <p>
                {clientName} · Entrega: {projeto.data_entrega || "Não definida"}
              </p>
            </div>
            <span className={`ct-status status-${String(projeto.status).toLowerCase().replaceAll(" ", "-")}`}>
              {projeto.status}
            </span>
          </div>

          {projeto.descricao && (
            <p className="ct-project-description">{projeto.descricao}</p>
          )}

          <div className="ct-progress">
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="ct-meta">
            <span>Recebido: <strong>{money(paid)}</strong></span>
            <span>
              {next
                ? `Próximo vencimento: ${next.data_vencimento} (${money(next.valor)})`
                : "Sem pendências"}
            </span>
            <span>A receber: <strong>{money(projectPending)}</strong></span>
          </div>

          <div className="ct-project-actions">
            <button className="ct-payment-button" onClick={() => onPagamento(projeto)}>
              <Plus size={17} /> Pagamento
            </button>

            <button className="ct-edit-button" onClick={() => onEditar(projeto)}>
              <Pencil size={16} /> Editar
            </button>

            <button className="ct-delete-button" onClick={() => onExcluir(projeto)}>
              <Trash2 size={16} /> Excluir
            </button>
          </div>
        </div>

        <strong className="ct-project-value">{money(projeto.valor)}</strong>
      </div>

      {ps.length > 0 && (
        <details className="ct-payments-details">
          <summary>Parcelas e vencimentos ({ps.length})</summary>

          <div className="ct-payment-list">
            {ps.map((x) => (
              <div className="ct-payment" key={x.id}>
                <span>
                  {x.observacao || "Pagamento"} · {x.data_vencimento}
                </span>
                <b>{money(x.valor)}</b>
                <span className={
                  x.status === "Pago"
                    ? "paid"
                    : x.data_vencimento < today()
                      ? "late"
                      : "pending"
                }>
                  {x.status === "Pago" ? "Pago" : x.data_vencimento < today() ? "Vencido" : "Pendente"}
                </span>
                {x.status !== "Pago" && (
                  <button className="tiny" onClick={() => onMarcarPago(x)}>
                    <CheckCircle2 size={14} /> Marcar pago
                  </button>
                )}
              </div>
            ))}
          </div>
        </details>
      )}
    </article>
  );
};

export default ProjetoCard;
