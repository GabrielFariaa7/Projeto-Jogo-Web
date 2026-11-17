const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//Carregando as imagens do caramelo, do fundo e do carro
const carameloImg = new Image();
carameloImg.src = 'caramelo_andando_sprite.png';

const fundoImg = new Image();
fundoImg.src = 'fundo.png';

const carroImg = new Image();
carroImg.src = 'taxi_sprite.png'; // Coloque o nome exato da sprite do seu carro

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

//Configurando os quadros da animação do carro
const carroSprite = {
    totalQuadros: 8,       
    quadroAtual: 0,        
    larguraQuadro: 272,    
    alturaQuadro: 194,     
    contadorFrames: 0,
    velocidadeAnimacao: 5
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

//Lista que guarda os carros que aparecem na tela
let carros = [];
let tempoProximoCarro = sortearTempoCarro();

//Função que sorteia um tempo entre 1s e 4s para criar o próximo carro
function sortearTempoCarro() {
    const tempoMinimo = 60;  
    const tempoMaximo = 240; 
    return Math.floor(Math.random() * (tempoMaximo - tempoMinimo + 1)) + tempoMinimo;
}

//Função que cria um novo carro fora da tela
function criarCarro() {

    //Garantindo a proporção do carro
    const larguraCarro = 98;
    const alturaCarro = 70;

    carros.push({
        x: canvas.width,
        y: chaoY - alturaCarro,
        largura: larguraCarro,
        altura: alturaCarro,
        velocidade: 6
    });
}

//Função que reinicia o jogo inteiro quando o caramelo bate em um carro
function reiniciarJogo() {

    //Limpando os carros e sorteia um novo tempo para o próximo aparecer
    carros = [];
    tempoProximoCarro = sortearTempoCarro();

    //Voltando o fundo exatamente para o início
    fundo.x = 0;

    //Resetando a posição e a física do caramelo
    caramelo.y = chaoY - caramelo.altura;
    caramelo.velocidadeY = 0;
    caramelo.noChao = true;

    //Resetando os quadros das animações para o início
    sprite.quadroAtual = 0;
    sprite.contadorFrames = 0;
    carroSprite.quadroAtual = 0;
    carroSprite.contadorFrames = 0;
}

//Função que verifica se o caramelo encostou em algum carro
function verificarColisao(player, obstaculo) {

    //Mrgem nas bordas para a colisão não pegar nas áreas transparentes da sprite
    const margemX = 14;
    const margemY = 12;

    return (
        player.x + margemX < obstaculo.x + obstaculo.largura - margemX &&
        player.x + player.largura - margemX > obstaculo.x + margemX &&
        player.y + margemY < obstaculo.y + obstaculo.altura - margemY &&
        player.y + player.altura - margemY > obstaculo.y + margemY
    );
}

//Função que faz o cachorro pular
function pular() {

    //SE o caramelo estiver no chão
    if (caramelo.noChao) {

        //Então eu faço ele subir de acordo com a força do pulo configurada
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

    //Atualizando os quadros da animação do carro
    carroSprite.contadorFrames++;
    if (carroSprite.contadorFrames >= carroSprite.velocidadeAnimacao) {
        carroSprite.quadroAtual = (carroSprite.quadroAtual + 1) % carroSprite.totalQuadros;
        carroSprite.contadorFrames = 0;
    }

    //Controlando o tempo variado para aparecer novos carros
    tempoProximoCarro--;
    if (tempoProximoCarro <= 0) {
        criarCarro();
        tempoProximoCarro = sortearTempoCarro();
    }

    //Movendo cada carro da lista e verificando colisão
    for (let i = carros.length - 1; i >= 0; i--) {
        const carro = carros[i];
        carro.x -= carro.velocidade;

        //SE o caramelo bater no carro, reinicia o jogo inteiro
        if (verificarColisao(caramelo, carro)) {
            reiniciarJogo();
            break;
        }

        //Remove o carro da memória depois que ele sair totalmente pela esquerda
        if (carro.x + carro.largura < 0) {
            carros.splice(i, 1);
        }
    }
}

//Função que desenha as sprites na tela
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Desenhando o fundo duas vezes lado a lado, para que não fique com espaço em branco
    ctx.drawImage(fundoImg, fundo.x, 0, fundo.largura, fundo.altura);
    ctx.drawImage(fundoImg, fundo.x + fundo.largura, 0, fundo.largura, fundo.altura);

    //Calculando a posição horizontal do recorte na tira da sprite do caramelo
    const recorteX = sprite.quadroAtual * sprite.larguraQuadro;

    //Desenhando apenas o quadro atual da sprite do Caramelo sobre o chão da imagem
    ctx.drawImage(
        carameloImg,
        recorteX, 0, sprite.larguraQuadro, sprite.alturaQuadro, // Onde recortar na imagem original
        caramelo.x, caramelo.y, caramelo.largura, caramelo.altura // Onde desenhar no jogo
    );

    //Calculando a posição horizontal do recorte na tira da sprite do carro
    const recorteCarroX = carroSprite.quadroAtual * carroSprite.larguraQuadro;

    //Desenhando todos os carros ativos na tela
    for (let i = 0; i < carros.length; i++) {
        const carro = carros[i];
        ctx.drawImage(
            carroImg,
            recorteCarroX, 0, carroSprite.larguraQuadro, carroSprite.alturaQuadro,
            carro.x, carro.y, carro.largura, carro.altura
        );
    }
}

//Fazendo o loop principal do jogo, que roda o tempo todo
function gameLoop() {
    atualizar();
    desenhar();
    requestAnimationFrame(gameLoop);
}

//Quantidade de imagens carregadas
let imagensCarregadas = 0;

//Função que inicia o loop principal do jogo logo após carregar as 3 imagens
function verificarCarregamento() {
    
    imagensCarregadas++;

    //SE a quantidade de imagens carregas for igual a quantidade de imagens, começa
    if (imagensCarregadas === 3) {
        gameLoop();
    }
}

carameloImg.onload = verificarCarregamento;
fundoImg.onload = verificarCarregamento;
carroImg.onload = verificarCarregamento;
