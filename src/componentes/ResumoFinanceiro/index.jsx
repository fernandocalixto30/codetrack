import {
  ArrowUpRight,
  CalendarClock,
  FileText,
  WalletCards
} from "lucide-react";

const ResumoFinanceiro = ({ contracted, received, pending, overdue, money }) => {
  const items = [
    {
      label: "Contratado",
      value: contracted,
      icon: FileText,
      tone: "blue"
    },
    {
      label: "Recebido",
      value: received,
      icon: WalletCards,
      tone: "green"
    },
    {
      label: "A receber",
      value: pending,
      icon: CalendarClock,
      tone: "orange"
    },
    {
      label: "Vencido",
      value: overdue,
      icon: CalendarClock,
      tone: "red"
    }
  ];

  return (
    <section className="ct-stats" aria-label="Resumo financeiro">
      {items.map(({ label, value, icon: Icon, tone }) => (
        <article className={`ct-stat-card ${tone}`} key={label}>
          <div className="ct-stat-icon">
            <Icon size={25} strokeWidth={1.9} />
          </div>
          <div className="ct-stat-content">
            <span>{label}</span>
            <strong>{money(value)}</strong>
          </div>
          <div className="ct-stat-trend">
            <ArrowUpRight size={15} />
            <span>0%</span>
          </div>
        </article>
      ))}
    </section>
  );
};

export default ResumoFinanceiro;
