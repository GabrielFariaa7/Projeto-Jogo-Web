const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//Carregando as imagens do caramelo e do fundo
const carameloImg = new Image();
carameloImg.src = 'caramelo_andando_sprite.png';

const fundoImg = new Image();
fundoImg.src = 'fundo.png';

//Configurando o fundo de acordo com a proporção da imagem
const fundo = {
    x: 0,
    largura: 900,
    altura: canvas.height,
    velocidade: 4
};

//Configurando a altura do chão
const chaoY = 295;

//Configurando os quadros da animação do caramelo
const sprite = {
    totalQuadros: 8,      
    quadroAtual: 0,       
    larguraQuadro: 400,    
    alturaQuadro: 245,     
    contadorFrames: 0,
    velocidadeAnimacao: 6
};

//Criando o objeto do player (caramelo)
const caramelo = {
    x: 60,
    y: chaoY - 60,
    largura: 70,
    altura: 60,
    velocidadeY: 0,
    gravidade: 0.8,
    forcaPulo: -15,
    noChao: true
};

//Função que faz o cachorro pular
function pular() {

    //SE o caramelo estiver no chão
    if (caramelo.noChao) {

        //Então eu faço ele subir de acordo com a força do pulo comfigurada
        caramelo.velocidadeY = caramelo.forcaPulo;

        //E informo que ele não está mais no chão
        caramelo.noChao = false;
    }
}

//Configurando os botões para pular
document.addEventListener('keydown', (evento) => {
  
    //SE apertar ESPAÇO ou SETA para cima
    if (evento.code === 'Space' || evento.code === 'ArrowUp') {

        //Chamando a função de pular
        pular();
    }
});

canvas.addEventListener('touchstart', pular);
canvas.addEventListener('mousedown', pular);

//Função que atualiza a física e a movimentação do fundo
function atualizar() {

    //Fazendo o fundo ir para a esquerda (para dar sensação de movimento)
    fundo.x -= fundo.velocidade;

    //Reiniciando o loop quando a imagem acabar
    if (fundo.x <= -fundo.largura) {
        fundo.x = 0;
    }

    //Aplicando a gravidade e o pulo do caramelo
    caramelo.velocidadeY += caramelo.gravidade;
    caramelo.y += caramelo.velocidadeY;

    //Fazendo a colisão com o chão
    if (caramelo.y >= chaoY - caramelo.altura) {
        caramelo.y = chaoY - caramelo.altura;
        caramelo.velocidadeY = 0;
        caramelo.noChao = true;
    }

    //Atualizando os quadros da animação das patas
    if (caramelo.noChao) {
        sprite.contadorFrames++;

        if (sprite.contadorFrames >= sprite.velocidadeAnimacao) {
            sprite.quadroAtual = (sprite.quadroAtual + 1) % sprite.totalQuadros;
            sprite.contadorFrames = 0;
        }
    } else {
        //Mantém um quadro fixo enquanto estiver pulando no ar
        sprite.quadroAtual = 1;
    }
}

//Função que desenha as sprites na tela
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Desenhando o fundo duas vezes lado a lado, para que não fique com espaço em branco
    ctx.drawImage(fundoImg, fundo.x, 0, fundo.largura, fundo.altura);
    ctx.drawImage(fundoImg, fundo.x + fundo.largura, 0, fundo.largura, fundo.altura);

    //Calculando a posição horizontal do recorte na tira da sprite
    const recorteX = sprite.quadroAtual * sprite.larguraQuadro;

    //Desenhando apenas o quadro atual da sprite do Caramelo sobre o chão da imagem
    ctx.drawImage(
        carameloImg,
        recorteX, 0, sprite.larguraQuadro, sprite.alturaQuadro, // Onde recortar na imagem original
        caramelo.x, caramelo.y, caramelo.largura, caramelo.altura // Onde desenhar no jogo
    );
}

//Fazendo o loop principal do jogo, que roda o tempo todo
function gameLoop() {
    atualizar();
    desenhar();
    requestAnimationFrame(gameLoop);
}

//Quantidade de imagens carregadas
let imagensCarregadas = 0;

//Função que inicia o loop principal do jogo logo após carregar as 2 imagens
function verificarCarregamento() {
    
    imagensCarregadas++;

    //SE a quantidade de imagens carregas for igual a quantidade de imagens, começa
    if (imagensCarregadas === 2) {
        gameLoop();
    }
}

carameloImg.onload = verificarCarregamento;
fundoImg.onload = verificarCarregamento;
