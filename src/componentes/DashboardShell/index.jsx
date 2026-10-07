import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  FolderKanban,
  House,
  LogOut,
  Menu,
  Settings,
  UsersRound,
  WalletCards,
  BarChart3,
  Search,
  X
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import "./DashboardShell.css";

const navItems = [
  { label: "Dashboard", to: "/", icon: House, exact: true },
  { label: "Clientes", to: "/", icon: UsersRound, exact: true, duplicate: true },
  { label: "Projetos & Financeiro", to: "/projetos", icon: FolderKanban },
  { label: "Pagamentos", to: "/projetos", icon: WalletCards },
  { label: "Relatórios", to: "/projetos", icon: BarChart3 },
  { label: "Configurações", to: "/perfil", icon: Settings }
];

export default function DashboardShell() {
  const [usuario, setUsuario] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUsuario(data.user);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const nome = usuario?.user_metadata?.nome || "Fernando";
  const inicial = nome.trim().charAt(0).toUpperCase() || "F";

  const sair = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const isActive = (item) => {
    if (item.label === "Dashboard") return location.pathname === "/";
    if (item.label === "Clientes") return false;
    if (item.label === "Projetos & Financeiro") return location.pathname === "/projetos";
    return false;
  };

  return (
    <div className="ct-shell">
      <aside className={`ct-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="ct-brand">
          <span className="ct-brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <strong>CodeTrack</strong>
          <button className="ct-sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Fechar menu">
            <X size={19} />
          </button>
        </div>

        <nav className="ct-nav" aria-label="Navegação principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={`ct-nav-item ${active ? "is-active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={20} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="ct-sidebar-user">
          <button className="ct-user-card" onClick={() => navigate("/perfil")}>
            <span className="ct-avatar">{inicial}</span>
            <span className="ct-user-copy">
              <strong>{nome}</strong>
              <small>Administrador</small>
            </span>
          </button>

          <button className="ct-logout" onClick={sair}>
            <LogOut size={20} strokeWidth={1.8} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {mobileOpen && <button className="ct-mobile-backdrop" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />}

      <section className="ct-workspace">
        <header className="ct-topbar">
          <div className="ct-search">
            <Search size={19} />
            <input
              aria-label="Pesquisar"
              placeholder="Pesquisar clientes, projetos ou pagamentos..."
            />
            <kbd>Ctrl K</kbd>
          </div>

          <div className="ct-top-actions">
            <button className="ct-icon-button" aria-label="Notificações">
              <Bell size={21} strokeWidth={1.8} />
              <span className="ct-notification-dot" />
            </button>

            <div className="ct-top-divider" />

            <button className="ct-top-user" onClick={() => navigate("/perfil")}>
              <span className="ct-avatar ct-avatar-top">{inicial}</span>
              <span className="ct-top-user-copy">
                <strong>Olá, {nome.split(" ")[0]}!</strong>
                <small>Administrador</small>
              </span>
              <ChevronDown size={18} />
            </button>
          </div>

          <button className="ct-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
        </header>

        <main className="ct-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
}
