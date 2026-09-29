window.IVM = window.IVM || {};
IVM.storage = {
  salvar(chave, dados) { localStorage.setItem(chave, JSON.stringify(dados)); },
  carregar(chave) { const s = localStorage.getItem(chave); if (!s) return null; try { return JSON.parse(s); } catch { localStorage.removeItem(chave); return null; } },
  remover(chave) { localStorage.removeItem(chave); }
};
