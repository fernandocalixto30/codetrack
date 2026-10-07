import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient.js";
import "./Banner.css";

const Banner = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {

        setUsuario(data.user);
      }
    };

    getUser();
  }, []);

  return (
    <header className="banner">
      <h1>
        <Link to="/">CodeTrack</Link>
      </h1>

      {usuario ? (
        <div className="user-info"><Link to="/projetos">Projetos & Financeiro</Link>
          <span className="welcome-text">Sejá, Bem-vindo, <Link className="user-name" to={"/perfil"}>{usuario.user_metadata?.nome || "Usuário"}</Link>!</span>

        </div>
      ) : (
        <a href="/login" className="btn-login">Login</a>
      )}
    </header>
  );
};

export default Banner;
