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