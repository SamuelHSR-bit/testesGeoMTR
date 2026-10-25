(() => {
  const overlay = document.getElementById("legalOverlay");
  if (!overlay) return;

  const title = document.getElementById("legalTitle");
  const content = document.getElementById("legalContent");
  const closeTop = document.getElementById("legalClose");
  const closeBottom = document.getElementById("legalCloseBottom");
  let previousFocus = null;

  const documents = {
    privacy: {
      title: "Política de Privacidade",
      html: `
        <p><strong>1. Sobre este projeto</strong><br>O GeoMTR é um protótipo acadêmico desenvolvido para demonstrar a gestão e o acompanhamento de áreas de mineração. Esta versão não possui banco de dados integrado nem representa um serviço comercial em produção.</p>
        <p><strong>2. Dados apresentados</strong><br>Os nomes, contatos, matrículas, indicadores, setores, avaliações e demais registros exibidos podem ser fictícios ou demonstrativos. Não use informações pessoais reais neste protótipo.</p>
        <p><strong>3. Armazenamento</strong><br>As alterações feitas na interface podem não ser salvas após atualizar ou fechar a página. Esta versão não implementa um serviço próprio de autenticação, armazenamento permanente ou tratamento de dados no servidor.</p>
        <p><strong>4. Compartilhamento e serviços externos</strong><br>O carregamento de bibliotecas, fontes ou recursos externos (quando utilizados) pode envolver conexões com os respectivos provedores. Consulte as políticas desses serviços para saber como eles tratam dados técnicos de conexão.</p>
        <p><strong>5. Segurança e uso responsável</strong><br>Como se trata de um protótipo, ele não deve ser usado para armazenar documentos, dados sensíveis ou informações operacionais confidenciais.</p>
        <p><strong>6. Atualizações</strong><br>Esta política deverá ser revisada caso o GeoMTR passe a coletar ou armazenar dados reais. A versão atual tem finalidade demonstrativa e acadêmica.</p>
      `
    },
    terms: {
      title: "Termos de Uso",
      html: `
        <p><strong>1. Finalidade</strong><br>O GeoMTR é um protótipo acadêmico para demonstração de conceitos de gestão, monitoramento e registro de setores de mineração.</p>
        <p><strong>2. Dados ilustrativos</strong><br>Indicadores, mapas esquemáticos, avaliações, operações, contatos e perfis podem ser fictícios. Não devem ser interpretados como dados geológicos, ambientais ou operacionais reais.</p>
        <p><strong>3. Sem recomendação técnica</strong><br>As classificações de aptidão e situação dos setores servem apenas para demonstrar a interface. Não substituem estudos, licenças, laudos ou avaliações realizadas por profissionais habilitados.</p>
        <p><strong>4. Limitações do protótipo</strong><br>Algumas funcionalidades podem ser simuladas e as alterações podem não persistir após recarregar a página. Não há garantia de disponibilidade, precisão ou adequação para uso profissional.</p>
        <p><strong>5. Uso permitido</strong><br>Utilize o sistema para estudo, apresentação e testes. Não insira informações confidenciais, documentos pessoais reais ou dados que não tenha autorização para utilizar.</p>
        <p><strong>6. Evolução do projeto</strong><br>Se o sistema for colocado em produção, os termos deverão ser revisados para refletir os recursos reais, as responsabilidades dos usuários, a segurança e a legislação aplicável.</p>
      `
    }
  };

  function openLegal(type) {
    const doc = documents[type];
    if (!doc) return;
    previousFocus = document.activeElement;
    title.textContent = doc.title;
    content.innerHTML = doc.html;
    overlay.hidden = false;
    document.body.classList.add("legal-modal-open");
    closeTop.focus();
  }

  function closeLegal() {
    overlay.hidden = true;
    document.body.classList.remove("legal-modal-open");
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-legal]");
    if (trigger) {
      event.preventDefault();
      openLegal(trigger.dataset.legal);
      return;
    }
    if (event.target === overlay) closeLegal();
  });

  closeTop?.addEventListener("click", closeLegal);
  closeBottom?.addEventListener("click", closeLegal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) closeLegal();
  });
})();