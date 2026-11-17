const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//Carregando as imagens do caramelo
const carameloImg = new Image();
carameloImg.src = 'caramelo_sprite.png';

//Configurando a altura do chão
const chaoY = 240;

const ajusteY = 10;

//Criando o objeto do player (caramelo)
const caramelo = {
    x: 60,
    y: chaoY - 60 + ajusteY,
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

//Função que atualiza a física do jogo
function atualizar() {

    //Aplicando a gravidade e o pulo do caramelo
    caramelo.velocidadeY += caramelo.gravidade;
    caramelo.y += caramelo.velocidadeY;

    //Fazendo a colisão com o chão
    if (caramelo.y >= chaoY - caramelo.altura + ajusteY) {
        caramelo.y = chaoY - caramelo.altura + ajusteY;
        caramelo.velocidadeY = 0;
        caramelo.noChao = true;
    }
}

//Função que desenha as sprites na tela
function desenhar() {

    //Limpando o quadro anterior
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Desenhando o chão temporário
    ctx.fillStyle = '#555';
    ctx.fillRect(0, chaoY, canvas.width, canvas.height - chaoY);

    //Desenhando a sprite do Caramelo
    ctx.drawImage(carameloImg, caramelo.x, caramelo.y, caramelo.largura, caramelo.altura);
}

//Fazendo o loop principal do jogo, que roda o tempo todo
function gameLoop() {
    atualizar();
    desenhar();
    requestAnimationFrame(gameLoop);
}

//Iniciando o loop assim que a imagem carregar
carameloImg.onload = () => {
    gameLoop();
};
