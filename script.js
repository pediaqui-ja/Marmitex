// Array para armazenar itens do carrinho
let cart = [];

// Função para adicionar itens ao carrinho
function addToCart(productName, size, price, guarnicoes, carne, quantity) {
    const item = {
        name: productName,
        size: size,
        price: price,
        guarnicoes: guarnicoes,
        carne: carne,
        quantity: quantity // Armazena a quantidade
    };
    cart.push(item);
    updateCart();
}

// Função para atualizar o carrinho
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Limpa o carrinho antes de adicionar os itens novamente

    let total = 0;
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${item.name} (${item.size}) - R$${item.price},00 x ${item.quantity}<br>Guarnições: ${item.guarnicoes.join(', ')}<br>Carne: ${item.carne} <button onclick="removeFromCart(${index})">Remover</button>`;
        cartItemsContainer.appendChild(listItem);
        total += item.price * item.quantity; // Multiplica pelo número de itens
    });

    // Atualiza o preço total no carrinho
    document.getElementById('total-price').textContent = `R$ ${total.toFixed(2)}`;
}

// Função para remover item do carrinho
function removeFromCart(index) {
    cart.splice(index, 1); // Remove o item do carrinho
    updateCart(); // Atualiza o carrinho
}

// Função para enviar o pedido pelo WhatsApp
function sendOrder() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const bairro = document.getElementById('bairro').value;
    const numero = document.getElementById('numero').value;
    const reference = document.getElementById('reference').value;
    const phone = document.getElementById('phone').value;
    const payment = document.getElementById('payment').value;
    const troco = document.getElementById('troco').value;
    const valorTroco = document.getElementById('valor-troco').value;

    if (name === '' || address === '' || bairro === '' || numero === '' || phone === '') {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    let orderMessage = `pedido de marmitex\n\n*Nome:* ${name}\n*Endereço:* ${address}, ${numero}, ${bairro} - ${reference}\n*Telefone:* ${phone}\n\n*Itens:*\n`;
    cart.forEach(item => {
        orderMessage += `- ${item.name} (${item.size}) - R$${item.price},00 x ${item.quantity}\nGuarnições: ${item.guarnicoes.join(', ')}\nCarne: ${item.carne}\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    orderMessage += `*Total:* R$${total}\n\n`;

    // Informações de pagamento
    orderMessage += `*Forma de pagamento:* ${payment}\n`;
    if (payment === 'dinheiro' && troco === 'sim') {
        orderMessage += `*Troco para:* R$${valorTroco}\n`;
    }

    // Envia o pedido pelo WhatsApp
    const whatsappNumber = '27997294468';
    const whatsappLink = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
    window.open(whatsappLink, '_blank');
}

// Lógica para exibir ou ocultar o campo de troco
document.getElementById('payment').addEventListener('change', function () {
    const trocoContainer = document.getElementById('troco-info');
    trocoContainer.style.display = this.value === 'dinheiro' ? 'block' : 'none';
});

// Adicionar evento aos botões de adicionar ao carrinho
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const isMarmitex = this.getAttribute('data-name') === 'Marmitex';
        
        if (isMarmitex) {
            const tamanhoMarmitex = document.getElementById('tamanho-marmitex').value;
            const quantidadeMarmitex = parseInt(document.getElementById('quantidade-marmitex').value);
            const guarnicoes = Array.from(document.getElementById('guarnicoes-marmitex').selectedOptions).map(option => option.value);
            const carne = document.getElementById('carne-marmitex').value;
            const price = parseFloat(document.querySelector(`#tamanho-marmitex option[value="${tamanhoMarmitex}"]`).getAttribute('data-price'));

            addToCart('Marmitex', tamanhoMarmitex, price, guarnicoes, carne, quantidadeMarmitex);
        } else {
            const bebida = document.getElementById('bebidas').value;
            const price = parseFloat(document.querySelector(`#bebidas option[value="${bebida}"]`).getAttribute('data-price'));

            addToCart(bebida, '', price, [], '', 1); // Para bebida, não há guarnições nem carne
        }
    });
});

// Adicionar evento para o botão de finalizar compra
document.getElementById('checkout-button').addEventListener('click', function () {
    document.getElementById('payment-info').style.display = 'block'; // Exibe o formulário de pagamento
});

// Adicionar evento para o botão de enviar pedido
document.getElementById('send-whatsapp').addEventListener('click', function () {
    sendOrder();
});