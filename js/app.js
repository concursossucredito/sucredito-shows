(function(){

  const grid = document.getElementById("listadoGrid");
  const track = document.getElementById("carouselTrack");
  const dotsWrap = document.getElementById("carouselDots");
  const btnPrev = document.getElementById("carouselPrev");
  const btnNext = document.getElementById("carouselNext");
  const carousel = document.getElementById("carousel");

  let indiceActual = 0;
  let temporizador = null;
  const INTERVALO_MS = 5000;

  // ---------- Talón / lista "Elegí tu show" ----------
  function crearFilaShow(evento){
    const art = document.createElement("article");
    art.className = "show-card";

    const chips = evento.beneficios
      .map(b => `<span class="chip">${b}</span>`)
      .join("");

    art.innerHTML = `
      <div class="show-card-miniatura">
        <img src="${evento.imagen}" alt="${evento.artista}" loading="lazy">
        ${evento.estado ? `<span class="show-card-estado">${evento.estado}</span>` : ""}
      </div>
      <div class="show-card-info">
        <h3 class="show-card-artista">${evento.titulo || evento.artista}</h3>
        <div class="show-card-dato">📅 ${evento.fecha} <span class="valor-sec">— ${evento.hora}</span></div>
        <div class="show-card-dato">📍 ${evento.lugar} <span class="valor-sec">— ${evento.ciudad}</span></div>
        <div class="show-card-chips">${chips}</div>
      </div>
      <a class="show-card-cta" href="${evento.urlCompra}" target="_blank" rel="noopener"
         data-evento-id="${evento.id}" data-evento-nombre="${evento.artista}">
         Comprar entradas
      </a>
    `;

    art.querySelector(".show-card-cta").addEventListener("click", () => {
      Analytics.track("click_comprar", {
        evento_id: evento.id,
        evento_nombre: evento.artista,
        proveedor: evento.proveedor,
        origen: "lista"
      });
    });

    return art;
  }

  function renderListado(){
    if(!EVENTOS || EVENTOS.length === 0){
      grid.innerHTML = `<p class="listado-vacio">Por ahora no hay shows cargados. Volvé a revisar pronto.</p>`;
      return;
    }
    EVENTOS.forEach(evento => grid.appendChild(crearFilaShow(evento)));
  }

  // ---------- Carrusel / banner ----------
  function crearSlide(evento){
    const a = document.createElement("a");
    a.className = "carousel-slide";
    a.href = evento.urlCompra;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", `Comprar entradas para ${evento.artista}`);

    a.innerHTML = `
      <img src="${evento.imagen}" alt="${evento.artista}" loading="lazy">
      <div class="carousel-overlay">
        <div class="co-titulo">${evento.titulo || evento.artista}</div>
        <div class="co-meta">${evento.fecha} · ${evento.ciudad}</div>
      </div>
    `;

    a.addEventListener("click", () => {
      Analytics.track("click_comprar", {
        evento_id: evento.id,
        evento_nombre: evento.artista,
        proveedor: evento.proveedor,
        origen: "banner"
      });
    });

    return a;
  }

  function irASlide(i){
    const total = EVENTOS.length;
    indiceActual = (i + total) % total;
    track.style.transform = `translateX(-${indiceActual * 100}%)`;
    dotsWrap.querySelectorAll("button").forEach((d, idx) => {
      d.classList.toggle("activo", idx === indiceActual);
    });
  }

  function reiniciarAutoplay(){
    if(temporizador) clearInterval(temporizador);
    if(EVENTOS.length < 2) return;
    temporizador = setInterval(() => irASlide(indiceActual + 1), INTERVALO_MS);
  }

  function renderCarousel(){
    const wrap = document.querySelector(".carousel-wrap");
    if(!EVENTOS || EVENTOS.length === 0){ wrap.hidden = true; return; }

    EVENTOS.forEach(evento => track.appendChild(crearSlide(evento)));

    if(EVENTOS.length < 2){
      btnPrev.hidden = true;
      btnNext.hidden = true;
    } else {
      EVENTOS.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Ir al show ${idx + 1}`);
        dot.addEventListener("click", () => { irASlide(idx); reiniciarAutoplay(); });
        dotsWrap.appendChild(dot);
      });
      btnPrev.addEventListener("click", () => { irASlide(indiceActual - 1); reiniciarAutoplay(); });
      btnNext.addEventListener("click", () => { irASlide(indiceActual + 1); reiniciarAutoplay(); });

      carousel.addEventListener("mouseenter", () => temporizador && clearInterval(temporizador));
      carousel.addEventListener("mouseleave", reiniciarAutoplay);
    }

    irASlide(0);
    reiniciarAutoplay();
  }

  // ---------- Panel de debug (?debug=1) ----------
  function iniciarPanelDebug(){
    if(!location.search.includes("debug=1")) return;

    const panel = document.getElementById("debugPanel");
    const body = document.getElementById("debugBody");
    const cerrar = document.getElementById("debugCerrar");
    const limpiar = document.getElementById("debugLimpiar");

    function pintar(){
      const datos = Analytics.leerContadores();
      const claves = Object.keys(datos);
      body.innerHTML = claves.length
        ? claves.map(k => `<div class="debug-row"><span>${k}</span><strong>${datos[k]}</strong></div>`).join("")
        : `<div class="debug-row">Todavía no hay clics registrados.</div>`;
    }

    panel.hidden = false;
    pintar();

    cerrar.addEventListener("click", () => panel.hidden = true);
    limpiar.addEventListener("click", () => {
      Analytics.guardarContadores({});
      pintar();
    });

    document.addEventListener("click", () => setTimeout(pintar, 50));
  }

  renderListado();
  renderCarousel();
  iniciarPanelDebug();

  Analytics.track("vista_pagina", {});

})();
