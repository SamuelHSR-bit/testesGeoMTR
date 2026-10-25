const dadosRelatorios = [
  {
    codigo: "REL-001",
    titulo: "Avaliação geológica",
    setor: "ST-01",
    responsavel: "Samuel Oliveira",
    data: "2026-10-15",
    status: "Concluído",
    tipo: "Avaliação geológica",
    descricao: "Avaliação geológica demonstrativa do setor.",
  },
  {
    codigo: "REL-002",
    titulo: "Inspeção de área",
    setor: "ST-02",
    responsavel: "Carlos Mendes",
    data: "2026-10-14",
    status: "Em análise",
    tipo: "Inspeção de área",
    descricao: "Inspeção demonstrativa da área.",
  },
  {
    codigo: "REL-003",
    titulo: "Análise mineral",
    setor: "ST-03",
    responsavel: "Samuel Oliveira",
    data: "2026-10-12",
    status: "Em análise",
    tipo: "Avaliação geológica",
    descricao: "Análise demonstrativa de características minerais.",
  },
  {
    codigo: "REL-004",
    titulo: "Monitoramento de extração",
    setor: "ST-04",
    responsavel: "Fernanda Lima",
    data: "2026-10-10",
    status: "Concluído",
    tipo: "Monitoramento",
    descricao: "Monitoramento demonstrativo das atividades.",
  },
  {
    codigo: "REL-005",
    titulo: "Levantamento de terreno",
    setor: "ST-05",
    responsavel: "Mariana Costa",
    data: "2026-10-08",
    status: "Rascunho",
    tipo: "Inspeção de área",
    descricao: "Levantamento demonstrativo do terreno.",
  },
  {
    codigo: "REL-006",
    titulo: "Avaliação ambiental",
    setor: "ST-02",
    responsavel: "Samuel Oliveira",
    data: "2026-10-05",
    status: "Concluído",
    tipo: "Monitoramento",
    descricao: "Avaliação ambiental demonstrativa.",
  },
];

// Recupera os relatórios criados neste navegador. A integração com servidor/banco
// deve ser configurada para compartilhar os dados entre usuários e dispositivos.
try {
  const salvos = JSON.parse(localStorage.getItem("geomtr_relatorios") || "[]");
  if (Array.isArray(salvos)) {
    const codigosBase = new Set(dadosRelatorios.map((r) => r.codigo));
    salvos.filter((r) => r && r.codigo && !codigosBase.has(r.codigo)).reverse().forEach((r) => dadosRelatorios.unshift(r));
  }
} catch (erro) { /* armazenamento local indisponível; mantém a sessão atual */ }

function salvarRelatoriosLocais() {
  try { localStorage.setItem("geomtr_relatorios", JSON.stringify(dadosRelatorios)); }
  catch (erro) { /* o cadastro continua visível nesta sessão */ }
}

// Identifica o perfil pelo atributo data-perfil do HTML.
const perfilAtual = document.body.dataset.perfil;
const ehAdmin = perfilAtual === "admin";
const nomeFuncionario = "Samuel Oliveira";

const busca = document.getElementById("buscaRelatorio");
const filtroStatus = document.getElementById("filtroStatus");
const filtroResponsavel = document.getElementById("filtroResponsavel");
const lista = document.getElementById("listaRelatorios");

const modalRelatorio = document.getElementById("modalNovoRelatorio");
const formularioRelatorio = document.getElementById("formNovoRelatorio");

// Retorna somente os relatórios permitidos para a página atual.
function obterBaseRelatorios() {
  return ehAdmin
    ? dadosRelatorios
    : dadosRelatorios.filter(
        (relatorio) => relatorio.responsavel === nomeFuncionario,
      );
}

function obterRelatoriosVisiveis() {
  const dados = obterBaseRelatorios();
  const termo = busca ? busca.value.trim().toLowerCase() : "";
  const status = filtroStatus ? filtroStatus.value : "";
  const responsavel = filtroResponsavel ? filtroResponsavel.value : "";

  return dados.filter((relatorio) => {
    const correspondeBusca = [
      relatorio.codigo,
      relatorio.titulo,
      relatorio.setor,
      relatorio.responsavel,
      relatorio.tipo,
    ].some((valor) =>
      String(valor || "")
        .toLowerCase()
        .includes(termo),
    );

    const correspondeStatus = !status || relatorio.status === status;

    const correspondeResponsavel =
      !responsavel || relatorio.responsavel === responsavel;

    return correspondeBusca && correspondeStatus && correspondeResponsavel;
  });
}

function classeStatus(status) {
  if (status === "Concluído") return "concluido";
  if (status === "Em análise") return "analise";
  return "rascunho";
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function criarCelula(texto, classe = "") {
  const celula = document.createElement("td");
  celula.textContent = texto;

  if (classe) {
    celula.className = classe;
  }

  return celula;
}

function renderizarRelatorios() {
  if (!lista) return;

  const relatorios = obterRelatoriosVisiveis();
  lista.replaceChildren();

  if (relatorios.length === 0) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");

    celula.colSpan = ehAdmin ? 7 : 6;
    celula.className = "relatorio-vazio";
    celula.textContent = "Nenhum relatório encontrado com esses filtros.";

    linha.appendChild(celula);
    lista.appendChild(linha);
  } else {
    relatorios.forEach((relatorio) => {
      const linha = document.createElement("tr");

      linha.appendChild(criarCelula(relatorio.codigo, "relatorio-codigo"));

      linha.appendChild(criarCelula(relatorio.titulo));
      linha.appendChild(criarCelula(relatorio.setor));

      // A coluna Responsável existe somente na tabela do administrador.
      if (ehAdmin) {
        linha.appendChild(criarCelula(relatorio.responsavel));
      }

      linha.appendChild(criarCelula(formatarData(relatorio.data)));

      const celulaStatus = document.createElement("td");
      const etiquetaStatus = document.createElement("span");

      etiquetaStatus.className = `relatorio-status ${classeStatus(relatorio.status)}`;
      etiquetaStatus.textContent = relatorio.status;

      celulaStatus.appendChild(etiquetaStatus);
      linha.appendChild(celulaStatus);

      const celulaAcoes = document.createElement("td");
      const grupoAcoes = document.createElement("div");
      const botaoVer = document.createElement("button");

      grupoAcoes.className = "relatorio-acoes";
      botaoVer.type = "button";
      botaoVer.textContent = "Ver";

      botaoVer.addEventListener("click", () => {
        verRelatorio(relatorio.codigo);
      });

      grupoAcoes.appendChild(botaoVer);
      celulaAcoes.appendChild(grupoAcoes);
      linha.appendChild(celulaAcoes);

      lista.appendChild(linha);
    });
  }

  const contador = document.getElementById("contadorRelatorios");

  if (contador) {
    contador.textContent = `Exibindo ${relatorios.length} de ${obterBaseRelatorios().length} relatório(s).`;
  }
}

function atualizarIndicadores() {
  const dados = obterBaseRelatorios();

  const total = document.getElementById("totalRelatorios");
  const concluidos = document.getElementById("totalConcluidos");
  const analise = document.getElementById("totalAnalise");
  const rascunhos = document.getElementById("totalRascunhos");

  if (total) total.textContent = dados.length;

  if (concluidos) {
    concluidos.textContent = dados.filter(
      (r) => r.status === "Concluído",
    ).length;
  }

  if (analise) {
    analise.textContent = dados.filter((r) => r.status === "Em análise").length;
  }

  if (rascunhos) {
    rascunhos.textContent = dados.filter((r) => r.status === "Rascunho").length;
  }
}

function verRelatorio(codigo) {
  const relatorio = obterBaseRelatorios().find(
    (item) => item.codigo === codigo,
  );

  if (!relatorio) return;

  alert(
    `Código: ${relatorio.codigo}\n` +
      `Título: ${relatorio.titulo}\n` +
      `Tipo: ${relatorio.tipo || "Não informado"}\n` +
      `Setor: ${relatorio.setor}\n` +
      `Responsável: ${relatorio.responsavel}\n` +
      `Data: ${formatarData(relatorio.data)}\n` +
      `Status: ${relatorio.status}\n\n` +
      `Descrição: ${relatorio.descricao || "Sem descrição"}`,
  );
}

function exportarRelatorios() {
  if (!ehAdmin) return;

  const dados = obterRelatoriosVisiveis();

  const cabecalho = [
    "Código",
    "Relatório",
    "Setor",
    "Responsável",
    "Data",
    "Status",
    "Tipo",
    "Descrição",
  ];

  const linhas = dados.map((r) => [
    r.codigo,
    r.titulo,
    r.setor,
    r.responsavel,
    formatarData(r.data),
    r.status,
    r.tipo || "",
    r.descricao || "",
  ]);

  const csv = [cabecalho, ...linhas]
    .map((linha) =>
      linha.map((valor) => `"${String(valor).replace(/"/g, '""')}"`).join(";"),
    )
    .join("\r\n");

  const arquivo = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(arquivo);
  const link = document.createElement("a");

  link.href = url;
  link.download = "relatorios-gerais.csv";
  link.click();

  URL.revokeObjectURL(url);
}

// ========================================
// CADASTRO DE NOVO RELATÓRIO
// ========================================

function abrirNovoRelatorio() {
  if (!modalRelatorio) return;

  const campoResponsavel = document.getElementById("campoResponsavel");
  const selectResponsavel = document.getElementById("responsavelRelatorio");

  if (campoResponsavel && selectResponsavel) {
    campoResponsavel.style.display = ehAdmin ? "flex" : "none";
    selectResponsavel.required = ehAdmin;
  }

  modalRelatorio.classList.add("aberto");
}

function fecharNovoRelatorio() {
  if (modalRelatorio) {
    modalRelatorio.classList.remove("aberto");
  }
}

function mostrarAvisoRelatorio(mensagem) {
  const aviso = document.getElementById("avisoRelatorio");
  if (!aviso) return;

  aviso.textContent = mensagem;
  aviso.classList.add("visivel");

  setTimeout(() => {
    aviso.classList.remove("visivel");
  }, 3500);
}

if (formularioRelatorio) {
  formularioRelatorio.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const titulo = document.getElementById("tituloRelatorio").value.trim();
    const setor = document.getElementById("setorRelatorio").value;
    const tipo = document.getElementById("tipoRelatorio").value;
    const status = document.getElementById("statusRelatorio").value;
    const descricao = document
      .getElementById("descricaoRelatorio")
      .value.trim();

    const selectResponsavel = document.getElementById("responsavelRelatorio");

    const responsavel = ehAdmin
      ? selectResponsavel
        ? selectResponsavel.value
        : ""
      : nomeFuncionario;

    if (!titulo || !setor || !tipo || !descricao || !responsavel) {
      mostrarAvisoRelatorio("Preencha todos os campos obrigatórios.");
      return;
    }

    // Gera um código único para este relatório.
    const codigo = "REL-" + Date.now().toString().slice(-8);

    const novoRelatorio = {
      codigo,
      titulo,
      setor,
      responsavel,
      data: [
        new Date().getFullYear(),
        String(new Date().getMonth() + 1).padStart(2, "0"),
        String(new Date().getDate()).padStart(2, "0"),
      ].join("-"),
      status,
      tipo,
      descricao,
    };

    // O cadastro alimenta a mesma lista usada pelos filtros e pela tabela.
    dadosRelatorios.unshift(novoRelatorio);
    salvarRelatoriosLocais();

    formularioRelatorio.reset();
    fecharNovoRelatorio();

    atualizarIndicadores();
    renderizarRelatorios();

    mostrarAvisoRelatorio("Relatório cadastrado com sucesso!");
  });
}

if (busca) {
  busca.addEventListener("input", renderizarRelatorios);
}

if (filtroStatus) {
  filtroStatus.addEventListener("change", renderizarRelatorios);
}

if (filtroResponsavel) {
  filtroResponsavel.addEventListener("change", renderizarRelatorios);
}

if (modalRelatorio) {
  modalRelatorio.addEventListener("click", (evento) => {
    if (evento.target === modalRelatorio) {
      fecharNovoRelatorio();
    }
  });
}

// Inicializa a página.
atualizarIndicadores();
renderizarRelatorios();
