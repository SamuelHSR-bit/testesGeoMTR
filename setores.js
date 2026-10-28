const setoresDados = [
  {
    codigo: "ST-01",
    nome: "Mariana",
    mineral: "Terras raras",
    avaliacoes: 10,
    operacoes: 3,
    explorado: 68,
    situacao: "Favorável",
    status: "status-bom",
    data: "01/10/2026",
    responsavel: "Samuel Oliveira",
    area: "2,10 km²",
    nota: "Resultados preliminares consistentes; manter acompanhamento periódico.",
  },
  {
    codigo: "ST-02",
    nome: "Serra Azul",
    mineral: "Lítio",
    avaliacoes: 7,
    operacoes: 2,
    explorado: 42,
    situacao: "Baixa atividade",
    status: "status-bom",
    data: "28/09/2026",
    responsavel: "Ana Martins",
    area: "1,45 km²",
    nota: "Atividade reduzida; novos dados são necessários para atualizar o parecer.",
  },
  {
    codigo: "ST-03",
    nome: "Vale Central",
    mineral: "Nióbio",
    avaliacoes: 8,
    operacoes: 1,
    explorado: 55,
    situacao: "Atenção moderada",
    status: "status-moderado",
    data: "01/10/2026",
    responsavel: "Samuel Oliveira",
    area: "1,80 km²",
    nota: "Requer avaliação complementar antes de ampliar as operações.",
  },
  {
    codigo: "ST-04",
    nome: "Campo Sul",
    mineral: "Grafita",
    avaliacoes: 5,
    operacoes: 1,
    explorado: 32,
    situacao: "Favorável",
    status: "status-bom",
    data: "22/09/2026",
    responsavel: "Carlos Souza",
    area: "1,25 km²",
    nota: "Indicadores técnicos favoráveis; seguir protocolo técnico.",
  },
  {
    codigo: "ST-05",
    nome: "Serra Norte",
    mineral: "Terras raras",
    avaliacoes: 6,
    operacoes: 2,
    explorado: 76,
    situacao: "Atenção elevada",
    status: "status-ruim",
    data: "30/09/2026",
    responsavel: "Fernanda Lima",
    area: "2,60 km²",
    nota: "Há fatores que exigem investigação detalhada. Não interpretar como autorização de extração.",
  },
  {
    codigo: "ST-06",
    nome: "Campo Leste",
    mineral: "Cobre",
    avaliacoes: 3,
    operacoes: 0,
    explorado: 12,
    situacao: "Em análise",
    status: "status-analise",
    data: "26/09/2026",
    responsavel: "Ana Martins",
    area: "0,95 km²",
    nota: "Dados insuficientes para classificar a condição do setor.",
  },
  {
    codigo: "ST-07",
    nome: "Morro Verde",
    mineral: "Lítio",
    avaliacoes: 4,
    operacoes: 1,
    explorado: 28,
    situacao: "Em análise",
    status: "status-analise",
    data: "19/09/2026",
    responsavel: "Carlos Souza",
    area: "0,88 km²",
    nota: "Manter coleta e revisão de dados.",
  },
];
function renderizarSetores() {
  const busca = (
    document.getElementById("buscaSetor")?.value || ""
  ).toLowerCase();
  const situacao = document.getElementById("filtroSituacao")?.value || "";
  const lista = setoresDados.filter(
    (s) =>
      (s.codigo + " " + s.nome + " " + s.mineral)
        .toLowerCase()
        .includes(busca) &&
      (!situacao || s.situacao === situacao),
  );
  document.getElementById("contadorSetores").textContent =
    `${lista.length} REGISTRO(S) EXIBIDO(S)`;
  document.getElementById("tabelaSetores").innerHTML =
    lista
      .map(
        (s) =>
          `<tr><td><span class="setor-code">${s.codigo}</span><br>${s.nome}</td><td>${s.mineral}</td><td>${s.avaliacoes}</td><td>${s.operacoes}</td><td>${s.explorado}%<div class="setor-progresso"><span style="width:${s.explorado}%"></span></div></td><td><span class="setor-status ${s.status}">${s.situacao}</span></td><td>${s.data}</td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="7">Nenhum setor corresponde aos filtros.</td></tr>';
}
function detalheSetor(codigo) {
  const s = setoresDados.find((x) => x.codigo === codigo);
  if (!s) return;
  abrirModal(
    `${s.codigo} — ${s.nome}`,
    `<div class="geo-info-grid">
    <div><small>Situação técnica</small><strong>${s.situacao}</strong><span>Classificação técnica</span></div>
    <div><small>Área total</small><strong>${s.area}</strong><span>Área cadastrada</span></div>
    <div><small>Avaliações</small><strong>${s.avaliacoes}</strong><span>Registros de avaliação</span></div>
    <div><small>Operações</small><strong>${s.operacoes}</strong><span>Registros operacionais</span></div>
    <div><small>Área explorada</small><strong>${s.explorado}%</strong><span>Percentual registrado</span></div>
    <div><small>Última avaliação</small><strong>${s.data}</strong><span>Responsável: ${s.responsavel}</span></div></div>
    <div class="geo-notice"><strong>Observação técnica</strong>
    <br>${s.nota}<br>
    <br>Esta informação é fictícia para fins acadêmicos e não substitui laudo geológico, licenciamento ou análise ambiental.</div>`,
  );
}
let escalaMapa = 1;
function zoomMapa(delta) {
  escalaMapa = Math.max(1, Math.min(2.2, escalaMapa + delta));
  const mapa = document.getElementById("mapaSetoresViewport");
  if (mapa) mapa.style.transform = `scale(${escalaMapa})`;
}
function resetZoomMapa() {
  escalaMapa = 1;
  const mapa = document.getElementById("mapaSetoresViewport");
  if (mapa) mapa.style.transform = "scale(1)";
}
document
  .getElementById("buscaSetor")
  .addEventListener("input", renderizarSetores);
document
  .getElementById("filtroSituacao")
  .addEventListener("change", renderizarSetores);
renderizarSetores();
