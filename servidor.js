
const http = require("http");
const fs = require("fs");
const path = require("path");

const servidor = http.createServer(function(requisicao, resposta) {
    let caminhoArquivo = "./public" + requisicao.url;

    if (requisicao.url === "/") {
        caminhoArquivo = "./public/index.html";
    }

    const extensao = path.extname(caminhoArquivo);
    let tipoConteudo = "text/html";

    if (extensao === ".css") {
        tipoConteudo = "text/css";
    } else if (extensao === ".js") {
        tipoConteudo = "text/javascript";
    }
    fs.readFile(caminhoArquivo, "utf-8" , function(erro, conteudo) {
        if (erro) {
            resposta.writeHead(404);
            resposta.end("Erro ao carregar a pagina");
            return;
        }
        resposta.writeHead(200, { "Content-Type": tipoConteudo });
        resposta.end(conteudo);
    });
});

servidor.listen(3000, function() {
    console.log("Servidor rodando em http://localhost:3000");
});
