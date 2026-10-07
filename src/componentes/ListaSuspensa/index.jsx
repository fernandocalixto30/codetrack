import "./ListaSuspensa.css";
const ListaSuspensa = (props) => {

  return (
    <div className="Lista-suspensa">
      <label>{props.label}</label>
      <select value={props.value} onChange={evento => props.aoAlterado(evento.target.value)}>  
       
       
        {props.itens.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  );
};
export default ListaSuspensa;
