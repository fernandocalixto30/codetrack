import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import ResumoFinanceiro from '../../componentes/ResumoFinanceiro';
import ProjetoForm from '../../componentes/ProjetoForm';
import ListaProjetos from '../../componentes/ListaProjetos';
import ModalPagamento from '../../componentes/ModalPagamento';
import './style.css';

const statuses = [
  'Orçamento',
  'Aguardando início',
  'Em andamento',
  'Em revisão',
  'Concluído',
  'Cancelado'
];

const today = () => new Date().toISOString().slice(0, 10);

const money = (n) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(n) || 0);

const blank = {
  cliente_id: '',
  titulo: '',
  descricao: '',
  status: 'Orçamento',
  data_inicio: today(),
  data_entrega: '',
  valor: '',
  parcelas: '1',
  vencimento: today()
};

export default function Projetos() {
  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [paying, setPaying] = useState(null);
  const [pay, setPay] = useState({
    valor: '',
    data: today(),
    obs: ''
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    setBusy(true);
    setError('');

    const {
      data: { user: u }
    } = await supabase.auth.getUser();

    if (!u) {
      setError('Sessão expirada. Entre novamente.');
      setBusy(false);
      return;
    }

    setUser(u);

    const [c, p, g] = await Promise.all([
      supabase
        .from('clientes')
        .select('id,nome')
        .eq('user_id', u.id)
        .order('nome'),
      supabase
        .from('projetos')
        .select('*')
        .eq('user_id', u.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('pagamentos')
        .select('*')
        .eq('user_id', u.id)
        .order('data_vencimento')
    ]);

    const err = c.error || p.error || g.error;

    if (err) {
      setError(
        'Erro ao carregar os dados do CodeTrack: ' + err.message
      );
    }

    setClientes(c.data || []);
    setProjetos(p.data || []);
    setPagamentos(g.data || []);
    setBusy(false);
  };

  useEffect(() => {
    load();
  }, []);

  const change = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  // O financeiro considera somente projetos ativos no contratado.
  const contracted = projetos
    .filter((p) => p.status !== 'Cancelado')
    .reduce((s, p) => s + Number(p.valor || 0), 0);

  // Tudo que possui status Pago representa dinheiro recebido.
  const received = pagamentos
    .filter((p) => p.status === 'Pago')
    .reduce((s, p) => s + Number(p.valor || 0), 0);

  // O saldo a receber vem do contrato, não da soma das parcelas.
  const pending = Math.max(contracted - received, 0);

  const overdue = pagamentos
    .filter(
      (p) =>
        p.status !== 'Pago' &&
        p.data_vencimento &&
        p.data_vencimento < today()
    )
    .reduce((s, p) => s + Number(p.valor || 0), 0);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMsg('');

    if (!user) {
      setError('Usuário não autenticado.');
      setBusy(false);
      return;
    }

    const valorProjeto = Number(form.valor);

    if (!valorProjeto || valorProjeto <= 0) {
      setError('Informe um valor válido para o projeto.');
      setBusy(false);
      return;
    }

    const data = {
      user_id: user.id,
      cliente_id: form.cliente_id,
      titulo: form.titulo.trim(),
      descricao: form.descricao,
      status: form.status,
      data_inicio: form.data_inicio || null,
      data_entrega: form.data_entrega || null,
      valor: valorProjeto
    };

    const r = editing
      ? await supabase
          .from('projetos')
          .update(data)
          .eq('id', editing)
          .eq('user_id', user.id)
      : await supabase
          .from('projetos')
          .insert(data)
          .select()
          .single();

    if (r.error) {
      setError(r.error.message);
      setBusy(false);
      return;
    }

    if (!editing) {
      const n = Math.max(
        1,
        Math.min(60, Number(form.parcelas) || 1)
      );

      const part =
        Math.round((valorProjeto / n) * 100) / 100;

      const rows = Array.from({ length: n }, (_, i) => {
        const d = new Date(
          (form.vencimento || today()) + 'T12:00:00'
        );

        d.setMonth(d.getMonth() + i);

        return {
          user_id: user.id,
          projeto_id: r.data.id,
          valor:
            i === n - 1
              ? Math.round(
                  (valorProjeto - part * (n - 1)) * 100
                ) / 100
              : part,
          data_vencimento: d.toISOString().slice(0, 10),
          status: 'Pendente',
          observacao: `Parcela ${i + 1}/${n}`
        };
      });

      const { error: e2 } = await supabase
        .from('pagamentos')
        .insert(rows);

      if (e2) {
        setError(
          'Projeto criado, mas falhou a geração de parcelas: ' +
            e2.message
        );
        setBusy(false);
        return;
      }
    }

    setMsg(editing ? 'Projeto atualizado.' : 'Projeto cadastrado!');
    setForm(blank);
    setEditing(null);
    await load();
  };

  const markPaid = async (p) => {
    if (!user) {
      setError('Usuário não autenticado.');
      return;
    }

    setError('');
    setMsg('');

    const { error: e } = await supabase
      .from('pagamentos')
      .update({
        status: 'Pago',
        data_pagamento: today()
      })
      .eq('id', p.id)
      .eq('user_id', user.id);

    if (e) {
      setError(e.message);
      return;
    }

    setMsg('Pagamento marcado como recebido.');
    await load();
  };

  const register = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    if (!user || !paying) {
      setError('Usuário ou projeto não encontrado.');
      return;
    }

    const valorPagamento = Number(pay.valor);

    if (!valorPagamento || valorPagamento <= 0) {
      setError('Informe um valor válido para o pagamento.');
      return;
    }

    const pagamentosProjeto = pagamentos.filter(
      (p) => String(p.projeto_id) === String(paying.id)
    );

    const recebidoProjeto = pagamentosProjeto
      .filter((p) => p.status === 'Pago')
      .reduce((s, p) => s + Number(p.valor || 0), 0);

    const valorProjeto = Number(paying.valor || 0);
    const saldoProjeto = Math.max(valorProjeto - recebidoProjeto, 0);

    if (valorPagamento > saldoProjeto) {
      setError(
        `O valor máximo disponível para recebimento neste projeto é ${money(
          saldoProjeto
        )}.`
      );
      return;
    }

    // Distribui o recebimento nas parcelas pendentes.
    // Pagamentos parciais criam um registro Pago e deixam o restante pendente.
    const pendentes = pagamentosProjeto
      .filter((p) => p.status !== 'Pago')
      .sort((a, b) =>
        String(a.data_vencimento || '').localeCompare(
          String(b.data_vencimento || '')
        )
      );

    let restante = valorPagamento;

    for (const parcela of pendentes) {
      if (restante <= 0) break;

      const valorParcela = Number(parcela.valor || 0);

      if (restante >= valorParcela) {
        const { error: updateError } = await supabase
          .from('pagamentos')
          .update({
            status: 'Pago',
            data_pagamento: pay.data,
            observacao: pay.obs
              ? `${parcela.observacao || 'Parcela'} - ${pay.obs}`
              : parcela.observacao
          })
          .eq('id', parcela.id)
          .eq('user_id', user.id);

        if (updateError) {
          setError(updateError.message);
          return;
        }

        restante -= valorParcela;
      } else {
        const saldoParcela =
          Math.round((valorParcela - restante) * 100) / 100;

        const { error: updateError } = await supabase
          .from('pagamentos')
          .update({ valor: saldoParcela })
          .eq('id', parcela.id)
          .eq('user_id', user.id);

        if (updateError) {
          setError(updateError.message);
          return;
        }

        const { error: insertError } = await supabase
          .from('pagamentos')
          .insert({
            user_id: user.id,
            projeto_id: paying.id,
            valor: restante,
            data_vencimento: pay.data,
            data_pagamento: pay.data,
            status: 'Pago',
            observacao: pay.obs || 'Pagamento'
          });

        if (insertError) {
          setError(insertError.message);
          return;
        }

        restante = 0;
      }
    }

    // Se não houver parcelas pendentes, registra como pagamento avulso.
    if (restante > 0 && pendentes.length === 0) {
      const { error: insertError } = await supabase
        .from('pagamentos')
        .insert({
          user_id: user.id,
          projeto_id: paying.id,
          valor: restante,
          data_vencimento: pay.data,
          data_pagamento: pay.data,
          status: 'Pago',
          observacao: pay.obs || 'Pagamento avulso'
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }
    }

    setPaying(null);
    setPay({ valor: '', data: today(), obs: '' });
    setMsg('Pagamento registrado com sucesso!');
    await load();
  };

  const remove = async (p) => {
    if (!user) {
      setError('Usuário não autenticado.');
      return;
    }

    if (!confirm(`Excluir ${p.titulo} e os pagamentos vinculados?`)) {
      return;
    }

    const { error: e } = await supabase
      .from('projetos')
      .delete()
      .eq('id', p.id)
      .eq('user_id', user.id);

    if (e) {
      setError(e.message);
      return;
    }

    setMsg('Projeto excluído.');
    await load();
  };

  const handlePagamento = (projeto) => {
    setPaying(projeto);
    setPay({ valor: '', data: today(), obs: '' });
  };

  const handleEditar = (projeto) => {
    setEditing(projeto.id);
    setForm({
      ...blank,
      ...projeto,
      cliente_id: String(projeto.cliente_id),
      valor: String(projeto.valor)
    });
  };

  return (
    <main className="ct-page">
        <header className="ct-heading">
          <div>
            <div className="ct-breadcrumb">
            <span>CodeTrack</span><b>/</b><span>Gestão</span>
          </div>
            <h1>Projetos & <em>Financeiro</em></h1>
            <p>Gerencie entregas, contratos e recebimentos de forma simples e organizada.</p>
          </div>

          <Link to="/"><span aria-hidden="true">←</span> Clientes</Link>
        </header>

        {error && <p className="ct-alert error">{error}</p>}
        {msg && <p className="ct-alert">{msg}</p>}

        <ResumoFinanceiro
          contracted={contracted}
          received={received}
          pending={pending}
          overdue={overdue}
          money={money}
        />

        <ProjetoForm
          editing={editing}
          form={form}
          change={change}
          save={save}
          busy={busy}
          clientes={clientes}
          blank={blank}
          setEditing={setEditing}
          setForm={setForm}
          statuses={statuses}
          Link={Link}
        />

        <ListaProjetos
          projetos={projetos}
          clientes={clientes}
          pagamentos={pagamentos}
          busy={busy}
          money={money}
          today={today}
          onPagamento={handlePagamento}
          onEditar={handleEditar}
          onExcluir={remove}
          onMarcarPago={markPaid}
        />

        <ModalPagamento
          paying={paying}
          pay={pay}
          setPay={setPay}
          setPaying={setPaying}
          register={register}
        />
    </main>
  );
}
