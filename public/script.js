const carrinho = [];

const titulo = document.querySelector("h1");
console.log(titulo)
const cardapioSecao = document.querySelector("#secao-cardapio");
const cliente = document.querySelector("#secao-cliente");
const btnVerCardapio = document.querySelector("#btn-ver-cardapio");
const botoes = document.querySelectorAll(".add-carrinho");
console.log(botoes);

botoes.forEach(function(botao) { 
    botao.addEventListener("click", function () {
        const item = botao.closest("li");
        const nome = item.dataset.nome;
        const preco = parseFloat(item.dataset.preco);
        
        const novoItem = { nome: nome, preco: preco };
        carrinho.push(novoItem);
        atualizarCarrinho();

        console.log(carrinho);
    });
});

function atualizarCarrinho() {
    const lista = document.querySelector("#lista-carrinho");
    lista.innerHTML = "";

    let total = 0;

    carrinho.forEach(function(item, indice) {
        const li = document.createElement("li");
        li.textContent = item.nome + " - R$ " + item.preco.toFixed(2);
        
        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";
        botaoRemover.addEventListener("click", function() {
            carrinho.splice(indice, 1);
            atualizarCarrinho();
        });
        
        li.appendChild(botaoRemover);
        lista.appendChild(li);
        total = total + item.preco;
    });

    document.querySelector("#total-carrinho").textContent = total.toFixed(2);
}

cardapioSecao.style.display = "none";

btnVerCardapio.addEventListener("click", function() {
    const nome = document.querySelector("#nome").value;
    
    const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;

    if ( nome === "" || !regexNome.test(nome)) {
        alert("Por favor, digite um nome valido (somente letras).");
        return;
    }

    const telefone = document.querySelector("#telefone").value;

    const regexTelefone = /^[0-9]{10,11}$/;

    if (telefone === "" || !regexTelefone.test(telefone)) {
        alert("Por favor, digite um telefone valido ");
        return;
    }

    const cpf = document.querySelector("#cpf").value;

    const regexCpf = /^[0-9]{11}$/;

    if (cpf === "" || !regexCpf.test(cpf)) {
        alert("Por favor, digite um cpf valido");
        return;
    }

    cliente.style.display = "none";
    cardapioSecao.style.display = "block"

})

const pagamentoSecao = document.querySelector("#secao-pagamento");
const btnFecharPedido = document.querySelector("#btn-fechar-pedido");
const btnConfirmarPagamento = document.querySelector("#btn-confirma-pagamento");

pagamentoSecao.style.display = "none";

btnFecharPedido.addEventListener("click", function() {
    if(carrinho.length === 0) {
        alert("seu carrinho esya vazio");
        return;
    }

    document.querySelector("#total-pagamento").textContent = document.querySelector("#total-carrinho").textContent;

    cardapioSecao.style.display = "none";
    pagamentoSecao.style.display = "block";
});

btnConfirmarPagamento.addEventListener("click", function() {
    const formaPagamento = document.querySelector('input[name="pagamento"]:checked').value;
    const dadosPedido = {
        nome: nome.value,
        telefone: telefone.value,
        itens: carrinho,
        total: parseFloat(document.querySelector("#total-pagamento").textContent),
        pagamento: formaPagamento
    };

    fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosPedido)
    })
    .then(function(resposta) {
        return resposta.json();
    })
    .then(function(dados) {
        console.log("Resposta do servidor:", dados);
    });

    alert("Pedido confirmado! Obrigado");

    let mensagem = "Novo Pedido!\n\n";
    mensagem = mensagem + "Nome: " + nome.value + "\n";
    mensagem = mensagem + "Telefone: " + telefone.value + "\n\n";
    mensagem = mensagem + "Itens: \n";

    carrinho.forEach(function(item) {
        mensagem = mensagem + "- " + item.nome + " (R$ " + item.preco.toFixed(2) + ")\n";
    });

    mensagem = mensagem + "\nTotal: R$ " + document.querySelector("#total-pagamento").textContent + "\n";

   
    mensagem = mensagem + "Pagamento: " + formaPagamento;

    if (formaPagamento === "dinheiro") {
        const troco = document.querySelector("#troco").value;
        mensagem = mensagem + " (troco para: R$ " + troco + ")";
    }

    const numeroEmpresa = "5519995323159";
    const mensagemCodificada = encodeURIComponent(mensagem);
    const linkWhatsapp = "https://wa.me/" + numeroEmpresa + "?text=" + mensagemCodificada;

    window.open(linkWhatsapp, "_blank");
    carrinho.length = 0;
    atualizarCarrinho();

    pagamentoSecao.style.display = "none";
    cardapioSecao.style.display = "block";
})
const radiosPagamento = document.querySelectorAll('input[name="pagamento"]');
const campoTroco = document.querySelector('#campo-troco');

radiosPagamento.forEach(function(radio) {
    radio.addEventListener("change", function() {
        if (radio.value === "dinheiro" && radio.checked) {
            campoTroco.style.display = "block";
        } else {
            campoTroco.style.display = "none";
        }
    });
});


