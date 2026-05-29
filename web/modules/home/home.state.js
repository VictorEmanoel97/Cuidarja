/**
 * Estado Inicial do Módulo Home
 */
export const homeState = {
  indiceAtual: 1,
  posicaoXInicial: 0,
  posicaoYInicial: 0,
  menuAberto: false,
  emMovimento: false,

  // Função auxiliar para resetar o estado se necessário
  reset() {
    this.indiceAtual = 1;
    this.posicaoXInicial = 0;
    this.posicaoYInicial = 0;
    this.menuAberto = false;
    this.emMovimento = false;
  }
};