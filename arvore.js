function copiarArray(array) {
  let array2 = [];
  for (let i = 0; i < array.length; i++) {
    array2[i] = [].concat(array[i]);
  }
  return array2;
}

//funcao para verificar se um dado esta no topo ou nao
function estaNoTopo(posicaoLinha, posicaoColuna, tabuleiro) {
  //precorrer a coluna desejada
  for (let i = 0; i < tabuleiro.length; i++) {
    //verificar o primeiro valor nao vazio
    if (tabuleiro[i][posicaoColuna] != "") {
      //verificar se este valor eh o valor passado no parametro
      if (
        tabuleiro[i][posicaoColuna] == tabuleiro[posicaoLinha][posicaoColuna] &&
        posicaoLinha == i
      ) {
        return true;
      }

      return false;
    }
  }

  return false;
}

//funcao para verificar se um dado esta no topo ou nao e se esta vazio o topo
function estaNoTopoEVazio(posicaoLinha, posicaoColuna, tabuleiro) {
  let contador = 0,
    contador2 = 0;
  //precorrer toda a coluna apartir do valor do topo
  for (let i = posicaoLinha + 1; i < tabuleiro.length; i++) {
    contador++;
    //verificar se nao existe nenhum outro espaco em branco abaixo do espaco embranco do topo
    if (tabuleiro[posicaoLinha][posicaoColuna] == "") {
      if (tabuleiro[i][posicaoColuna] != "") {
        contador2++;
      }
    }
  }

  if (contador == 0) {
    if (tabuleiro[posicaoLinha][posicaoColuna] == "") {
      return true;
    }
  } else {
    if (contador == contador2) {
      return true;
    }
  }

  return false;
}

//funcao para verificar se o jogo terminou ou nao

function testeObjectivos(estadoInicial1) {
  //variaveis auxiliares
  let peca;
  let contador = 0;
  let colunasCompletas = 0;

  //precorrer as linhas de todas as colunas da interface
  for (let i = 0; i < 5; i++) {
    contador = 0;
    //precorrer as colunas
    for (let j = 0; j < 4; j++) {
      //guardar o primeiro valor da coluna na variavel peca
      if (j == 0) {
        peca = estadoInicial1[j][i];
      }

      //comparar o primeiro valor da coluna com os demais valores da coluna
      if (peca == estadoInicial1[j][i] && peca != "") {
        //incrementar o contador caso os valores sejam identicos
        contador++;
      }
    }

    //verificar se todos os valores da coluna sao iguais
    if (contador == estadoInicial1.length) {
      //incrementar o numero de colunas ja resolvidas
      colunasCompletas++;
    }
  }

  //verificar se ja foram resolvidas 3 colunas
  if (colunasCompletas >= 3) {
    return true;
  }

  return false;
}

//funcao para retornar todas as jogadas
function modeloDeTransicao(eAtual) {
  let copia = copiarArray(eAtual);
  let proximasJogadas = [];

  for (let i = 0; i < eAtual.length; i++) {
    for (let j = 0; j < eAtual[i].length; j++) {
      //verificar se o elemento esta no topo ou nao para que ele possa ser transitado
      if (estaNoTopo(i, j, eAtual)) {
        for (let k = 0; k < eAtual.length; k++) {
          for (let l = 0; l < eAtual[k].length; l++) {
            //verificar as posicoes vazias do topo onde o elemento pode ser guardado
            if (estaNoTopoEVazio(k, l, eAtual) && k !=i && l!=j) {
              //guardar o elemento no topo de uma outra coluna que nao esteja ocupada
              eAtual[k][l] = eAtual[i][j];
              eAtual[i][j] = "";
              //armazenar todas as possiveis jogadas
              proximasJogadas.push(eAtual);
              //voltar ao estado original
              eAtual = copiarArray(copia);
            }
          }
        }
      }
    }
  }

  return proximasJogadas;
}

class No {
  constructor(espaco) {
    this.espaco = espaco;
    this.filhos = [];
    this.pai = null;
    this.caminhos = [];
  }
}

class Arvore {
  constructor(espaco) {
    this.raiz = new No(espaco);
    this.pilha = [this.raiz];
    this.solucoes = [];
    this.contador = 0;
  }

  copiar(array1) {
    let array2 = [];
    for (let i = 0; i < array1.length; i++) {
      array2[i] = [].concat(array1[i]);
    }
    return array2;
  }

  buscaPorProfundidade(arvore, profundidade = 0) {
    // passar arvore e profundidade maxima...
    if (arvore && profundidade < 4000) {
      ++profundidade;
      // copiar dados disponivel no jogo antes de movimentar....
      let copia = this.copiar(arvore.espaco);
      //verificar se alcansou alguma solucao
      if (testeObjectivos(arvore.espaco)) {
        this.solucoes.push(arvore);

        // return;
      }

      // chamar funcao de transicao para gerar caminhos e adicionar caminhos....
      let transacao = modeloDeTransicao(arvore.espaco);
      // verficar se existe algum caminho...
      if (transacao.length > 0) {
        let no;
        // adcionar todos caminhos....
        for (let i = 0; i < transacao.length; i++) {
          no = new No(transacao[i]);
          no.caminhos.push(arvore);
          arvore.espaco = copia;
          no.pai = arvore;
          for (let j = 0; j < arvore.caminhos.length; j++) {
            no.caminhos.push(arvore.caminhos[j]);
          }

          arvore.filhos.push(no);
        }
      }
      this.pilha.shift();
      for (let i = 0; i < arvore.filhos.length; i++) {
        this.pilha.push(arvore.filhos[i]);
      }

      this.buscaPorProfundidade(this.pilha[0], profundidade);
    }
    return this.solucoes;
  }
}

let ar = new Arvore(estadoInicial);
//console.log(testeObjectivos(estadoInicial));
//console.log(modeloDeTransicao(estadoInicial));
//console.log(ar.buscaPorProfundidade(ar.raiz));