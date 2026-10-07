import { FileStack, SlidersHorizontal, ChevronDown } from "lucide-react";
import ProjetoCard from "../ProjetoCard";

const ListaProjetos = ({
  projetos,
  // eslint-disable-next-line react/prop-types
  clientes,
  pagamentos,
  busy,
  money,
  today,
  onPagamento,
  onEditar,
  onExcluir,
  onMarcarPago
}) => (
  <section className="ct-panel ct-projects-panel">
    <div className="ct-projects-heading">
      <div className="ct-projects-title">
        <div className="ct-panel-heading-icon blue">
          <FileStack size={21} />
        </div>
        <div>
          <h2>Seus projetos ({projetos.length})</h2>
          <p>Acompanhe o status, entregas e recebimentos dos seus projetos.</p>
        </div>
      </div>

      <div className="ct-project-sort">
        <span>Ordenar por</span>
        <button type="button">
          Mais recentes <ChevronDown size={16} />
        </button>
        <button type="button" className="ct-filter-button" aria-label="Filtros">
          <SlidersHorizontal size={18} />
        </button>
      </div>
    </div>

    {busy && !projetos.length ? (
      <div className="ct-empty">Carregando...</div>
    ) : !projetos.length ? (
      <div className="ct-empty">Nenhum projeto cadastrado.</div>
    ) : (
      <div className="ct-list">
        {projetos.map((projeto) => (
          <ProjetoCard
            key={projeto.id}
            projeto={projeto}
            clientes={clientes}
            pagamentos={pagamentos}
            money={money}
            today={today}
            onPagamento={onPagamento}
            onEditar={onEditar}
            onExcluir={onExcluir}
            onMarcarPago={onMarcarPago}
          />
        ))}
      </div>
    )}
  </section>
);

export default ListaProjetos;
