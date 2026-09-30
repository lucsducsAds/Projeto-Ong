import fs from "fs";
import path from "path";
import { minify } from "terser";

const arquivos = [
    "storage.js",
    "projetos.js",
    "form.js",
    "menu.js",
    "app.js"
];

const pastaOrigem = path.resolve("js");
const pastaDestino = path.resolve("dist/js");

fs.mkdirSync(pastaDestino, { recursive: true });

for (const arquivo of arquivos) {
    const origem = path.join(pastaOrigem, arquivo);
    const destino = path.join(pastaDestino, arquivo);

    const codigo = fs.readFileSync(origem, "utf8");
    const resultado = await minify(codigo);

    if (!resultado.code) {
        throw new Error(`Não foi possível minificar ${arquivo}`);
    }

    fs.writeFileSync(destino, resultado.code, "utf8");

    console.log(`Minificado: ${arquivo}`);
}

const indexPath = path.resolve("dist/index.html");

let indexHtml = fs.readFileSync(indexPath, "utf8");

indexHtml = indexHtml.replaceAll("../js/", "js/");

fs.writeFileSync(indexPath, indexHtml, "utf8");

const projetosPath = path.resolve("dist/js/projetos.js");

let projetosJs = fs.readFileSync(projetosPath, "utf8");

projetosJs = projetosJs.replaceAll("../imagens/", "imagens/");

fs.writeFileSync(projetosPath, projetosJs, "utf8");

console.log("Caminhos dos scripts e das imagens ajustados para a produção.");