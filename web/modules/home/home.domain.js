/**
 * Calcula o próximo índice do carrossel com base no arrasto horizontal.
 */
export function calcularProximoIndice(posicaoXInicial, posicaoXFinal, indiceAtual, totalIndicadores) {
  const distanciaX = posicaoXInicial - posicaoXFinal;
  
  if (distanciaX > 50 && indiceAtual < totalIndicadores - 1) {
    return indiceAtual + 1;
  } else if (distanciaX < -50 && indiceAtual > 0) {
    return indiceAtual - 1;
  }
  return indiceAtual;
}

/**
 * Calcula a posição em 'vh' do cabeçalho durante o movimento de arrasto vertical.
 */
export function calcularDeslocamentoCabecalho(posicaoYInicial, posicaoYAtual, menuAberto, windowHeight) {
  const distanciaY = posicaoYAtual - posicaoYInicial;
  
  // Valida se o movimento é condizente com o estado atual
  if ((!menuAberto && distanciaY <= 0) || (menuAberto && distanciaY >= 0)) {
    return menuAberto ? 0 : -60; 
  }

  const base = menuAberto ? 0 : -60;
  const deslocamentoCompleto = (distanciaY / windowHeight) * 100;
  
  // Limita o retorno estritamente entre -60vh e 0vh
  return Math.max(-60, Math.min(base + deslocamentoCompleto, 0));
}

/**
 * Determina se o menu deve abrir ou fechar baseado na distância final do arrasto.
 */
export function determinarEstadoFinalMenu(posicaoYInicial, posicaoYFinal, menuAberto) {
  const distanciaY = posicaoYFinal - posicaoYInicial;

  if (Math.abs(distanciaY) < 15) {
    return !menuAberto; // Trata como um clique simples (Inverte o estado)
  } else if (!menuAberto && distanciaY > 80) {
    return true; // Arrastou para baixo o suficiente para abrir
  } else if (menuAberto && distanciaY < -80) {
    return false; // Arrastou para cima o suficiente para fechar
  }
  
  return menuAberto; // Mantém o estado anterior caso o arrasto tenha sido curto
}