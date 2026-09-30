import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

export default defineConfig({
    root: "html",
    base: "/Projeto-Ong/",

    plugins: [
        {
            name: "copiar-imagens",
            closeBundle() {
                const origem = path.resolve("imagens");
                const destino = path.resolve("dist/imagens");

                fs.cpSync(origem, destino, { recursive: true });
                console.log("Imagens copiadas para a build.");
            }
        }
    ],

    build: {
        outDir: "../dist",
        emptyOutDir: true,
        minify: "terser",
        rollupOptions: {
            input: "html/index.html"
        }
    }
});