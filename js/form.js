const CHAVE_FORMULARIO = "institutoViverMelhorCadastro";

function aplicarMascaraCPF(valor) {
    return valor.replace(/\D/g, "").slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function aplicarMascaraTelefone(valor) {
    const digits = valor.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits.replace(/(\d{0,2})/, "($1");
    if (digits.length <= 7) return digits.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function aplicarMascaraCEP(valor) {
    return valor.replace(/\D/g, "").slice(0, 8)
        .replace(/(\d{5})(\d{0,3})/, "$1-$2");
}

function obterDadosFormulario(form) {
    return {
        nome: form.nome.value,
        cpf: form.cpf.value,
        telefone: form.telefone.value,
        email: form.email.value,
        cep: form.cep.value,
        interesse: form.interesse.value,
        mensagem: form.mensagem.value,
        consentimento: form.consentimento.checked
    };
}

function preencherFormulario(form, dados) {
    if (!dados) return;

    form.nome.value = dados.nome || "";
    form.cpf.value = dados.cpf || "";
    form.telefone.value = dados.telefone || "";
    form.email.value = dados.email || "";
    form.cep.value = dados.cep || "";
    form.interesse.value = dados.interesse || "";
    form.mensagem.value = dados.mensagem || "";
    form.consentimento.checked = Boolean(dados.consentimento);
}

function salvarRascunho(form) {
    IVM.storage.salvar(CHAVE_FORMULARIO, obterDadosFormulario(form));
}

function carregarRascunho(form) {
    const dados = IVM.storage.carregar(CHAVE_FORMULARIO);
    if (dados) preencherFormulario(form, dados);
}

/* ==============================
   VALIDAÇÃO VISUAL DO FORMULÁRIO
   ============================== */

function obterMensagemErro(campo) {
    if (campo.validity.valueMissing) {
        return "Este campo é obrigatório.";
    }

    if (campo.validity.typeMismatch) {
        return "Digite um e-mail válido.";
    }

    if (campo.validity.tooShort) {
        return `Digite pelo menos ${campo.minLength} caracteres.`;
    }

    if (campo.validity.patternMismatch) {
        if (campo.id === "cpf") {
            return "Digite o CPF no formato 000.000.000-00.";
        }

        if (campo.id === "cep") {
            return "Digite o CEP no formato 00000-000.";
        }

        return "Verifique o formato informado.";
    }

    return "";
}

function atualizarEstadoCampo(campo, mostrarMensagem = true) {
    if (!campo || campo.type === "checkbox") return true;

    const mensagem = obterMensagemErro(campo);
    const grupo = campo.closest(".field");
    if (!grupo) return campo.checkValidity();

    let mensagemElemento = grupo.querySelector(".field-message");

    if (!mensagemElemento) {
        mensagemElemento = document.createElement("small");
        mensagemElemento.className = "field-message";
        mensagemElemento.setAttribute("aria-live", "polite");
        grupo.appendChild(mensagemElemento);
    }

    const preenchido = campo.value.trim() !== "";
    const valido = campo.checkValidity();

    campo.classList.remove("campo-erro", "campo-sucesso");
    mensagemElemento.classList.remove("mensagem-erro", "mensagem-sucesso");

    if (!valido && (mostrarMensagem || preenchido)) {
        campo.classList.add("campo-erro");
        mensagemElemento.classList.add("mensagem-erro");
        mensagemElemento.textContent = mensagem;
        campo.setAttribute("aria-invalid", "true");
        mensagemElemento.hidden = false;
        return false;
    }

    if (valido && preenchido) {
        campo.classList.add("campo-sucesso");
        mensagemElemento.classList.add("mensagem-sucesso");
        mensagemElemento.textContent = "Campo preenchido corretamente.";
        campo.setAttribute("aria-invalid", "false");
        mensagemElemento.hidden = false;
        return true;
    }

    mensagemElemento.textContent = "";
    mensagemElemento.hidden = true;
    campo.removeAttribute("aria-invalid");
    return valido;
}

function validarFormularioVisual(form) {
    const campos = form.querySelectorAll("input, select, textarea");
    let formularioValido = true;

    campos.forEach(campo => {
        if (campo.type === "checkbox") return;

        const valido = atualizarEstadoCampo(campo, true);
        if (!valido) formularioValido = false;
    });

    const consentimento = form.querySelector("#consentimento");
    if (consentimento && !consentimento.checked) {
        consentimento.classList.add("campo-erro");
        formularioValido = false;
    } else if (consentimento) {
        consentimento.classList.remove("campo-erro");
    }

    return formularioValido && form.checkValidity();
}

function prepararFormulario() {
    const form = document.getElementById("cadastroForm");
    if (!form) return;

    const cpf = document.getElementById("cpf");
    const telefone = document.getElementById("telefone");
    const cep = document.getElementById("cep");
    const status = document.getElementById("formStatus");
    const toast = document.getElementById("formToast");

    carregarRascunho(form);

    const campos = form.querySelectorAll("input, select, textarea");

    cpf.addEventListener("input", event => {
        event.target.value = aplicarMascaraCPF(event.target.value);
        atualizarEstadoCampo(event.target, false);
        salvarRascunho(form);
    });

    telefone.addEventListener("input", event => {
        event.target.value = aplicarMascaraTelefone(event.target.value);
        atualizarEstadoCampo(event.target, false);
        salvarRascunho(form);
    });

    cep.addEventListener("input", event => {
        event.target.value = aplicarMascaraCEP(event.target.value);
        atualizarEstadoCampo(event.target, false);
        salvarRascunho(form);
    });

    campos.forEach(campo => {
        campo.addEventListener("input", () => {
            atualizarEstadoCampo(campo, false);
            salvarRascunho(form);
        });

        campo.addEventListener("blur", () => {
            atualizarEstadoCampo(campo, true);
        });
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        const valido = validarFormularioVisual(form);

        if (!valido) {
            status.textContent = "Verifique os campos destacados antes de enviar.";
            status.classList.add("status-erro");
            form.reportValidity();
            return;
        }

        const dados = obterDadosFormulario(form);
        salvarDados(CHAVE_FORMULARIO, dados);

        status.textContent =
            "Cadastro validado com sucesso. Os dados foram mantidos neste navegador.";
        status.classList.remove("status-erro");
        status.classList.add("status-sucesso");

        if (toast) {
            toast.classList.add("is-visible");
            clearTimeout(window.toastTimer);
            window.toastTimer = setTimeout(() => {
                toast.classList.remove("is-visible");
            }, 4000);
        }
    });

    form.addEventListener("reset", () => {
        status.textContent = "";
        status.classList.remove("status-erro", "status-sucesso");

        campos.forEach(campo => {
            campo.classList.remove("campo-erro", "campo-sucesso");
            campo.removeAttribute("aria-invalid");

            const grupo = campo.closest(".field");
            const mensagem = grupo?.querySelector(".field-message");

            if (mensagem) {
                mensagem.textContent = "";
                mensagem.hidden = true;
            }
        });

        if (toast) toast.classList.remove("is-visible");
        clearTimeout(window.toastTimer);

        setTimeout(() => {
            IVM.storage.remover(CHAVE_FORMULARIO);
        }, 0);
    });
}


IVM = window.IVM || {};
IVM.form = { preparar: prepararFormulario };
