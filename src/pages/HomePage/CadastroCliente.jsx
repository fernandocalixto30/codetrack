/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  ChevronDown,
  CircleUserRound,
  FileText,
  Folder,
  Globe2,
  Home,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  Phone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "../../supabaseClient.js";
import "./style.css";

const tiposDeServico = [
  "Desenvolvimento de Software de Gestão Empresarial",
  "Desenvolvimento de Aplicativos Desktop (Windows/Linux/MacOS)",
  "Desenvolvimento de Software para Internet das Coisas (IoT)",
  "Desenvolvimento de Sites e Aplicativos Web",
  "Desenvolvimento de Aplicativos Móveis (Android/iOS)",
  "Desenvolvimento de APIs e Integrações",
  "Manutenção e Suporte em Sistemas Web e Móveis",
  "Consultoria em Desenvolvimento de Software",
  "Gestão de Redes Sociais",
  "Criação de E-commerce e Lojas Virtuais",
  "Outros",
];

const origemOptions = ["Indicação", "Site", "Instagram", "WhatsApp", "Outro"];

const initialForm = {
  nome: "",
  empresa: "",
  email: "",
  telefone: "",
  documento: "",
  website: "",
  endereco: "",
  cliente: "Pessoa Física",
  origem: "Indicação",
  servico: tiposDeServico[3],
  observacoes: "",
  imagem: "",
};

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatDocument = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
};

const getInitials = (name = "Fernando") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "F";

const CadastroCliente = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);

  useEffect(() => {
    let mounted = true;

    const carregarUsuario = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted && data?.user) setUsuario(data.user);
    };

    carregarUsuario();
    return () => {
      mounted = false;
    };
  }, []);

  const nomeUsuario =
    usuario?.user_metadata?.nome ||
    usuario?.user_metadata?.name ||
    usuario?.email?.split("@")[0] ||
    "Usuário";

  const iniciais = useMemo(() => getInitials(nomeUsuario), [nomeUsuario]);

  const change = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErro("");
    setSucesso("");
  };

  const handleFile = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setErro("Selecione uma imagem válida para o cliente.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => change("imagem", reader.result);
    reader.readAsDataURL(selected);
  };

  const limpar = () => {
    setForm(initialForm);
    setErro("");
    setSucesso("");
  };

  const aoSalvar = async (event) => {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (!form.nome.trim() || !form.telefone.trim() || !form.cliente || !form.servico) {
      setErro("Preencha os campos obrigatórios antes de cadastrar o cliente.");
      return;
    }

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    setSalvando(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      // Mantemos exatamente as colunas utilizadas pelo banco atual de clientes.
      // Os campos visuais adicionais permanecem disponíveis no formulário sem
      // serem enviados para colunas que podem não existir no schema atual.
      const { error } = await supabase.from("clientes").insert([
        {
          user_id: authData.user.id,
          nome: form.nome.trim(),
          nome_empresa: form.empresa.trim(),
          email: form.email.trim(),
          documento: form.documento.trim(),
          website: form.website.trim(),
          endereco: form.endereco.trim(),
          origem: form.origem,
          observacoes: form.observacoes.trim(),
          telefone: form.telefone.trim(),
          imagem: form.imagem,
          cliente: form.cliente,
          servico: form.servico,
        },
      ]);

      if (error) throw error;

      setSucesso("Cliente cadastrado com sucesso!");
      setForm(initialForm);
  
      window.setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setErro(error?.message || "Não foi possível cadastrar o cliente.");
    } finally {
      setSalvando(false);
    }
  };

  const fecharMenu = () => setMenuMobile(false);

  return (
    <div className="ct-client-page">
      <aside className={`ct-client-sidebar ${menuMobile ? "is-open" : ""}`}>
        <div className="ct-client-brand">
          <div className="ct-client-brand-mark">C</div>
          <span>CodeTrack</span>
        </div>

        <nav className="ct-client-nav" aria-label="Navegação principal">
          <Link to="/" onClick={fecharMenu}>
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link className="is-active" to="/Cadastro-clientes" onClick={fecharMenu}>
            <Users size={20} />
            <span>Clientes</span>
          </Link>
          <Link to="/projetos" onClick={fecharMenu}>
            <Folder size={20} />
            <span>Projetos &amp; Financeiro</span>
          </Link>
          <Link to="/projetos" onClick={fecharMenu}>
            <FileText size={20} />
            <span>Pagamentos</span>
          </Link>
          <button type="button" className="ct-client-nav-button" onClick={() => setErro("Relatórios ainda não possuem uma rota configurada neste projeto.")}>
            <LayoutDashboard size={20} />
            <span>Relatórios</span>
          </button>
          <button type="button" className="ct-client-nav-button" onClick={() => setErro("Configurações ainda não possuem uma rota configurada neste projeto.")}>
            <Settings size={20} />
            <span>Configurações</span>
          </button>
        </nav>

        <div className="ct-client-sidebar-bottom">
          <div className="ct-client-profile-mini">
            <div className="ct-client-avatar">{iniciais}</div>
            <div>
              <strong>{nomeUsuario}</strong>
              <span>Administrador</span>
            </div>
          </div>
          <button type="button" className="ct-client-logout" onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {menuMobile && <button className="ct-client-overlay" aria-label="Fechar menu" onClick={fecharMenu} />}

      <section className="ct-client-workspace">
   

        <main className="ct-client-main">
          <div className="ct-client-heading">
            <div>
              <div className="ct-client-breadcrumb">
                <span>CodeTrack</span>
                <b>/</b>
                <span>Clientes</span>
                <b>/</b>
                <strong>Cadastrar cliente</strong>
              </div>
              <h1>
                Cadastrar <span>Cliente</span>
              </h1>
              <p>Adicione um novo cliente ao seu portfólio e comece a gerenciar seus projetos.</p>
            </div>
            <Link className="ct-client-back" to="/">
              <span>←</span> Voltar para clientes
            </Link>
          </div>

          {erro && (
            <div className="ct-client-alert ct-client-alert-error" role="alert">
              <X size={18} />
              <span>{erro}</span>
            </div>
          )}
          {sucesso && (
            <div className="ct-client-alert ct-client-alert-success" role="status">
              <ShieldCheck size={18} />
              <span>{sucesso}</span>
            </div>
          )}

          <div className="ct-client-layout">
            <form className="ct-client-card ct-client-form-card" onSubmit={aoSalvar}>
              <div className="ct-client-card-heading">
                <div className="ct-client-card-icon ct-blue">
                  <UserRound size={24} />
                </div>
                <div>
                  <h2>Dados do cliente</h2>
                  <p>Preencha as informações principais do cliente.</p>
                </div>
              </div>

              <div className="ct-client-type-row">
                <span className="ct-client-type-label">Tipo de cliente</span>
                <div className="ct-client-type-switch">
                  <button
                    type="button"
                    className={form.cliente === "Pessoa Física" ? "is-active" : ""}
                    onClick={() => change("cliente", "Pessoa Física")}
                  >
                    Pessoa Física
                  </button>
                  <button
                    type="button"
                    className={form.cliente === "Pessoa Jurídica" ? "is-active" : ""}
                    onClick={() => change("cliente", "Pessoa Jurídica")}
                  >
                    Pessoa Jurídica
                  </button>
                </div>
              </div>

              <div className="ct-client-form-grid">
                <Field icon={<UserRound size={18} />} label="Nome completo" required>
                  <input value={form.nome} onChange={(e) => change("nome", e.target.value)} placeholder={form.cliente === "Pessoa Jurídica" ? "Nome do responsável" : "Digite o nome do cliente"} required />
                </Field>

                <Field icon={<Building2 size={18} />} label="Empresa (opcional)">
                  <input value={form.empresa} onChange={(e) => change("empresa", e.target.value)} placeholder="Nome da empresa" />
                </Field>

                <Field icon={<Mail size={18} />} label="E-mail (opcional)">
                  <input type="email" value={form.email} onChange={(e) => change("email", e.target.value)} placeholder="exemplo@cliente.com" />
                </Field>

                <Field icon={<Phone size={18} />} label="Telefone" required>
                  <input type="tel" value={form.telefone} onChange={(e) => change("telefone", formatPhone(e.target.value))} placeholder="(00) 00000-0000" required />
                </Field>

                <Field icon={<FileText size={18} />} label="CPF/CNPJ (opcional)">
                  <input value={form.documento} onChange={(e) => change("documento", formatDocument(e.target.value))} placeholder="000.000.000-00" />
                </Field>

                <Field icon={<Globe2 size={18} />} label="Website (opcional)">
                  <input type="url" value={form.website} onChange={(e) => change("website", e.target.value)} placeholder="https://www.exemplo.com" />
                </Field>

                <Field className="ct-client-field-full" icon={<MapPin size={18} />} label="Endereço (opcional)">
                  <input value={form.endereco} onChange={(e) => change("endereco", e.target.value)} placeholder="Rua, número, bairro, cidade - UF" />
                </Field>

                <Field icon={<CircleUserRound size={18} />} label="Status" required>
                  <select value="Ativo" disabled aria-label="Status do cliente">
                    <option>Ativo</option>
                  </select>
                </Field>

                <Field icon={<MessageSquareText size={18} />} label="Origem do contato (opcional)">
                  <select value={form.origem} onChange={(e) => change("origem", e.target.value)}>
                    {origemOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </Field>

                <Field className="ct-client-field-full" icon={<Folder size={18} />} label="Serviço" required>
                  <select value={form.servico} onChange={(e) => change("servico", e.target.value)} required>
                    {tiposDeServico.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </Field>

                <Field className="ct-client-field-full" icon={<FileText size={18} />} label="Observações (opcional)">
                  <textarea maxLength={500} value={form.observacoes} onChange={(e) => change("observacoes", e.target.value)} placeholder="Adicione observações sobre o cliente, preferências, histórico de conversas, etc..." />
                  <small className="ct-client-counter">{form.observacoes.length}/500</small>
                </Field>
              </div>

              <div className="ct-client-photo-row">
                <div className="ct-client-photo-preview">
                  {form.imagem ? <img src={form.imagem} alt="Prévia do cliente" /> : <UserRound size={28} />}
                </div>
                <div>
                  <strong>Foto do cliente</strong>
                  <p>Use uma imagem quadrada para um melhor resultado.</p>
                  <label className="ct-client-upload">
                    Escolher foto
                    <input type="file" accept="image/*" onChange={handleFile} />
                  </label>
                </div>
              </div>

              <div className="ct-client-form-actions">
                <button className="ct-client-primary" type="submit" disabled={salvando}>
                  <Plus size={19} />
                  {salvando ? "Cadastrando..." : "Cadastrar cliente"}
                </button>
                <button className="ct-client-secondary" type="button" onClick={limpar} disabled={salvando}>
                  <X size={18} />
                  Limpar campos
                </button>
              </div>
            </form>

            <aside className="ct-client-side-cards">
              <section className="ct-client-card ct-client-info-card">
                <div className="ct-client-card-heading">
                  <div className="ct-client-card-icon ct-blue">
                    <Users size={23} />
                  </div>
                  <div>
                    <h2>Informações importantes</h2>
                    <p>Mantenha os dados atualizados para um melhor acompanhamento.</p>
                  </div>
                </div>

                <div className="ct-client-info-list">
                  <InfoItem icon={<ShieldCheck size={20} />} title="Dados seguros" text="Todos os dados são protegidos e visíveis apenas para você." />
                  <InfoItem icon={<Folder size={20} />} title="Organização" text="Mantenha suas informações organizadas e atualizadas." purple />
                  <InfoItem icon={<LayoutDashboard size={20} />} title="Melhor gestão" text="Com dados completos, você consegue gerenciar projetos e pagamentos de forma mais eficiente." />
                </div>
              </section>

              <section className="ct-client-card ct-client-tips-card">
                <div className="ct-client-card-heading">
                  <div className="ct-client-card-icon ct-yellow">
                    <Sparkles size={23} />
                  </div>
                  <div>
                    <h2>Dicas</h2>
                    <p>Para um cadastro mais completo e eficiente:</p>
                  </div>
                </div>

                <div className="ct-client-tip-list">
                  <Tip icon={<Mail size={19} />} title="Utilize um e-mail principal" text="Facilita a comunicação sobre projetos e pagamentos." />
                  <Tip icon={<Building2 size={19} />} title="Adicione a empresa" text="Se o cliente for uma empresa, isso ajuda na organização." purple />
                  <Tip icon={<FileText size={19} />} title="Inclua observações" text="Registre informações importantes sobre o cliente." />
                  <Tip icon={<LinkIcon size={19} />} title="Mantenha os dados atualizados" text="Isso garante uma melhor experiência de trabalho." purple />
                </div>
              </section>
            </aside>
          </div>
        </main>
      </section>
    </div>
  );
};

function Field({ label, icon, required, className = "", children }) {
  return (
    <label className={`ct-client-field ${className}`}>
      <span className="ct-client-label">
        {icon}
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

function InfoItem({ icon, title, text, purple = false }) {
  return (
    <div className="ct-client-info-item">
      <div className={`ct-client-info-icon ${purple ? "purple" : ""}`}>{icon}</div>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Tip({ icon, title, text, purple = false }) {
  return (
    <div className="ct-client-tip">
      <div className={`ct-client-tip-icon ${purple ? "purple" : ""}`}>{icon}</div>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default CadastroCliente;
