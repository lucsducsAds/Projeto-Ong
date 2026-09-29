function inicializarMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");
    const submenuToggle = document.querySelector(".submenu-toggle");
    const submenuItem = document.querySelector(".has-submenu");
    if (!menuToggle || !mainNav) return;
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        if (!isOpen && submenuItem) { submenuItem.classList.remove("is-open"); if (submenuToggle) submenuToggle.setAttribute("aria-expanded", "false"); }
    });
    if (submenuToggle && submenuItem) {
        submenuToggle.addEventListener("click", () => { const isOpen = submenuItem.classList.toggle("is-open"); submenuToggle.setAttribute("aria-expanded", String(isOpen)); });
        submenuToggle.addEventListener("keydown", event => { if (event.key === "Escape") { submenuItem.classList.remove("is-open"); submenuToggle.setAttribute("aria-expanded", "false"); submenuToggle.focus(); } });
    }
    document.addEventListener("click", event => { if (submenuItem && !submenuItem.contains(event.target)) { submenuItem.classList.remove("is-open"); if (submenuToggle) submenuToggle.setAttribute("aria-expanded", "false"); } });
    document.addEventListener("focusin", event => { if (submenuItem && !submenuItem.contains(event.target)) { submenuItem.classList.remove("is-open"); if (submenuToggle) submenuToggle.setAttribute("aria-expanded", "false"); } });
}
IVM = window.IVM || {};
IVM.menu = { inicializar: inicializarMenu };
