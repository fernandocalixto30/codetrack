import "./style.css";
function Colaborador(props) {

  return (
  <div className='colaborador'> 
      <div className='cabecalho'>
          <img src={props.image} alt='oi'/>
      </div>
      <div className='rodape'>
          <h4>{props.nome}</h4>
          <h5>{props.cargo}</h5>
      </div>
  </div>
)
}
export default Colaborador