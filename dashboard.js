function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const conteudo = document.querySelector(".conteudo");
  const overlay = document.getElementById("sidebarOverlay");
  const botao = document.querySelector(".menu-btn");

  if (!sidebar) return;

  const aberta = sidebar.classList.toggle("aberta");
  const mobile = window.matchMedia("(max-width: 760px)").matches;

  if (conteudo) {
    conteudo.classList.toggle("sidebar-aberta", aberta && !mobile);
  }
  if (overlay) {
    overlay.classList.toggle("aberto", aberta && mobile);
  }
  if (botao) {
    botao.setAttribute("aria-expanded", String(aberta));
    botao.setAttribute("aria-label", aberta ? "Fechar menu" : "Abrir menu");
  }
}

function togglePerfil() {
  const menu = document.getElementById("perfilMenu");
  if (menu) menu.classList.toggle("aberto");
}

document.addEventListener("click", function (event) {
  const menu = document.getElementById("perfilMenu");
  const botao = document.querySelector(".perfil-btn");

  if (
    menu &&
    botao &&
    !menu.contains(event.target) &&
    !botao.contains(event.target)
  ) {
    menu.classList.remove("aberto");
  }
});

function atualizarData() {
  const elemento = document.getElementById("dataAtual");
  if (!elemento) return;

  const agora = new Date();
  elemento.textContent = agora.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

atualizarData();

function abrirModal(titulo, texto) {
  const modal = document.getElementById("modalOverlay");
  const t = document.getElementById("modalTitulo");
  const c = document.getElementById("modalConteudo");

  if (t) t.textContent = titulo;
  if (c) c.innerHTML = /<\/?[a-z][\s\S]*>/i.test(texto) ? texto : `<p>${texto}</p>`;
  if (modal) modal.classList.add("aberto");
}

function fecharModal() {
  const modal = document.getElementById("modalOverlay");
  if (modal) modal.classList.remove("aberto");
}

function fecharModalFundo(event) {
  if (event.target.id === "modalOverlay") {
    fecharModal();
  }
}

function abrirSetor(codigo, nome, status, percentual, area, responsavel) {
  const modal = document.getElementById("modalOverlay");
  const t = document.getElementById("modalTitulo");
  const c = document.getElementById("modalConteudo");

  if (t) t.textContent = `${codigo} — ${nome}`;
  if (c) {
    c.innerHTML = `
        <div class="detalhe-setor">
            <div><small>Status</small><strong>${status}</strong></div>
            <div><small>Explorado</small><strong>${percentual}</strong></div>
            <div><small>Área total</small><strong>${area}</strong></div>
            <div><small>Último responsável</small><strong>${responsavel}</strong></div>
        </div>
        <br>
        <p>Neste espaço futuramente aparecerão o histórico completo, avaliações, operações realizadas, minerais de interesse e documentos associados ao setor.</p>
    `;
  }
  if (modal) modal.classList.add("aberto");
}

function expandirMapa() {
  const mapa = document.getElementById("mapaPainel");
  if (mapa) mapa.classList.toggle("expandido");
}

function novaAvaliacao() {
  const modal = document.getElementById("modalOverlay");
  const t = document.getElementById("modalTitulo");
  const c = document.getElementById("modalConteudo");

  if (t) t.textContent = "Nova Avaliação Técnica";
  if (c) {
    c.innerHTML = `
        <p>Formulário utilizado pelo geólogo para registrar uma nova avaliação de campo.</p>
        <br>
        <div class="detalhe-setor">
            <div><small>Etapa 1</small><strong>Selecionar área</strong></div>
            <div><small>Etapa 2</small><strong>Selecionar setor</strong></div>
            <div><small>Etapa 3</small><strong>Registrar dados</strong></div>
            <div><small>Etapa 4</small><strong>Salvar avaliação</strong></div>
        </div>
    `;
  }
  if (modal) modal.classList.add("aberto");
}

function abrirSuporte() {
  const conteudo = `
    <div class="geo-contact-card">
      <div class="geo-contact-icon">☎</div>
      <div><small>ADMINISTRAÇÃO / SUPORTE</small><h3>Central de atendimento</h3><p>Entre em contato com a equipe responsável pelo sistema.</p></div>
    </div>
    <div class="geo-info-grid">
      <div><small>Ramal interno</small><strong>204</strong><span>Segunda a sexta • 08h–17h</span></div>
      <div><small>E-mail institucional</small><strong>suporte@geomtr.local</strong><span>Retorno em até 1 dia útil (demonstração)</span></div>
      <div><small>Administrador</small><strong>Equipe de Sistemas</strong><span>Suporte a acessos e cadastros</span></div>
    </div>
    <p class="geo-notice">Protótipo acadêmico: ramal e e-mail são dados demonstrativos, não canais reais de atendimento.</p>`;
  abrirModal("Contatar administrador", conteudo);
}

function abrirPerfil() {
  const conteudo = `
    <form class="geo-profile-form" id="formPerfil" onsubmit="salvarPerfil(event)">
      <div class="geo-profile-head">
        <label class="geo-photo-upload" for="fotoPerfilInput"><span id="fotoPerfilPreview">SO</span><small>Alterar foto</small></label>
        <input id="fotoPerfilInput" type="file" accept="image/*" onchange="previewFotoPerfil(event)" hidden>
        <div><h3 id="perfilNomeResumo">Samuel Oliveira</h3><p>Geólogo • Matrícula GEO-001</p><span class="geo-status-pill">● Conta ativa</span></div>
      </div>
      <div class="geo-form-grid">
        <label>Nome completo<input id="perfilNome" value="Samuel Oliveira" required maxlength="80"></label>
        <label>Cargo / função<input id="perfilCargo" value="Geólogo" required maxlength="60"></label>
        <label>Idade<input id="perfilIdade" type="number" min="18" max="100" value="19" required></label>
        <label>Documento (demonstração)<input value="Não cadastrado" disabled><small>Documento real não deve ser exposto no protótipo.</small></label>
        <label>Matrícula<input value="GEO-001" disabled></label>
        <label>Admissão<input type="date" value="2025-05-19" disabled></label>
        <label class="geo-field-full">E-mail<input id="perfilEmail" type="email" value="samuel@geomtr.local" required></label>
      </div>
      <div class="geo-profile-foot"><span><strong>Tempo de empresa</strong><br><small id="tempoEmpresa">Calculando…</small></span><button class="botao-principal" type="submit">Salvar alterações</button></div>
      <p class="geo-notice">As alterações ficam apenas nesta sessão/demonstração e não são salvas em banco de dados.</p>
    </form>`;
  abrirModal("Meu perfil", conteudo);
  const admissao = new Date('2025-05-19T12:00:00');
  const hoje = new Date();
  let meses = (hoje.getFullYear()-admissao.getFullYear())*12 + hoje.getMonth()-admissao.getMonth();
  if (hoje.getDate() < admissao.getDate()) meses--;
  const anos = Math.floor(Math.max(0, meses)/12), resto = Math.max(0, meses)%12;
  const tempo = document.getElementById('tempoEmpresa');
  if (tempo) tempo.textContent = `${anos ? anos+' ano(s) e ' : ''}${resto} mês(es) (desde 19/05/2025)`;
}

function previewFotoPerfil(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = () => {
    const preview = document.getElementById('fotoPerfilPreview');
    if (preview) { preview.textContent = ''; preview.style.backgroundImage = `url(${reader.result})`; preview.style.backgroundSize = 'cover'; preview.style.backgroundPosition = 'center'; }
  };
  reader.readAsDataURL(file);
}

function salvarPerfil(event) {
  event.preventDefault();
  const nome = document.getElementById('perfilNome')?.value.trim();
  const cargo = document.getElementById('perfilCargo')?.value.trim();
  if (!nome || !cargo) return;
  document.querySelectorAll('.perfil-cabecalho strong').forEach(el => el.textContent = nome.split(' ')[0]);
  document.querySelectorAll('.perfil-cabecalho span').forEach(el => el.textContent = cargo);
  const resumo = document.getElementById('perfilNomeResumo');
  if (resumo) resumo.textContent = nome;
  const modalConteudo = document.getElementById('modalConteudo');
  if (modalConteudo) modalConteudo.insertAdjacentHTML('beforeend','<p class="geo-success" role="status">✓ Alterações aplicadas nesta demonstração.</p>');
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    fecharModal();
    const menu = document.getElementById("perfilMenu");
    const mapa = document.getElementById("mapaPainel");
    if (menu) menu.classList.remove("aberto");
    if (mapa) mapa.classList.remove("expandido");
  }
});

function sairSistema() {
  window.location.href = "./index.html";
}
