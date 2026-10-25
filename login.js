const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value;
  const erro = document.getElementById("erroLogin");

  erro.textContent = "";

  // LOGIN PROVISÓRIO DO ADMINISTRADOR
  if (usuario === "admin" && senha === "1234") {
    window.location.href = "./dashboard_adm.html";
    // LOGIN PROVISÓRIO DO FUNCIONÁRIO
  } else if (usuario === "samuel" && senha === "1234") {
    window.location.href = "./dashboard.html";
  } else {
    erro.textContent = "Usuário ou senha incorretos.";
  }
});
