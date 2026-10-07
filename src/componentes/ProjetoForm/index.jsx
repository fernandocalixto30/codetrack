import {
  CalendarDays,
  CircleDollarSign,
  FileText,
  Folder,
  Plus,
  UserRound,
  CircleDot
} from "lucide-react";

const ProjetoForm = ({
  editing,
  form,
  change,
  save,
  busy,
  clientes,
  blank,
  setEditing,
  setForm,
  statuses,
  Link
}) => {
  /*
   * Valor total do projeto.
   */
  const valorTotal = Number(form.valor) || 0;

  /*
   * Quantidade de parcelas.
   *
   * À vista = 1
   * Parcelado = quantidade escolhida pelo usuário
   */
  const quantidadeParcelas =
    form.forma_pagamento === "Parcelado"
      ? Math.max(2, Number(form.parcelas) || 2)
      : 1;

  /*
   * Calcula o valor aproximado de cada parcela.
   *
   * Exemplo:
   * R$ 1.500 / 6 = R$ 250,00
   *
   * R$ 1.000 / 3 = R$ 333,33
   *
   * Nesse segundo caso, a última parcela será
   * ajustada pelo Projetos.jsx para R$ 333,34.
   */
  const valorParcela =
    quantidadeParcelas > 0
      ? valorTotal / quantidadeParcelas
      : 0;

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  return (
    <section className="ct-panel ct-form-panel">
      <div className="ct-panel-heading">
        <div className="ct-panel-heading-icon">
          <Plus size={25} strokeWidth={2} />
        </div>

        <div>
          <h2>
            {editing
              ? "Editar projeto"
              : "Cadastrar projeto"}
          </h2>

          <p>
            Adicione um novo projeto e acompanhe sua
            entrega e pagamentos.
          </p>
        </div>
      </div>

      <form className="ct-form" onSubmit={save}>
        {/* CLIENTE */}
        <label>
          <span className="ct-label">
            <UserRound size={15} />
            Cliente
          </span>

          <div className="ct-field">
            <UserRound size={18} />

            <select
              required
              value={form.cliente_id}
              onChange={(e) =>
                change(
                  "cliente_id",
                  e.target.value
                )
              }
            >
              <option value="">
                Selecione
              </option>

              {clientes.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        </label>

        {/* PROJETO */}
        <label>
          <span className="ct-label">
            <Folder size={15} />
            Projeto
          </span>

          <div className="ct-field">
            <Folder size={18} />

            <input
              required
              value={form.titulo}
              onChange={(e) =>
                change(
                  "titulo",
                  e.target.value
                )
              }
              placeholder="Site institucional"
            />
          </div>
        </label>

        {/* STATUS */}
        <label>
          <span className="ct-label">
            <CircleDot size={15} />
            Status
          </span>

          <div className="ct-field">
            <CircleDot size={18} />

            <select
              value={form.status}
              onChange={(e) =>
                change(
                  "status",
                  e.target.value
                )
              }
            >
              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          </div>
        </label>

        {/* VALOR */}
        <label>
          <span className="ct-label">
            <CircleDollarSign size={15} />
            Valor contratado (R$)
          </span>

          <div className="ct-field">
            <CircleDollarSign size={18} />

            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={form.valor}
              onChange={(e) =>
                change(
                  "valor",
                  e.target.value
                )
              }
              placeholder="0,00"
            />
          </div>
        </label>

        {/* FORMA DE PAGAMENTO */}
        <label>
          <span className="ct-label">
            <CircleDollarSign size={15} />
            Forma de pagamento
          </span>

          <div className="ct-field">
            <CircleDollarSign size={18} />

            <select
              value={
                form.forma_pagamento ||
                "À vista"
              }
              onChange={(e) => {
                const forma =
                  e.target.value;

                if (forma === "À vista") {
                  change(
                    "forma_pagamento",
                    "À vista"
                  );

                  change(
                    "parcelas",
                    "1"
                  );
                } else {
                  change(
                    "forma_pagamento",
                    "Parcelado"
                  );

                  /*
                   * Se ainda não houver uma
                   * quantidade válida, começa em 2x.
                   */
                  if (
                    Number(form.parcelas) <
                      2
                  ) {
                    change(
                      "parcelas",
                      "2"
                    );
                  }
                }
              }}
            >
              <option value="À vista">
                À vista
              </option>

              <option value="Parcelado">
                Parcelado
              </option>
            </select>
          </div>
        </label>

        {/* PARCELAMENTO */}
        {form.forma_pagamento ===
          "Parcelado" && (
          <>
            <label>
              <span className="ct-label">
                <CircleDollarSign size={15} />
                Quantidade de parcelas
              </span>

              <div className="ct-field">
                <CircleDollarSign size={18} />

                <input
                  type="number"
                  min="2"
                  max="60"
                  step="1"
                  required
                  value={form.parcelas || "2"}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    if (value === "") {
                      change(
                        "parcelas",
                        ""
                      );
                      return;
                    }

                    const numero =
                      Math.max(
                        2,
                        Math.min(
                          60,
                          Number(value)
                        )
                      );

                    change(
                      "parcelas",
                      String(numero)
                    );
                  }}
                  placeholder="Ex.: 6"
                />
              </div>
            </label>

            {/* VALOR DE CADA PARCELA */}
            <label>
              <span className="ct-label">
                <CircleDollarSign size={15} />
                Valor de cada parcela
              </span>

              <div className="ct-field">
                <CircleDollarSign size={18} />

                <input
                  type="text"
                  readOnly
                  value={
                    valorTotal > 0
                      ? formatMoney(
                          valorParcela
                        )
                      : ""
                  }
                  placeholder="R$ 0,00"
                />
              </div>
            </label>

            {/* RESUMO */}
            {valorTotal > 0 && (
              <div className="wide">
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: "10px",
                    background:
                      "rgba(70, 120, 194, 0.08)",
                    border:
                      "1px solid rgba(70, 120, 194, 0.18)",
                    marginBottom: "4px"
                  }}
                >
                  <strong>
                    Resumo do pagamento
                  </strong>

                  <p
                    style={{
                      margin:
                        "8px 0 0"
                    }}
                  >
                    Valor total:{" "}
                    <strong>
                      {formatMoney(
                        valorTotal
                      )}
                    </strong>
                  </p>

                  <p
                    style={{
                      margin:
                        "4px 0 0"
                    }}
                  >
                    Parcelamento:{" "}
                    <strong>
                      {quantidadeParcelas}x
                    </strong>
                  </p>

                  <p
                    style={{
                      margin:
                        "4px 0 0"
                    }}
                  >
                    Cada parcela:{" "}
                    <strong>
                      {formatMoney(
                        valorParcela
                      )}
                    </strong>
                  </p>

                  {valorTotal % quantidadeParcelas !==
                    0 && (
                    <small
                      style={{
                        display:
                          "block",
                        marginTop:
                          "8px",
                        opacity: 0.75
                      }}
                    >
                      A última parcela poderá
                      ter alguns centavos de
                      diferença para que a soma
                      total fique exatamente igual
                      ao valor contratado.
                    </small>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* RESUMO À VISTA */}
        {form.forma_pagamento ===
          "À vista" &&
          valorTotal > 0 && (
            <div className="wide">
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background:
                    "rgba(70, 120, 194, 0.08)",
                  border:
                    "1px solid rgba(70, 120, 194, 0.18)",
                  marginBottom: "4px"
                }}
              >
                <strong>
                  Resumo do pagamento
                </strong>

                <p
                  style={{
                    margin:
                      "8px 0 0"
                  }}
                >
                  Pagamento à vista de{" "}
                  <strong>
                    {formatMoney(
                      valorTotal
                    )}
                  </strong>
                </p>
              </div>
            </div>
          )}

        {/* VENCIMENTO */}
        <label>
          <span className="ct-label">
            <CalendarDays size={15} />
            Primeiro vencimento
          </span>

          <div className="ct-field">
            <CalendarDays size={18} />

            <input
              type="date"
              value={
                form.vencimento || ""
              }
              onChange={(e) =>
                change(
                  "vencimento",
                  e.target.value
                )
              }
            />
          </div>
        </label>

        {/* INÍCIO */}
        <label>
          <span className="ct-label">
            <CalendarDays size={15} />
            Início
          </span>

          <div className="ct-field">
            <CalendarDays size={18} />

            <input
              type="date"
              value={
                form.data_inicio || ""
              }
              onChange={(e) =>
                change(
                  "data_inicio",
                  e.target.value
                )
              }
            />
          </div>
        </label>

        {/* ENTREGA */}
        <label>
          <span className="ct-label">
            <CalendarDays size={15} />
            Entrega prevista
          </span>

          <div className="ct-field">
            <CalendarDays size={18} />

            <input
              type="date"
              value={
                form.data_entrega || ""
              }
              onChange={(e) =>
                change(
                  "data_entrega",
                  e.target.value
                )
              }
            />
          </div>
        </label>

        {/* DESCRIÇÃO */}
        <label className="wide">
          <span className="ct-label">
            <FileText size={15} />
            Descrição
          </span>

          <div className="ct-field ct-textarea-field">
            <FileText size={18} />

            <textarea
              rows="3"
              value={
                form.descricao || ""
              }
              onChange={(e) =>
                change(
                  "descricao",
                  e.target.value
                )
              }
              placeholder="Descreva o projeto, escopo, funcionalidades, observações..."
            />
          </div>
        </label>

        {/* BOTÕES */}
        <div className="ct-form-footer">
          <button
            type="submit"
            className="ct-primary-button"
            disabled={
              busy || !clientes.length
            }
          >
            <Plus size={19} />

            {busy
              ? "Salvando..."
              : editing
              ? "Salvar alterações"
              : "Cadastrar projeto"}
          </button>

          {editing && (
            <button
              type="button"
              className="ct-secondary-button"
              onClick={() => {
                setEditing(null);
                setForm(blank);
              }}
            >
              Cancelar
            </button>
          )}

          {!clientes.length && (
            <small>
              Cadastre um cliente antes.{" "}
              <Link to="/Cadastro-clientes">
                Cadastrar cliente
              </Link>
            </small>
          )}
        </div>
      </form>
    </section>
  );
};

export default ProjetoForm;