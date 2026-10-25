// A navegação compartilhada (sidebar, perfil e saída) fica em dashboard.js.

function togglePerfil() {
  const menu = document.getElementById("perfilMenu");
  menu.classList.toggle("aberto");
  const botao = document.querySelector(".perfil-btn");
  if (botao)
    botao.setAttribute(
      "aria-expanded",
      menu.classList.contains("aberto") ? "true" : "false",
    );
}

document.addEventListener("click", (event) => {
  const menu = document.getElementById("perfilMenu");
  const botao = document.querySelector(".perfil-btn");
  if (
    menu &&
    botao &&
    !menu.contains(event.target) &&
    !botao.contains(event.target)
  ) {
    menu.classList.remove("aberto");
    botao.setAttribute("aria-expanded", "false");
  }
});

function sairSistema() {
  window.location.href = "./index.html";
}

function abrirSuporte() {
  const conteudo = `
    <div class="geo-contact-card">
      <div class="geo-contact-icon">☎</div>
      <div><small>ADMINISTRAÇÃO / SUPORTE</small><h3>Central de atendimento</h3><p>Entre em contato com a equipe responsável pelo sistema.</p></div>
    </div>
    <div class="geo-info-grid">
      <div><small>Ramal interno</small><strong>204</strong><span>Segunda a sexta • 08h–17h</span></div>
      <div><small>E-mail institucional</small><strong>suporte@geomtr.local</strong><span>Prazo de retorno estimado: até 1 dia útil</span></div>
      <div><small>Administrador</small><strong>Equipe de Sistemas</strong><span>Suporte a acessos e cadastros</span></div>
    </div>
    <p class="geo-notice">Os canais de suporte devem ser confirmados com a administração responsável.</p>`;
  if (typeof abrirModal === "function") abrirModal("Contatar administrador", conteudo);
}

// Página Funcionários — protótipo de interface, sem banco de dados conectado.
// Os dados são mantidos apenas durante esta sessão do navegador.

const funcionariosIniciais = [
  {
    ra: "A0001",
    nome: "Administrador GeoMTR",
    cargo: "Administrador do sistema",
    perfil: "Administrador",
    cadastro: "17/10/2026",
    status: "Ativo",
  },
  {
    ra: "F2456",
    nome: "Samuel Oliveira",
    cargo: "Geólogo",
    perfil: "Funcionário",
    cadastro: "12/09/2026",
    status: "Ativo",
  },
  {
    ra: "F2457",
    nome: "Mariana Costa",
    cargo: "Geóloga de campo",
    perfil: "Funcionário",
    cadastro: "18/09/2026",
    status: "Ativo",
  },
  {
    ra: "A0002",
    nome: "Roberto Almeida",
    cargo: "Coordenador técnico",
    perfil: "Administrador",
    cadastro: "25/09/2026",
    status: "Ativo",
  },
  {
    ra: "F2458",
    nome: "Lucas Ferreira",
    cargo: "Técnico de mineração",
    perfil: "Funcionário",
    cadastro: "03/10/2026",
    status: "Inativo",
  },
];

let funcionarios = funcionariosIniciais.map((item) => ({ ...item }));

const listaFuncionarios = document.getElementById("listaFuncionarios");
const buscaFuncionario = document.getElementById("buscaFuncionario");
const filtroPerfil = document.getElementById("filtroPerfil");
const filtroStatus = document.getElementById("filtroStatus");
const modalFuncionario = document.getElementById("modalFuncionario");
const formFuncionario = document.getElementById("formFuncionario");
const erroCadastro = document.getElementById("erroCadastro");
const previewRA = document.querySelector("#previewRA strong");
const funcToast = document.getElementById("funcToast");

function iniciais(nome) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}

function proximoRA(perfil) {
  const prefixo = perfil === "Administrador" ? "A" : "F";
  const numeros = funcionarios
    .filter((usuario) => usuario.ra.startsWith(prefixo))
    .map((usuario) => Number(usuario.ra.slice(1)))
    .filter(Number.isFinite);

  const proximo = Math.max(0, ...numeros) + 1;
  return prefixo + String(proximo).padStart(4, "0");
}

function escaparHTML(valor) {
  return String(valor).replace(
    /[&<>"']/g,
    (caractere) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[caractere],
  );
}

function atualizarIndicadores() {
  document.getElementById("totalUsuarios").textContent = funcionarios.length;
  document.getElementById("totalAdmins").textContent = funcionarios.filter(
    (u) => u.perfil === "Administrador",
  ).length;
  document.getElementById("totalFuncionarios").textContent =
    funcionarios.filter((u) => u.perfil === "Funcionário").length;
  document.getElementById("totalInativos").textContent = funcionarios.filter(
    (u) => u.status === "Inativo",
  ).length;
}

function renderizarFuncionarios() {
  const termo = buscaFuncionario.value.trim().toLocaleLowerCase("pt-BR");
  const perfil = filtroPerfil.value;
  const status = filtroStatus.value;

  const filtrados = funcionarios.filter((usuario) => {
    const combinaBusca =
      usuario.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
      usuario.ra.toLocaleLowerCase("pt-BR").includes(termo) ||
      usuario.cargo.toLocaleLowerCase("pt-BR").includes(termo);
    return (
      combinaBusca &&
      (perfil === "todos" || usuario.perfil === perfil) &&
      (status === "todos" || usuario.status === status)
    );
  });

  listaFuncionarios.innerHTML = filtrados
    .map((usuario) => {
      const admin = usuario.perfil === "Administrador";
      const podeDesativar = usuario.ra !== "A0001";
      const acaoStatus =
        usuario.status === "Ativo" ? "Desativar conta" : "Reativar conta";
      return `
            <tr>
                <td>
                    <div class="usuario-celula">
                        <span class="usuario-avatar">${escaparHTML(iniciais(usuario.nome))}</span>
                        <span class="usuario-identidade">
                            <strong>${escaparHTML(usuario.nome)}</strong>
                            <small>${escaparHTML(usuario.cargo)}</small>
                        </span>
                    </div>
                </td>
                <td><span class="ra-codigo">${escaparHTML(usuario.ra)}</span></td>
                <td><span class="perfil-tag ${admin ? "admin" : "funcionario"}">${escaparHTML(usuario.perfil)}</span></td>
                <td>${escaparHTML(usuario.cadastro)}</td>
                <td><span class="status-tag ${usuario.status === "Ativo" ? "ativo" : "inativo"}">${escaparHTML(usuario.status)}</span></td>
                <td>
                    <div class="acoes-usuario">
                        <button class="acao-icone" type="button" title="Ver detalhes" aria-label="Ver detalhes de ${escaparHTML(usuario.nome)}" data-acao="detalhes" data-ra="${escaparHTML(usuario.ra)}">⌕</button>
                        ${podeDesativar ? `<button class="acao-icone ${usuario.status === "Ativo" ? "perigo" : ""}" type="button" title="${acaoStatus}" aria-label="${acaoStatus} ${escaparHTML(usuario.nome)}" data-acao="status" data-ra="${escaparHTML(usuario.ra)}">${usuario.status === "Ativo" ? "⊘" : "✓"}</button>` : ""}
                    </div>
                </td>
            </tr>`;
    })
    .join("");

  document.getElementById("estadoVazio").hidden = filtrados.length > 0;
  document.getElementById("contadorResultados").textContent =
    `Exibindo ${filtrados.length} de ${funcionarios.length} usuários`;
  atualizarIndicadores();
}

function abrirModalFuncionario() {
  formFuncionario.reset();
  erroCadastro.textContent = "";
  atualizarPreviewRA();
  modalFuncionario.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("nomeFuncionario").focus();
}

function fecharModalFuncionario() {
  modalFuncionario.hidden = true;
  document.body.style.overflow = "";
}

function atualizarPreviewRA() {
  previewRA.textContent = proximoRA(
    document.getElementById("perfilFuncionario").value,
  );
}

function mostrarToast(mensagem, erro = false) {
  funcToast.textContent = mensagem;
  funcToast.classList.toggle("erro", erro);
  funcToast.classList.add("visivel");
  window.clearTimeout(mostrarToast.timeout);
  mostrarToast.timeout = window.setTimeout(
    () => funcToast.classList.remove("visivel"),
    3200,
  );
}

document
  .getElementById("abrirCadastro")
  .addEventListener("click", abrirModalFuncionario);
document
  .getElementById("fecharCadastro")
  .addEventListener("click", fecharModalFuncionario);
document
  .getElementById("cancelarCadastro")
  .addEventListener("click", fecharModalFuncionario);
document
  .getElementById("perfilFuncionario")
  .addEventListener("change", atualizarPreviewRA);
buscaFuncionario.addEventListener("input", renderizarFuncionarios);
filtroPerfil.addEventListener("change", renderizarFuncionarios);
filtroStatus.addEventListener("change", renderizarFuncionarios);

modalFuncionario.addEventListener("click", (event) => {
  if (event.target === modalFuncionario) fecharModalFuncionario();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalFuncionario.hidden)
    fecharModalFuncionario();
});

formFuncionario.addEventListener("submit", (event) => {
  event.preventDefault();
  erroCadastro.textContent = "";

  const nome = document.getElementById("nomeFuncionario").value.trim();
  const cargo = document.getElementById("cargoFuncionario").value.trim();
  const perfil = document.getElementById("perfilFuncionario").value;
  const senha = document.getElementById("senhaTemporaria").value;

  if (nome.length < 3 || cargo.length < 2) {
    erroCadastro.textContent = "Informe um nome e um cargo válidos.";
    return;
  }
  if (senha.length < 8) {
    erroCadastro.textContent =
      "A senha temporária precisa ter pelo menos 8 caracteres.";
    return;
  }

  const ra = proximoRA(perfil);
  const hoje = new Date().toLocaleDateString("pt-BR");

  // A senha não é armazenada. A autenticação será implementada com o backend.
  funcionarios.push({
    ra,
    nome,
    cargo,
    perfil,
    cadastro: hoje,
    status: "Ativo",
  });

  fecharModalFuncionario();
  renderizarFuncionarios();
  mostrarToast(`Usuário demonstrativo ${ra} criado. Nenhuma senha foi salva.`);
});

listaFuncionarios.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-acao]");
  if (!botao) return;

  const usuario = funcionarios.find((item) => item.ra === botao.dataset.ra);
  if (!usuario) return;

  if (botao.dataset.acao === "detalhes") {
    mostrarToast(
      `${usuario.nome} · ${usuario.ra} · ${usuario.perfil} · ${usuario.status}`,
    );
    return;
  }

  if (botao.dataset.acao === "status") {
    if (usuario.ra === "A0001") {
      mostrarToast(
        "A conta inicial não pode ser desativada nesta demonstração.",
        true,
      );
      return;
    }
    usuario.status = usuario.status === "Ativo" ? "Inativo" : "Ativo";
    renderizarFuncionarios();
    mostrarToast(`Status de ${usuario.ra} alterado para ${usuario.status}.`);
  }
});

renderizarFuncionarios();
