
const http = require("http");
const fs = require("fs");
const db = require("./banco.js");
const path = require("path");

const servidor = http.createServer(function(requisicao, resposta) {
    console.log("Pedidos recebidos", requisicao.method, requisicao.url);

    if (requisicao.url === "/api/pedidos" && requisicao.method === "POST") {
        let corpo = "";

        requisicao.on("data", function(pedaco) {
            corpo = corpo + pedaco;
        });

        requisicao.on("end", function() {
            const dados = JSON.parse(corpo);

            const inserir = db.prepare(`
                INSERT INTO pedidos (nome, telefone, itens, total, pagamento, data)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            inserir.run(
                dados.nome,
                dados.telefone,
                JSON.stringify(dados.itens),
                dados.total,
                dados.pagamento,
                new Date().toISOString()
            );

            resposta.writeHead(200, { "Content-Type": "aplication/json" });
            resposta.end(JSON.stringify({ sucesso: true, mensagem: "Pedido salvo"}));

            return;
        })
    } else {

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
}
});

servidor.listen(3000, function() {
    console.log("Servidor rodando em http://localhost:3000");
});
