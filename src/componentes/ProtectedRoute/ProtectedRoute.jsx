import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
      setLoading(false);
    };

    checkUser();

    // Ouvinte para mudanças de autenticação
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      listener.subscription.unsubscribe(); // Remove o ouvinte ao desmontar
    };
  }, []);

  if (loading) {
    return <div className="loading-spinner">🔄 Carregando...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
