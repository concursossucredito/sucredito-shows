/**
 * EVENTS.JS
 * -----------------------------------------------------------------
 * Acá vive la lista de espectáculos. Para agregar un show nuevo,
 * copiá un bloque { ... } completo, pegalo dentro del array y
 * cambiá los datos. No hace falta tocar ningún otro archivo.
 *
 * Campos:
 *  id            -> identificador único, sin espacios (se usa para medir clics)
 *  artista       -> nombre del artista o espectáculo
 *  titulo        -> bajada corta (ciudad, gira, etc.)
 *  fecha         -> texto para mostrar, ej: "25 de octubre"
 *  hora          -> ej: "20:00 hs"
 *  lugar         -> nombre del lugar, ej: "Palacio de los Deportes"
 *  ciudad        -> ej: "San Miguel de Tucumán"
 *  estado        -> etiqueta corta, ej: "Tanda 1 disponible"
 *  restriccion   -> ej: "Para mayores de 18 años" (opcional, "" si no aplica)
 *  beneficios    -> array de textos cortos con los planes de cuotas
 *  imagen        -> ruta a la imagen del flyer/afiche
 *  proveedor     -> nombre de la boletería que vende la entrada real
 *  urlCompra     -> link externo donde se compra la entrada
 * -----------------------------------------------------------------
 */

const EVENTOS = [
  {
    id: "mona-tucuman-2026-10-25",
    artista: "La Mona Jiménez",
    titulo: "La Mona en Tucumán",
    fecha: "25 de octubre",
    hora: "20:00 hs",
    lugar: "Palacio de los Deportes",
    ciudad: "San Miguel de Tucumán",
    estado: "Tanda 1 disponible",
    restriccion: "Para mayores de 18 años",
    beneficios: [
      "4 cuotas sin interés con Sucrédito",
      "3 cuotas sin interés con Naranja X"
    ],
    imagen: "assets/events/mona-tucuman.jpg",
    proveedor: "Universo Tickets",
    urlCompra: "https://universotickets.com/event_detail/?id=44"
  }

  // Para sumar otro show, descomentá y completá este modelo:
  // ,{
  //   id: "artista-ciudad-2026-xx-xx",
  //   artista: "Nombre del artista",
  //   titulo: "Bajada corta del show",
  //   fecha: "12 de noviembre",
  //   hora: "21:00 hs",
  //   lugar: "Nombre del lugar",
  //   ciudad: "Ciudad",
  //   estado: "Entradas disponibles",
  //   restriccion: "",
  //   beneficios: ["4 cuotas sin interés con Sucrédito"],
  //   imagen: "assets/events/nombre-archivo.jpg",
  //   proveedor: "Nombre de la boletería",
  //   urlCompra: "https://..."
  // }
];
