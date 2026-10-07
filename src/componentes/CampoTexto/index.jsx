import "./CampoTexto.css";

const CampoTexto = ({ label, valor, placeholder, aoAlterado, type,patern }) => {
  const aoDigitar = (evento) => {
    if (aoAlterado) {
      aoAlterado(evento.target.value);
    }
  };

  return (
    <div className="campo-texto">
      <label>{label}</label>
      <input
        type={type}
        value={valor}
        onChange={aoDigitar}
        placeholder={placeholder}
        pattern={patern}
        required
      />
    </div>
  );
};

export default CampoTexto;
