/**
 * ANALYTICS.JS
 * -----------------------------------------------------------------
 * Mide vistas de página y clics en "Comprar entradas" sin necesitar
 * un backend propio. Funciona en 3 capas, todas opcionales salvo la
 * primera:
 *
 *   1. Contador local (siempre activo, no requiere configuración).
 *      Sirve para probar que el tracking funciona y para un vistazo
 *      rápido abriendo el sitio con ?debug=1 al final de la URL.
 *
 *   2. Google Analytics 4 (opcional). Completá GA4_MEASUREMENT_ID
 *      abajo con tu ID "G-XXXXXXX" y listo: vas a ver los eventos
 *      "click_comprar" en GA4 > Informes > Interacción > Eventos.
 *
 *   3. Webhook propio (opcional). Si ya tenés un Google Apps Script
 *      publicado (el mismo patrón que usa la encuesta de Sucrédito),
 *      pegá la URL en WEBHOOK_URL y cada clic se guarda como fila
 *      en una planilla. Podés reusar el mismo script de la encuesta
 *      agregando una hoja nueva, o publicar uno separado.
 * -----------------------------------------------------------------
 */

const ANALYTICS_CONFIG = {
  GA4_MEASUREMENT_ID: null,   // ej: "G-ABC1234XYZ"
  WEBHOOK_URL: null           // ej: "https://script.google.com/macros/s/AKfycb.../exec"
};

const Analytics = (() => {
  const STORAGE_KEY = "sucredito_shows_stats_v1";

  function leerContadores(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    }catch(e){
      return {};
    }
  }

  function guardarContadores(datos){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    }catch(e){ /* localStorage no disponible, seguimos sin romper nada */ }
  }

  function sumarContadorLocal(nombreEvento, eventoId){
    const datos = leerContadores();
    const clave = eventoId ? `${nombreEvento}::${eventoId}` : nombreEvento;
    datos[clave] = (datos[clave] || 0) + 1;
    guardarContadores(datos);
  }

  // Carga gtag.js dinámicamente solo si se configuró un ID de GA4
  function iniciarGA4(){
    if(!ANALYTICS_CONFIG.GA4_MEASUREMENT_ID) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + ANALYTICS_CONFIG.GA4_MEASUREMENT_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", ANALYTICS_CONFIG.GA4_MEASUREMENT_ID);
  }

  function enviarGA4(nombreEvento, params){
    if(!ANALYTICS_CONFIG.GA4_MEASUREMENT_ID || typeof window.gtag !== "function") return;
    window.gtag("event", nombreEvento, params);
  }

  function enviarWebhook(nombreEvento, params){
    if(!ANALYTICS_CONFIG.WEBHOOK_URL) return;
    const payload = JSON.stringify({
      evento: nombreEvento,
      ...params,
      pagina: location.href,
      fecha: new Date().toISOString()
    });
    try{
      // no-cors porque Apps Script no siempre responde con headers CORS
      fetch(ANALYTICS_CONFIG.WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: payload
      });
    }catch(e){ /* si falla el envío, no interrumpe la experiencia del usuario */ }
  }

  function track(nombreEvento, params={}){
    sumarContadorLocal(nombreEvento, params.evento_id);
    enviarGA4(nombreEvento, params);
    enviarWebhook(nombreEvento, params);

    if(location.search.includes("debug=1")){
      console.log("[analytics]", nombreEvento, params);
    }
  }

  iniciarGA4();

  return { track, leerContadores, guardarContadores, STORAGE_KEY };
})();
