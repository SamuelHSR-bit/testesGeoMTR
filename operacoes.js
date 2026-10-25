const ehAdmin = document.body.dataset.perfil === "admin";
const operacoes = [
  {
    codigo: "OP-0001",
    nome: "Extração de terras raras",
    tipo: "Extração",
    empresa: "Mineração Horizonte Ltda.",
    setor: "ST-03",
    mineral: "Terras raras",
    inicio: "2026-10-01",
    fim: "2026-12-20",
    responsavel: "Samuel Oliveira",
    equipe: "Equipe de campo A",
    status: "Em andamento",
    area: 1250,
    unidadeArea: "m²",
    quantidade: 320,
    unidadeQtd: "kg",
    observacoes: "Atividade demonstrativa para acompanhamento da área.",
  },
  {
    codigo: "OP-0002",
    nome: "Pesquisa de nióbio",
    tipo: "Pesquisa mineral",
    empresa: "Recursos Minerais do Brasil S.A.",
    setor: "ST-02",
    mineral: "Nióbio",
    inicio: "2026-10-15",
    fim: "2026-11-30",
    responsavel: "Mariana Costa",
    equipe: "Equipe de pesquisa B",
    status: "Planejada",
    area: 800,
    unidadeArea: "m²",
    quantidade: null,
    unidadeQtd: "kg",
    observacoes: "Aguardando início das atividades de campo.",
  },
  {
    codigo: "OP-0003",
    nome: "Extração experimental de lítio",
    tipo: "Extração",
    empresa: "Vale Verde Mineração Ltda.",
    setor: "ST-04",
    mineral: "Lítio",
    inicio: "2026-09-02",
    fim: "2026-09-28",
    responsavel: "Carlos Mendes",
    equipe: "Equipe operacional C",
    status: "Concluída",
    area: 460,
    unidadeArea: "m²",
    quantidade: 1.8,
    unidadeQtd: "t",
    observacoes: "Registro de exemplo; números fictícios.",
  },
  {
    codigo: "OP-0004",
    nome: "Preparação da área sul",
    tipo: "Preparação de área",
    empresa: "Mineração Horizonte Ltda.",
    setor: "ST-05",
    mineral: "Terras raras",
    inicio: "2026-10-20",
    fim: "",
    responsavel: "Fernanda Lima",
    equipe: "Equipe de campo D",
    status: "Planejada",
    area: null,
    unidadeArea: "m²",
    quantidade: null,
    unidadeQtd: "kg",
    observacoes: "Planejamento inicial.",
  },
];

const $ = (id) => document.getElementById(id);
let toastTimer;

const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const dataBR = (v) =>
  v ? `${v.slice(8, 10)}/${v.slice(5, 7)}/${v.slice(0, 4)}` : "—";

const classe = (s) =>
  ({
    "Em andamento": "em-andamento",
    Planejada: "planejada",
    Concluída: "concluida",
    Suspensa: "suspensa",
  })[s] || "planejada";

function toast(msg) {
  const t = $("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("visivel");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("visivel"), 2800);
}
function abrirSuporte() {
  abrirModal(
    "Suporte GeoMTR",
    "Para suporte técnico, entre em contato com o administrador pelo ramal interno 204 ou pelo e-mail suporte@geomtr.local.",
  );
}
function atualizar() {
  if ($("totalOperacoes")) $("totalOperacoes").textContent = operacoes.length;
  if ($("totalAndamento"))
    $("totalAndamento").textContent = operacoes.filter(
      (o) => o.status === "Em andamento",
    ).length;
  if ($("totalPlanejadas"))
    $("totalPlanejadas").textContent = operacoes.filter(
      (o) => o.status === "Planejada",
    ).length;
  if ($("totalConcluidas"))
    $("totalConcluidas").textContent = operacoes.filter(
      (o) => o.status === "Concluída",
    ).length;
}

function render() {
  if (!$("listaOperacoes")) return;
  const q = $("buscaOperacao")
    ? $("buscaOperacao").value.trim().toLocaleLowerCase("pt-BR")
    : "";
  const s = $("filtroStatus") ? $("filtroStatus").value : "todos";
  const t = $("filtroTipo") ? $("filtroTipo").value : "todos";

  const lista = operacoes.filter(
    (o) =>
      [o.codigo, o.nome, o.empresa, o.setor, o.mineral, o.responsavel, o.tipo]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(q) &&
      (s === "todos" || o.status === s) &&
      (t === "todos" || o.tipo === t),
  );

  $("listaOperacoes").innerHTML = lista
    .map(
      (o) =>
        `<tr>
          <td><div class="op-name"><strong>${esc(o.nome)}</strong><small>${esc(o.codigo)} · ${esc(o.tipo)}</small></div></td>
          <td><div class="op-company">${esc(o.empresa)}</div></td>
          <td><strong>${esc(o.setor)}</strong></td>
          <td>${dataBR(o.inicio)}<br><small>até ${dataBR(o.fim)}</small></td>
          <td><span class="op-status ${classe(o.status)}">${esc(o.status)}</span></td>
          <td>
            <div class="op-row-actions">
              <button data-acao="detalhes" data-codigo="${esc(o.codigo)}">Detalhes</button>
              ${ehAdmin && o.status !== "Concluída" ? `<button class="encerrar" data-acao="encerrar" data-codigo="${esc(o.codigo)}">Encerrar</button>` : ""}
            </div>
          </td>
        </tr>`,
    )
    .join("");

  if ($("estadoVazio")) $("estadoVazio").hidden = lista.length > 0;
  if ($("contadorResultados"))
    $("contadorResultados").textContent =
      `Exibindo ${lista.length} de ${operacoes.length} operações`;
  atualizar();
}

let codigoEmEdicao = null;

function abrirModal(codigo = null) {
  if (!ehAdmin) {
    toast("Somente o administrador pode alterar operações.");
    return;
  }
  if (!$("formOperacao")) return;
  $("formOperacao").reset();
  if ($("erroFormulario")) $("erroFormulario").textContent = "";
  codigoEmEdicao = codigo;
  const o = codigo ? operacoes.find((x) => x.codigo === codigo) : null;
  if ($("modalTitulo"))
    $("modalTitulo").textContent = o ? "Editar operação" : "Nova operação";
  if ($("modalDescricao"))
    $("modalDescricao").textContent = o
      ? "Altere os dados desta operação."
      : "Preencha os dados para registrar uma atividade.";

  const submitBtn = $("formOperacao").querySelector('[type="submit"]');
  if (submitBtn)
    submitBtn.textContent = o ? "Salvar alterações" : "Cadastrar operação";

  if (o) {
    for (const [id, key] of [
      ["nome", "nome"],
      ["tipo", "tipo"],
      ["empresa", "empresa"],
      ["mineral", "mineral"],
      ["inicio", "inicio"],
      ["fim", "fim"],
      ["responsavel", "responsavel"],
      ["equipe", "equipe"],
      ["status", "status"],
      ["area", "area"],
      ["unidadeArea", "unidadeArea"],
      ["quantidade", "quantidade"],
      ["unidadeQtd", "unidadeQtd"],
      ["observacoes", "observacoes"],
    ]) {
      if ($(id)) $(id).value = o[key] ?? "";
    }
    if ($("setor")) {
      $("setor").value =
        Array.from($("setor").options).find((x) => x.value.startsWith(o.setor))
          ?.value || "";
    }
  } else if ($("inicio")) {
    $("inicio").value = new Date().toLocaleDateString("en-CA");
  }

  if ($("modalOperacao")) $("modalOperacao").hidden = false;
  document.body.style.overflow = "hidden";
  if ($("nome")) $("nome").focus();
}

function fecharModal() {
  if ($("modalOperacao")) $("modalOperacao").hidden = true;
  document.body.style.overflow = "";
}

function detalhes(codigo) {
  const o = operacoes.find((x) => x.codigo === codigo);
  if (!o) return;
  const linhas = [
    ["Código", o.codigo],
    ["Tipo", o.tipo],
    ["Empresa", o.empresa],
    ["Setor", o.setor],
    ["Mineral", o.mineral],
    ["Status", o.status],
    ["Início", dataBR(o.inicio)],
    ["Término", dataBR(o.fim)],
    ["Responsável técnico", o.responsavel],
    ["Equipe", o.equipe || "Não informada"],
    [
      "Área afetada",
      o.area == null ? "Não informada" : `${o.area} ${o.unidadeArea}`,
    ],
    [
      "Quantidade extraída",
      o.quantidade == null
        ? "Não informada"
        : `${o.quantidade} ${o.unidadeQtd}`,
    ],
    ["Observações", o.observacoes || "Nenhuma observação"],
  ];
  alert(o.nome + "\n\n" + linhas.map(([a, b]) => a + ": " + b).join("\n"));
}

// Configurações e adaptações de Perfil de Usuário
if ($("novaOperacaoBtn")) $("novaOperacaoBtn").hidden = !ehAdmin;
if (!ehAdmin) {
  if ($("avatar")) $("avatar").textContent = "SO";
  if ($("perfilNome")) $("perfilNome").textContent = "Samuel Oliveira";
  if ($("perfilCargo")) $("perfilCargo").textContent = "Funcionário";
  document.querySelector(".admin-item")?.remove();
}

// Event Listeners
if ($("perfilBtn")) {
  $("perfilBtn").onclick = () => {
    if ($("perfilMenu")) $("perfilMenu").classList.toggle("aberto");
  };
}

document.addEventListener("click", (e) => {
  if ($("perfilMenu") && $("perfilBtn")) {
    if (
      !$("perfilMenu").contains(e.target) &&
      !$("perfilBtn").contains(e.target)
    ) {
      $("perfilMenu").classList.remove("aberto");
    }
  }
});

if ($("sairBtn")) $("sairBtn").onclick = () => (location.href = "./index.html");
if ($("suporteBtn"))
  $("suporteBtn").onclick = () =>
    toast(
      "Para suporte técnico, entre em contato com o administrador do GeoMTR.",
    );
if ($("suporteFooterBtn"))
  $("suporteFooterBtn").onclick = () =>
    toast(
      "Para suporte técnico, entre em contato com o administrador do GeoMTR.",
    );
if ($("privacidadeBtn"))
  $("privacidadeBtn").onclick = () =>
    toast("Esta seção ainda não foi configurada no protótipo.");
if ($("termosBtn"))
  $("termosBtn").onclick = () =>
    toast("Esta seção ainda não foi configurada no protótipo.");

if ($("novaOperacaoBtn")) $("novaOperacaoBtn").onclick = abrirModal;
if ($("fecharModalBtn")) $("fecharModalBtn").onclick = fecharModal;
if ($("cancelarBtn")) $("cancelarBtn").onclick = fecharModal;

if ($("modalOperacao")) {
  $("modalOperacao").addEventListener("click", (e) => {
    if (e.target === $("modalOperacao")) fecharModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $("modalOperacao") && !$("modalOperacao").hidden)
    fecharModal();
});

["buscaOperacao", "filtroStatus", "filtroTipo"].forEach((id) => {
  if ($(id))
    $(id).addEventListener(id === "buscaOperacao" ? "input" : "change", render);
});

if ($("listaOperacoes")) {
  $("listaOperacoes").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-acao]");
    if (!b) return;
    const o = operacoes.find((x) => x.codigo === b.dataset.codigo);
    if (!o) return;
    if (b.dataset.acao === "detalhes") detalhes(o.codigo);
    if (b.dataset.acao === "editar" && ehAdmin) abrirModal(o.codigo);
    if (
      b.dataset.acao === "encerrar" &&
      ehAdmin &&
      confirm(`Marcar "${o.nome}" como concluída?`)
    ) {
      o.status = "Concluída";
      if (!o.fim) o.fim = new Date().toLocaleDateString("en-CA");
      render();
      toast("Operação marcada como concluída.");
    }
  });
}

if ($("formOperacao")) {
  $("formOperacao").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!ehAdmin) {
      toast("Somente o administrador pode cadastrar operações.");
      return;
    }
    const inicio = $("inicio").value,
      fim = $("fim").value;
    if (fim && fim < inicio) {
      if ($("erroFormulario"))
        $("erroFormulario").textContent =
          "A data de término não pode ser anterior à data de início.";
      return;
    }
    const dados = {
      nome: $("nome").value.trim(),
      tipo: $("tipo").value,
      empresa: $("empresa").value.trim(),
      setor: $("setor").value.split(" ")[0],
      mineral: $("mineral").value.trim(),
      inicio,
      fim,
      responsavel: $("responsavel").value.trim(),
      equipe: $("equipe").value.trim(),
      status: $("status").value,
      area: $("area").value === "" ? null : Number($("area").value),
      unidadeArea: $("unidadeArea").value,
      quantidade:
        $("quantidade").value === "" ? null : Number($("quantidade").value),
      unidadeQtd: $("unidadeQtd").value,
      observacoes: $("observacoes").value.trim(),
    };

    if (codigoEmEdicao) {
      const existente = operacoes.find((o) => o.codigo === codigoEmEdicao);
      if (existente) Object.assign(existente, dados);
    } else {
      const n =
        Math.max(0, ...operacoes.map((o) => Number(o.codigo.slice(3)) || 0)) +
        1;
      operacoes.unshift({
        codigo: "OP-" + String(n).padStart(4, "0"),
        ...dados,
      });
    }

    const editado = !!codigoEmEdicao;
    fecharModal();
    if ($("buscaOperacao")) $("buscaOperacao").value = "";
    if ($("filtroStatus")) $("filtroStatus").value = "todos";
    if ($("filtroTipo")) $("filtroTipo").value = "todos";
    render();
    toast(
      editado
        ? "Alterações salvas com sucesso."
        : "Operação cadastrada com sucesso.",
    );
  });
}

render();
