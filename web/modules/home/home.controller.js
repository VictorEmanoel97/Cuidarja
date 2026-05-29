import { homeState } from './home.state.js';
import { 
  calcularProximoIndice, 
  calcularDeslocamentoCabecalho, 
  determinarEstadoFinalMenu 
} from './home.domain.js';

let telas, indicadores, cabecalho, sobreposicao;

export function initHomeController() {
  telas = document.getElementById("telas");
  indicadores = document.querySelectorAll("#paginacao span");
  cabecalho = document.getElementById("cabecalho");
  sobreposicao = document.getElementById("sobreposicao");

  if (!telas || !cabecalho || !sobreposicao) return;

  // Inicializa/Reseta o Estado
  homeState.reset();
  telas.style.transform = `translateX(-100vw)`;

  // Ouvidores de Evento Horizontais
  telas.addEventListener("touchstart", tratarTouchStartTelas, { passive: true });
  telas.addEventListener("touchend", tratarTouchEndTelas, { passive: true });

  // Ouvidores de Evento Verticais
  cabecalho.addEventListener("touchstart", tratarTouchStartCabecalho, { passive: true });
  cabecalho.addEventListener("touchmove", tratarTouchMoveCabecalho, { passive: false });
  cabecalho.addEventListener("touchend", tratarTouchEndCabecalho, { passive: true });

  // Eventos do Overlay
  sobreposicao.addEventListener("touchend", fecharMenu, { passive: false });
  sobreposicao.addEventListener("click", fecharMenu);
}

export function destroyHomeController() {
  if (telas) {
    telas.removeEventListener("touchstart", tratarTouchStartTelas);
    telas.removeEventListener("touchend", tratarTouchEndTelas);
  }
  if (cabecalho) {
    cabecalho.removeEventListener("touchstart", tratarTouchStartCabecalho);
    cabecalho.removeEventListener("touchmove", tratarTouchMoveCabecalho);
    cabecalho.removeEventListener("touchend", tratarTouchEndCabecalho);
  }
  if (sobreposicao) {
    sobreposicao.removeEventListener("touchend", fecharMenu);
    sobreposicao.removeEventListener("click", fecharMenu);
  }
}

/* --- Handlers de Evento --- */

function tratarTouchStartTelas(e) {
  if (homeState.menuAberto) return;
  homeState.posicaoXInicial = e.touches[0].clientX;
}

function tratarTouchEndTelas(e) {
  if (homeState.menuAberto) return;

  // Altera o estado chamando a regra de negócio do Domain
  homeState.indiceAtual = calcularProximoIndice(
    homeState.posicaoXInicial,
    e.changedTouches[0].clientX,
    homeState.indiceAtual,
    indicadores.length
  );

  // Renderiza a alteração visual baseada no novo estado
  telas.style.transform = `translateX(${-homeState.indiceAtual * 100}vw)`;
  
  indicadores.forEach(ind => ind.classList.remove("ativo"));
  if (indicadores[homeState.indiceAtual]) {
    indicadores[homeState.indiceAtual].classList.add("ativo");
  }
}

function tratarTouchStartCabecalho(e) {
  homeState.posicaoYInicial = e.touches[0].clientY;
  homeState.emMovimento = false;
}

function tratarTouchMoveCabecalho(e) {
  const posicaoYAtual = e.touches[0].clientY;
  const distanciaY = posicaoYAtual - homeState.posicaoYInicial;

  // Verifica se a direção do arrasto faz sentido para o estado do menu
  if ((!homeState.menuAberto && distanciaY > 0) || (homeState.menuAberto && distanciaY < 0)) {
    if (!homeState.emMovimento) {
      cabecalho.style.transition = 'none'; 
      homeState.emMovimento = true;
    }

    // Domain calcula a posição matemática
    const posicaoVh = calcularDeslocamentoCabecalho(
      homeState.posicaoYInicial,
      posicaoYAtual,
      homeState.menuAberto,
      window.innerHeight
    );
    
    requestAnimationFrame(() => {
      if (homeState.emMovimento) {
        cabecalho.style.transform = `translateY(${posicaoVh}vh)`;
      }
    });
  }
}

function tratarTouchEndCabecalho(e) {
  homeState.emMovimento = false;
  cabecalho.style.transition = 'transform 0.6s ease';
  void cabecalho.offsetHeight; 

  // Domain decide se o menu abre ou fecha de fato
  homeState.menuAberto = determinarEstadoFinalMenu(
    homeState.posicaoYInicial,
    e.changedTouches[0].clientY,
    homeState.menuAberto
  );

  // Aplica o resultado final no DOM
  cabecalho.style.transform = homeState.menuAberto ? "translateY(0)" : "translateY(-60vh)";
  sobreposicao.classList.toggle("ativa", homeState.menuAberto);
}

function fecharMenu(e) {
  if (e && e.cancelable) e.preventDefault();
  cabecalho.style.transition = 'transform 0.6s ease';
  cabecalho.style.transform = "translateY(-60vh)";
  sobreposicao.classList.remove("ativa");
  homeState.menuAberto = false;
}