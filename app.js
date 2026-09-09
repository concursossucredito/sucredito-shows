(function(){

  const grid = document.getElementById("listadoGrid");
  const marqueeTrack = document.getElementById("marqueeTrack");

  function crearTicket(evento){
    const art = document.createElement("article");
    art.className = "ticket";

    const chips = evento.beneficios
      .map(b => `<span class="chip">${b}</span>`)
      .join("");

    art.innerHTML = `
      <div class="ticket-imagen">
        <img src="${evento.imagen}" alt="Flyer de ${evento.artista}" loading="lazy">
        ${evento.estado ? `<span class="ticket-estado">${evento.estado}</span>` : ""}
      </div>
      <div class="ticket-costura" aria-hidden="true"></div>
      <div class="ticket-info">
        <h2 class="ticket-artista">${evento.titulo || evento.artista}</h2>
        <div class="ticket-datos">
          <div class="ticket-dato"><span class="icono">📅</span> ${evento.fecha} <span class="valor-sec">— ${evento.hora}</span></div>
          <div class="ticket-dato"><span class="icono">📍</span> ${evento.lugar} <span class="valor-sec">— ${evento.ciudad}</span></div>
        </div>
        <div class="ticket-beneficios">${chips}</div>
        ${evento.restriccion ? `<div class="ticket-restriccion">${evento.restriccion}</div>` : ""}
        <a class="ticket-cta" href="${evento.urlCompra}" target="_blank" rel="noopener"
           data-evento-id="${evento.id}" data-evento-nombre="${evento.artista}">
           Comprar entradas
        </a>
        <span class="ticket-proveedor">Vendido por ${evento.proveedor}</span>
      </div>
    `;

    const cta = art.querySelector(".ticket-cta");
    cta.addEventListener("click", () => {
      Analytics.track("click_comprar", {
        evento_id: evento.id,
        evento_nombre: evento.artista,
        proveedor: evento.proveedor
      });
    });

    return art;
  }

  function renderEventos(){
    if(!EVENTOS || EVENTOS.length === 0){
      grid.innerHTML = `<p class="listado-vacio">Por ahora no hay shows cargados. Volvé a revisar pronto.</p>`;
      return;
    }
    EVENTOS.forEach(evento => grid.appendChild(crearTicket(evento)));
  }

  function renderMarquesina(){
    if(!EVENTOS || EVENTOS.length === 0){ document.getElementById("marquee").hidden = true; return; }

    const items = EVENTOS.map(e => `${e.artista} — ${e.fecha} · ${e.ciudad}`);
    // se duplica el contenido para que el desfile sea continuo
    const textoCompleto = items.concat(items).map(t => `<span class="marquee-item">🎟 ${t}</span>`).join("");
    marqueeTrack.innerHTML = textoCompleto;
  }

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

    // refresca el panel si se registra un clic en esta misma pestaña
    document.addEventListener("click", () => setTimeout(pintar, 50));
  }

  renderEventos();
  renderMarquesina();
  iniciarPanelDebug();

  Analytics.track("vista_pagina", {});

})();
