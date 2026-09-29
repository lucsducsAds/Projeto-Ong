window.IVM = window.IVM || {};
const rotas = { inicio: IVM.projetos.inicio, projetos: IVM.projetos.projetos, cadastro: IVM.projetos.cadastro };
function renderizarPagina(rota) {
  const app = document.getElementById("app");
  app.innerHTML = (rotas[rota] || rotas.inicio)();
  document.title = rota === "projetos" ? "Instituto Viver Melhor | Projetos" : rota === "cadastro" ? "Instituto Viver Melhor | Cadastro" : "Instituto Viver Melhor | Início";
  if (rota === "cadastro") IVM.form.preparar();
  if (rota === "projetos") IVM.projetos.grafico();
  app.focus();
}
function obterRota() { const rota = window.location.hash.replace("#", ""); return rotas[rota] ? rota : "inicio"; }
function atualizarNavegacao() {
  const rota = obterRota();
  document.querySelectorAll("[data-route]").forEach(link => {
    const ativo = link.dataset.route === rota;
    link.classList.toggle("active", ativo);
    if (ativo) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
}
function navegar(rota) { if (!rotas[rota]) return; if (window.location.hash !== `#${rota}`) window.location.hash = rota; else { renderizarPagina(rota); atualizarNavegacao(); } }
document.addEventListener("click", event => { const link = event.target.closest("[data-route]"); if (!link) return; event.preventDefault(); navegar(link.dataset.route); if (window.innerWidth <= 800) { const nav=document.querySelector('.main-nav'), toggle=document.querySelector('.menu-toggle'); if(nav){nav.classList.remove('is-open');} if(toggle) toggle.setAttribute('aria-expanded','false'); } });
window.addEventListener("hashchange", () => { renderizarPagina(obterRota()); atualizarNavegacao(); });
document.addEventListener("DOMContentLoaded", () => { IVM.menu.inicializar(); renderizarPagina(obterRota()); atualizarNavegacao(); });
