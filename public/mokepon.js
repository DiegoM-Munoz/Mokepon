const seccionSeleccionarAtaque = document.getElementById("seleccionar-ataque");
const seccionReiniciar = document.getElementById("reiniciar");
const botonMascotaJugador = document.getElementById("boton-mascota");
const botonReiniciar = document.getElementById("boton-reiniciar");

const seccionEligeTuMascota = document.getElementById("seleccionar-mascota");

const spanMascotaJugador = document.getElementById("mascota-jugador");

const spanMascotaEnemigo = document.getElementById("mascota-enemigo");
const eleccionEnemigo = "El enemigo eligió a ";

const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");

const sectionMensajes = document.getElementById("resultado");
const ataquesDelJugador = document.getElementById("ataques-del-jugador");
const ataquesDelEnemigo = document.getElementById("ataques-del-enemigo");
//Esta "const" se crea para editar el "div" que (como su nombre lo indica) hace de contenedor para todas las "let" de mokepones que hayamos creado en la "class Mokepon" por medio del "constructor".
const contenedorTarjetas = document.getElementById("contenedorTarjetas");
const tarjetaDeAtaques = document.getElementById("tarjetaDeAtaques");

const sectionVerMapa = document.getElementById("ver-mapa");
const mapa = document.getElementById("mapa");

// el arreglo "let mokepones = []" permiten almacenar varios valores en una misma variable. (en este caso, este arreglo depende del metodo ".push", el cual le envía la información de los Mokepones que lo componen)
let jugadorId = null;
let enemigoId = null;
let mokepones = [];
let mokeponesEnemigos = [];
let ataqueJugador = [];
let ataqueEnemigo = [];
let opcionDeMokepones;
// al correr el juego la "console" nos arroja el error "Uncaught TypeError: Cannot read properties of null (reading 'checked') at HTMLButtonElement.seleccionarMascotaJugador (mokepon.js:121:23)" (al momento de leer el codigo, inicia por el HTML y recordar que el llamado al .js se movió para el final del HTML lo cual no es relevante en este momento pero se debe tener en cuenta)
//a la hora de leer el .js se inicia de arriba hacía abajo, por lo cual, lo primero que leía era las "const inputHipodoge, inputCapipepo y inputRatigueya" las cualaes llaman a los elementos identificados con su respectivo "id" los cuales aún no existen, porque se modificó el codigo para que sean creados al momento de ejecutar la función "iniciar juego", la cual contiene el metodo ".forEach" que modifica el HTML). Por lo anterior se mueven las "const" a la 'sección' de "let" y se cambia 'la clasificación' de la variable y el llamado al id se ubica al final de función "iniciarJuego".
let inputHipodoge;
let inputCapipepo;
let inputRatigueya;
let inputPydos;
let inputTucapalma;
let inputLangostelvis;
//Esta variable se crea para poder guardar el nombre de la mascota que es elegida por el jugador (en "function seleccionarMascotaJugador ()"). Esto con el objetivo de poder buscar dentro del arreglo "let mokepones = []" el arreglo "this.ataques = []" que corresponde al mokepon elegido (por ejemplo, si elige a hipodoge, guarda el nombre del mokepon y con otra let podre llamar las propiedas dentro de "hipodoge.ataques", es decir los cinco ataques asignados a este mokepon)
let mascotaJugador;
let mascotaJugadorObjeto;
let TipoMokeponJugador;
let TipoMokeponEnemigo;
let ataquesMokepon;

let ataqueAdicional;

let ataquesMokeponEnemigo;
let botonFuego;
let botonAgua;
let botonPlanta;
let botonVeneno;
let botonViento;
//Se crea este arreglo con el objetivo de que se pueda automatizar la creación de botones de ataque con llamado a la acción "querySelectorAll"
let botones = [];
let indexAtaqueJugador;
let indexAtaqueEnemigo;
let victoriasJugador = 0;
let victoriasEnemigo = 0;
let vidasJugador = 3;
let vidasEnemigo = 3;
let resultado;
//Esta variable se crea para tener un contexto del mapa para poder dibujar dentro del canvas (mapa)
let lienzo = mapa.getContext("2d");
//Se crea con el objetivo de actualizar el canvas constatemente y ver el movimiento.
let intervalo;
let mapaBackground = new Image();
mapaBackground.src = "./assets/mokemap.png";

//Con estas variables estamos creando un mapa responsive que: por medio de "window.innerWidth - 50" "let anchoDelMapa" siempre va a estar a una medida de -20 por debajo del ancho de la pantalla.
let alturaQueBuscamos;
let anchoDelMapa = window.innerWidth - 50;
const anchoMaximoDelMapa = 720;

if (anchoDelMapa > anchoMaximoDelMapa) {
  anchoDelMapa = anchoMaximoDelMapa - 50;
}
//La altura se asigna con una formula que se actualiza según el ancho del mapa
alturaQueBuscamos = (anchoDelMapa * 600) / 800;
//Ahora se asignan valores al width y height
mapa.width = anchoDelMapa;
mapa.height = alturaQueBuscamos;

//En Javascript "class" es una palabra reservada para crear clases (lo que nos permitirá automatizar el proceso de creación de más objetos (para este caso más Mokepones)) *Todas las clases inician con Mayúscula* (las variables con minúscula).
class Mokepon {
  //Con la palabra reservada "constructor" vamos a determinar las propiedades que van a tener los objetos que se creen con la "class" (puedo agregar cuantas variables se me ocurran "tipos de mokepon, especie, habitat, ataques, etc.").

  //Creo un nuevo objeto "tipo" para que según el tipo de mokepon a enfrentar, este tenga una ventaja (agua contra fuego)
  constructor(nombre, foto, vida, tipo, fotoMapa, id = null) {
    //La palabra reservada "this." crea una variable interna en la "class" que guarda el valor que se asigne en el "constructor". De esta forma se enlaza el valor que se da a "nombre" en "constructor" con "this.nombre" (Es decir, las propiedas se establecen a traves del "constructor")
    this.id = id;
    this.nombre = nombre;
    this.foto = foto;
    this.vida = vida;
    this.tipo = tipo;
    //Este arreglo no se incluye en el constructor porque a este "arreglo" se le insertan los valores desde el metodo (externo) ".push"
    this.ataques = [];
    //Se crean los atributos de "X, Y, Ancho y Alto" (Los más importantes son X y Y para mantener el valor guardado y poder actualizarlo)
    this.ancho = 80;
    this.alto = 80;
    this.x = aleatorio(0, mapa.width - this.ancho);
    this.y = aleatorio(0, mapa.height - this.alto);
    this.mapaFoto = new Image();
    this.mapaFoto.src = fotoMapa;
    this.velocidadX = 0;
    this.velocidadY = 0;
  }
  //Este "metodo" de la "class" es una función que devuelve un objeto como valor.
  //En ese orden de ideas, al llamar "pintarMokepon" ejecuta la función "lienzo.drawImage" (con los objetos del mokepon seleccionado) (de igual forma con los mokepones enemigos)
  pintarMokepon() {
    lienzo.drawImage(this.mapaFoto, this.x, this.y, this.ancho, this.alto);
  }
}
// Esta "let" crea un nuevo Mokepon (ejm: hipodoge). La palabra reservada "= new" hace referencia a un nuevo objeto (Es decir, crea un nuevo objeto según los criterios (propiedades) determinados en la "class").
//En este caso "Mokepon" se reconoce como un "constructor" que requiere se le asignen los valores (nombre, foto y vida) para crear el nuevo objeto.
let hipodoge = new Mokepon(
  "Hipodoge",
  "./Assets/mokepons_mokepon_hipodoge_attack.png",
  5,
  "Water",
  "./assets/hipodoge.png"
);

let capipepo = new Mokepon(
  "Capipepo",
  "./Assets/mokepons_mokepon_capipepo_attack.png",
  5,
  "Grass",
  "./assets/capipepo.png"
);

let ratigueya = new Mokepon(
  "Ratigueya",
  "./Assets/mokepons_mokepon_ratigueya_attack.png",
  5,
  "Fire",
  "./assets/ratigueya.png"
);

let pydos = new Mokepon(
  "Pydos",
  "./Assets/mokepons_mokepon_pydos_attack.png",
  5,
  "Poison",
  "./assets/pydos.png"
);

let tucapalma = new Mokepon(
  "Tucapalma",
  "./Assets/mokepons_mokepon_tucapalma_attack.png",
  5,
  "Fliying",
  "./assets/tucapalma.png"
);

let langostelvis = new Mokepon(
  "Langostelvis",
  "./Assets/mokepons_mokepon_langostelvis_attack.png",
  5,
  "Fire",
  "./assets/langostelvis.png"
);

const HIPODOGE_ATAQUES = [
  { nombre: "💧", id: "boton-agua", tagname: "AGUA" },
  { nombre: "💧", id: "boton-agua", tagname: "AGUA" },
  { nombre: "💧", id: "boton-agua", tagname: "AGUA" },
  { nombre: "🦠", id: "boton-veneno", tagname: "VENENO" },
  { nombre: "🍃", id: "boton-planta", tagname: "PLANTA" },
];

// el metodo ".push" envía los (objetos) asignados al arreglo del mismo nombre, el cual tiene valor "= []"
//"..." envía la información del arreglo de la "const HIPODOGE_ATAQUES" como si se hubiera escrito (dentro del parentesis y no como una lista). Esto para evitar REescribir código y los valores sean reconocidos como tal, no como texto.
hipodoge.ataques.push(...HIPODOGE_ATAQUES);

// hipodogeEnemigo.ataques.push(...HIPODOGE_ATAQUES)

const CAPIPEPO_ATAQUES = [
  { nombre: "🍃", id: "boton-planta", tagname: "PLANTA" },
  { nombre: "🍃", id: "boton-planta", tagname: "PLANTA" },
  { nombre: "🍃", id: "boton-planta", tagname: "PLANTA" },
  { nombre: "💧", id: "boton-agua", tagname: "AGUA" },
  { nombre: "🌀", id: "boton-viento", tagname: "VIENTO" },
];

capipepo.ataques.push(...CAPIPEPO_ATAQUES);

// capipepoEnemigo.ataques.push(...CAPIPEPO_ATAQUES)

const RATIGUEYA_ATAQUES = [
  { nombre: "🔥", id: "boton-fuego", tagname: "FUEGO" },
  { nombre: "🔥", id: "boton-fuego", tagname: "FUEGO" },
  { nombre: "🔥", id: "boton-fuego", tagname: "FUEGO" },
  { nombre: "🦠", id: "boton-veneno", tagname: "VENENO" },
  { nombre: "🌀", id: "boton-viento", tagname: "VIENTO" },
];

ratigueya.ataques.push(...RATIGUEYA_ATAQUES);

// ratigueyaEnemigo.ataques.push(...RATIGUEYA_ATAQUES)

const PYDOS_ATAQUES = [
  { nombre: "🦠", id: "boton-veneno", tagname: "VENENO" },
  { nombre: "🦠", id: "boton-veneno", tagname: "VENENO" },
  { nombre: "🦠", id: "boton-veneno", tagname: "VENENO" },
  { nombre: "💧", id: "boton-agua", tagname: "AGUA" },
  { nombre: "🍃", id: "boton-planta", tagname: "PLANTA" },
];

pydos.ataques.push(...PYDOS_ATAQUES);

// pydosEnemigo.ataques.push(...PYDOS_ATAQUES)

const TUCAPALMA_ATAQUES = [
  { nombre: "🌀", id: "boton-viento", tagname: "VIENTO" },
  { nombre: "🌀", id: "boton-viento", tagname: "VIENTO" },
  { nombre: "🌀", id: "boton-viento", tagname: "VIENTO" },
  { nombre: "🍃", id: "boton-planta", tagname: "PLANTA" },
  { nombre: "🍃", id: "boton-planta", tagname: "PLANTA" },
];

tucapalma.ataques.push(...TUCAPALMA_ATAQUES);

// tucapalmaEnemigo.ataques.push(...TUCAPALMA_ATAQUES)

const LANGOSTELVIS_ATAQUES = [
  { nombre: "🔥", id: "boton-fuego", tagname: "FUEGO" },
  { nombre: "🔥", id: "boton-fuego", tagname: "FUEGO" },
  { nombre: "🔥", id: "boton-fuego", tagname: "FUEGO" },
  { nombre: "💧", id: "boton-agua", tagname: "AGUA" },
  { nombre: "💧", id: "boton-agua", tagname: "AGUA" },
];

langostelvis.ataques.push(...LANGOSTELVIS_ATAQUES);

// langostelvisEnemigo.ataques.push(...LANGOSTELVIS_ATAQUES)

//Para incluir más mokepones dentro del arreglo "let mokepones = [] deben incluirse las nuevas "let ***** = new Mokepon" y como valores (entre los parentesis)
mokepones.push(hipodoge, capipepo, ratigueya, pydos, tucapalma, langostelvis);

function iniciarJuego() {
  seccionSeleccionarAtaque.style.display = "none";
  sectionVerMapa.style.display = "none";

  //este "metodo" ayuda a "iterar o recorrer" cada uno de los objetos dentro de un arreglo para introducirlo en el HTML.
  //".forEach" = por cada uno de los elementos dentro del arreglo haz algo. (en este caso) Por cada Mokepon que existe en el arreglo de Mokepones "let mokepones = []" genera la estructutra de HTML e inyectala en el HTML "Inner.HTML" para sustituir las propiedades de forma automatica (objetos y valor de propiedad)) 'Ciclos: manipulando el DOM con iteradores: Diego de Granda clase 50 Nuevo Curso Gratis de Programación Basica'
  mokepones.forEach((mokepon) => {
    //Se copió la estructura que inicialmente se había creado en HTML para cada uno de los mokepones y se automatizó el proceso con este código de ".forEach". Ahora, si creamos nuevas "let" de mokepon, para que se introduzcan en la "class Mokepon" por medio de su "constructor" no será necesario crear nuevas lineas de codigo en HTML, basta con asignar en la "let" los valores (para este caso de (nombre, foto, vida))
    //Se debe asignar valores dinámicos (id=, for=, <p>=, <img src=, alt=) para que se actualicen según cada una de las "propiedades" determinadas en el "constructor" de la "class mokepon" (esto se hace por medio de "${}")
    opcionDeMokepones = `
        <input type="radio" name="mascota" id=${mokepon.nombre} />
                <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
                    <p>${mokepon.nombre}</p>
                    <img src=${mokepon.foto} alt=${mokepon.nombre}>
                </label>
        `;
    //el Operador aritmetico "+=" hace que se repita la acción de "iterar" codigo HTML (como se indica en la "let opcionDeMokepones") con todas las variables creadas (en este caso, crear el codigo en HTML de cada una de las "let" de los mokepones que están dentro de la "class Mokepon")
    contenedorTarjetas.innerHTML += opcionDeMokepones;

    //Estos llamados ".getElementById" se mueven del grupo de variables "const" porque al modificar el codigo de HTML (borrando el codigo que se había creado de forma manual y automatizandolo con esta función) registra error, porque aún no se habián creado las lineas de codigo cuando se ejecutan estos llamados. Por eso deben quedar después de crearse las lineas de código.
    inputHipodoge = document.getElementById("Hipodoge");
    inputCapipepo = document.getElementById("Capipepo");
    inputRatigueya = document.getElementById("Ratigueya");
    inputPydos = document.getElementById("Pydos");
    inputTucapalma = document.getElementById("Tucapalma");
    inputLangostelvis = document.getElementById("Langostelvis");
  });

  seccionReiniciar.style.display = "none";

  botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);

  botonReiniciar.addEventListener("click", reiniciarJuego);

  unirseAlJuego();
}

function unirseAlJuego() {
  fetch("http://192.168.1.15:8080/unirse").then(function (res) {
    if (res.ok) {
      res.text().then(function (respuesta) {
        console.log(respuesta);
        jugadorId = respuesta;
      });
    }
  });
}

function seleccionarMascotaJugador() {
  if (inputHipodoge.checked) {
    spanMascotaJugador.innerHTML = inputHipodoge.id;
    mascotaJugador = inputHipodoge.id;
    TipoMokeponJugador = hipodoge.tipo;
    ataqueAdicional = hipodoge.ataques;
  } else if (inputCapipepo.checked) {
    spanMascotaJugador.innerHTML = inputCapipepo.id;
    mascotaJugador = inputCapipepo.id;
    TipoMokeponJugador = capipepo.tipo;
    ataqueAdicional = capipepo.ataques;
  } else if (inputRatigueya.checked) {
    spanMascotaJugador.innerHTML = inputRatigueya.id;
    mascotaJugador = inputRatigueya.id;
    TipoMokeponJugador = ratigueya.tipo;
    ataqueAdicional = ratigueya.ataques;
  } else if (inputPydos.checked) {
    spanMascotaJugador.innerHTML = inputPydos.id;
    mascotaJugador = inputPydos.id;
    TipoMokeponJugador = pydos.tipo;
    ataqueAdicional = pydos.ataques;
  } else if (inputTucapalma.checked) {
    spanMascotaJugador.innerHTML = inputTucapalma.id;
    mascotaJugador = inputTucapalma.id;
    TipoMokeponJugador = tucapalma.tipo;
    ataqueAdicional = tucapalma.ataques;
  } else if (inputLangostelvis.checked) {
    spanMascotaJugador.innerHTML = inputLangostelvis.id;
    mascotaJugador = inputLangostelvis.id;
    TipoMokeponJugador = langostelvis.tipo;
    ataqueAdicional = langostelvis.ataques;
  } else {
    alert("Debes seleccionar una de las mascotas para iniciar el juego");
    //"return" (al estar vacio) se usa para detener el flujo normal de la aplicación al no haber elegido un mokepon.
    return;
  }

  seccionEligeTuMascota.style.display = "none";

  seleccionarMokepon(mascotaJugador);

  sectionVerMapa.style.display = "flex";
  iniciarMapa();
  //Se crea una nueva linea para la "let mascotaJugador" que tendrá el valor del "id" de la mascota seleccionada (es decir, su nombre). Esto con el objetivo de poder buscar los ataques que se le han asignado dentro del arreglo "this.ataques = []".
  extraerAtaques(mascotaJugador);
}

function seleccionarMokepon(mascotaJugador) {
  //cuando la solicitud es tipo 'post' se debe agregar un segundo parametro tipo "json" que lo indique (method: "post").
  fetch(`http://192.168.1.15:8080/mokepon/${jugadorId}`, {
    method: "post",
    //"headers" son metadatos que se envía en formato json.
    //"application/json" indica a JS que la información enviada está en formato "json"
    headers: {
      "Content-Type": "application/json",
    },
    //si hay un "headers:" debe haber un "body:", el cual debe ser enviado como cadena de texto, por eso el "body: JSON.stringify()"
    body: JSON.stringify({
      mokepon: mascotaJugador,
    }),
  });
}

function ventajaDeTipo() {
  if (TipoMokeponJugador == "Water" && TipoMokeponEnemigo == "Fire") {
    ataqueAdicional.push({ nombre: "💧", id: "boton-agua", tagname: "AGUA" });
  } else if (TipoMokeponJugador == "Fire" && TipoMokeponEnemigo == "Grass") {
    ataqueAdicional.push({ nombre: "🔥", id: "boton-fuego", tagname: "FUEGO" });
  } else if (TipoMokeponJugador == "Grass" && TipoMokeponEnemigo == "Fliying") {
    ataqueAdicional.push({
      nombre: "🍃",
      id: "boton-planta",
      tagname: "PLANTA",
    });
  } else if (
    TipoMokeponJugador == "Fliying" &&
    TipoMokeponEnemigo == "Poison"
  ) {
    ataqueAdicional.push({
      nombre: "🌀",
      id: "boton-viento",
      tagname: "VIENTO",
    });
  } else if (TipoMokeponJugador == "Poison" && TipoMokeponEnemigo == "Water") {
    ataqueAdicional.push({
      nombre: "🦠",
      id: "boton-veneno",
      tagname: "VENENO",
    });
  } else {
  }
}

//Se crea la variable interna "let ataques" y se genera una "pequeña iteracion interna" o "loop" (por medio de "for") para buscar el id (guardado en la "let mascotaJugador") que coincide con los mokepones creados(es decir, vamos a extraer el nombre del mokepon para buscar los ataques que tiene).
function extraerAtaques(mascotaJugador) {
  let ataques;
  //Esta estructura "for" va a iterar dentro de cada elemento creado en el arreglo (la diferencia es que crea una pequeña variable "i" y por cada iteración inccrementa un valor "i++")
  // inicia con valor = 0 (como inicia el indice de un arreglo) y va incrementando un valor "i++"
  //  "mokepones.length" es el arreglo que se va a iterar (mientras "i" sea menor que la longitud "length" del arreglo continua realizando la acción que se le indique en {} hasta llegar al valor total del "length" del arreglo (ahí termina)).
  //Esto le asignara a "let ataques" el valor del arreglo que contiene los ataques del mokepon seleccionado (por ejemplo "ratigueya.ataques")
  //la condicion "if (mascotaJugador === mokepones[i].nombre)" es que cuando el id del mokepon seleccionado coincida con el ".nombre" del arreglo "mokepones[i]" entonces... llame a los ataques del mokepon elegido "{ataques = mokepones[i].ataques}"
  for (let i = 0; i < mokepones.length; i++) {
    if (mascotaJugador === mokepones[i].nombre) {
      ataques = mokepones[i].ataques;
    }
  }
}

//"ataques.forEach" busca dentro del arreglo de ataques según el Mokepon seleccionado y realiza las acciones dentro de los "{}", es de destacar que "((ataque))" es una variable que se crea para este metodo.
function mostrarAtaques(ataques) {
  //De este metodo puedo entender que da la orden de buscar dentro del arreglo de ataques (el cual se llama con la "let mostrarAtaques", la cual está llamando al mokepon seleccionado "function extraerAtaques(mascotaJugador)" y le asigna esas propiedades a la nueva variable "ataque", por eso se llama dentro del ".forEach" a "ataque.id o .nombre" y no a la "let" o "function")
  ataques.forEach((ataque) => {
    //Un elemento puede tener dos clases
    ataquesMokepon = `
     <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>
     `;
    tarjetaDeAtaques.innerHTML += ataquesMokepon;
  });

  //Estas lineas de codigo se mueven hasta esta parte porque aún no han sido creadas en el código de HTML (ver explicación del primer ".forEach")
  botonFuego = document.getElementById("boton-fuego");
  botonAgua = document.getElementById("boton-agua");
  botonPlanta = document.getElementById("boton-planta");
  botonVeneno = document.getElementById("boton-veneno");
  botonViento = document.getElementById("boton-viento");
  //"document.querySelectorAll("")" selecciona todos los elementos con una caracteristica en común (para este caso, la misma class")*NO se recomienda crear elementos con el mismo id*
  botones = document.querySelectorAll(".BAtaque");

  secuenciaAtaque();
}

function secuenciaAtaque() {
  //Esta función genera un validación "if" el contenido de texto del elemento seleccionado (con un click) es "=== 🔥" entonces haz un ".push" de la propiedad "FUEGO" al arreglo de ataqueJugador, muestra en console el botón seleccionado y cambia el color de fondo del botón. así mismo para 💧 y 🍃
  botones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      if (e.target.textContent === "🔥") {
        ataqueJugador.push("FUEGO");
        console.log(ataqueJugador);
        boton.style.background = "#122f58";
        boton.disabled = true;
      } else if (e.target.textContent === "💧") {
        ataqueJugador.push("AGUA");
        console.log(ataqueJugador);
        boton.style.background = "#122f58";
        boton.disabled = true;
      } else if (e.target.textContent === "🦠") {
        ataqueJugador.push("VENENO");
        console.log(ataqueJugador);
        boton.style.background = "#122f58";
        boton.disabled = true;
      } else if (e.target.textContent === "🌀") {
        ataqueJugador.push("VIENTO");
        console.log(ataqueJugador);
        boton.style.background = "#122f58";
        boton.disabled = true;
      } else {
        ataqueJugador.push("PLANTA");
        console.log(ataqueJugador);
        boton.style.background = "#122f58";
        boton.disabled = true;
      }
      if (ataqueJugador.length === 5) {
        enviarAtaques();
      }
    });
  });
}

function enviarAtaques() {
  fetch(`http://192.168.1.15:8080/mokepon/${jugadorId}/ataques`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ataques: ataqueJugador,
    }),
  });

  intervalo = setInterval(obtenerAtaques, 50);
}

function obtenerAtaques() {
  fetch(`http://192.168.1.15:8080/mokepon/${enemigoId}/ataques`).then(function (
    res
  ) {
    if (res.ok) {
      res.json().then(function ({ ataques }) {
        if (ataques.length === 5) {
          ataqueEnemigo = ataques;
          combate();
        }
      });
    }
  });
}

//Se toma la longitud "length" del arreglo de mokepones para poder automatizar el proceso de seleccion de Mokepon en caso de que se creen más elementos (también se cambia el valor inicial de 1 por 0 y se agrega un -1 al final para que la ecuación pase por 0,1,2 como cuenta el arreglo "indice")
function seleccionarMascotaEnemigo(enemigo) {
  // let enemigoAleatorio = aleatorio(0,mokepones.length -1)
  //Este codigo reemplaza a la validación de condicionales "if,else if y else" y funciona de la siguiente forma:
  //Dentro del arreglo "mokepones", se va a ejecutar la "let enemigoAleatorio", la cual (para este caso, devuelve un numero entre el 0 y el 5, como están contabilizados dentro del indice los elementos del arreglo). Por último, la "const spanMascotaEnemigo" busca el elemento a modificar (dentro del HTML) por su id, por lo que es necesario que luego de elegir el elemento dentro del arreglo, nos devuelva su propiedad ".nombre"
  spanMascotaEnemigo.innerHTML = enemigo.nombre;
  TipoMokeponEnemigo = enemigo.tipo;

  ataquesMokeponEnemigo = enemigo.ataques;
  ventajaDeTipo();
  mostrarAtaques(ataqueAdicional);
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function ataqueAleatorioEnemigo(enemigo) {
  console.log("Ataques del enemigo", ataquesMokeponEnemigo);
  let ataqueAleatorio = aleatorio(0, ataquesMokeponEnemigo.length - 1);

  if (ataqueAleatorio == 0) {
    ataqueEnemigo.push(ataquesMokeponEnemigo[0].tagname),
      ataquesMokeponEnemigo.splice(0, 1);
  } else if (ataqueAleatorio == 1) {
    ataqueEnemigo.push(ataquesMokeponEnemigo[1].tagname),
      ataquesMokeponEnemigo.splice(1, 1);
  } else if (ataqueAleatorio == 2) {
    ataqueEnemigo.push(ataquesMokeponEnemigo[2].tagname),
      ataquesMokeponEnemigo.splice(2, 1);
  } else if (ataqueAleatorio == 3) {
    ataqueEnemigo.push(ataquesMokeponEnemigo[3].tagname),
      ataquesMokeponEnemigo.splice(3, 1);
  } else {
    ataqueEnemigo.push(ataquesMokeponEnemigo[4].tagname),
      ataquesMokeponEnemigo.splice(4, 1);
  }
  console.log(ataqueEnemigo);

  iniciarPelea();
}

function iniciarPelea() {
  if (ataqueJugador.length === 5) {
    combate();
  }
}

function indexAmbosOponentes(jugador, enemigo) {
  indexAtaqueJugador = ataqueJugador[jugador];
  indexAtaqueEnemigo = ataqueEnemigo[enemigo];
}

function combate() {
  clearInterval(intervalo);

  for (let index = 0; index < ataqueJugador.length; index++) {
    if (ataqueJugador[index] === ataqueEnemigo[index]) {
      indexAmbosOponentes(index, index);
      resultado = "EMPATE 😬😬";
    } else if (
      (ataqueJugador[index] == "AGUA" && ataqueEnemigo[index] == "FUEGO") ||
      (ataqueJugador[index] == "AGUA" && ataqueEnemigo[index] == "VIENTO") ||
      (ataqueJugador[index] == "FUEGO" && ataqueEnemigo[index] == "PLANTA") ||
      (ataqueJugador[index] == "FUEGO" && ataqueEnemigo[index] == "VENENO") ||
      (ataqueJugador[index] == "PLANTA" && ataqueEnemigo[index] == "AGUA") ||
      (ataqueJugador[index] == "PLANTA" && ataqueEnemigo[index] == "VIENTO") ||
      (ataqueJugador[index] == "VIENTO" && ataqueEnemigo[index] == "VENENO") ||
      (ataqueJugador[index] == "VIENTO" && ataqueEnemigo[index] == "FUEGO") ||
      (ataqueJugador[index] == "VENENO" && ataqueEnemigo[index] == "PLANTA") ||
      (ataqueJugador[index] == "VENENO" && ataqueEnemigo[index] == "AGUA")
    ) {
      indexAmbosOponentes(index, index);
      resultado = "GANASTE 😎";
      victoriasJugador++;
      spanVidasJugador.innerHTML = victoriasJugador;
    } else {
      indexAmbosOponentes(index, index);
      resultado = "PERDISTE 🫥";
      victoriasEnemigo++;
      spanVidasEnemigo.innerHTML = victoriasEnemigo;
    }
    crearMensaje();
  }
  contarVidas();
}

function contarVidas() {
  if (victoriasJugador == victoriasEnemigo) {
    alert("Jumm... EMPATE!! 😬😬");
    crearMensajeFinal("Noo..!! EMPATE!! 😬😬");
  } else if (victoriasJugador > victoriasEnemigo) {
    alert("Que bendiciooon!! GANASTE!! 🤩");
    crearMensajeFinal("FELICITACIONES!! GANASTE🤩");
  } else {
    alert("Que gonorrea..!! PERDISTE!! 🫥");
    crearMensajeFinal("Paila!! PERDISTE!! 🫥");
  }
}

function crearMensaje() {
  let nuevoAtaqueDelJugador = document.createElement("p");
  let nuevoAtaqueDelEnemigo = document.createElement("p");
  let resultadoJugador;
  let resultadoEnemigo;
  if (resultado == "EMPATE 😬😬") {
    resultadoJugador = "🟡";
    resultadoEnemigo = "🟡";
  } else if (resultado == "GANASTE 😎") {
    resultadoJugador = "✅";
    resultadoEnemigo = "❌";
  } else {
    resultadoJugador = "❌";
    resultadoEnemigo = "✅";
  }

  sectionMensajes.innerHTML = resultado;
  nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador + resultadoJugador;
  nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo + resultadoEnemigo;
  ataquesDelJugador.appendChild(nuevoAtaqueDelJugador);
  ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo);
}

function crearMensajeFinal(resultadoFinal) {
  seccionReiniciar.style.display = "block";

  sectionMensajes.innerHTML = resultadoFinal;
}

function reiniciarJuego() {
  location.reload();
}

function pintarCanvas() {
  mascotaJugadorObjeto.x =
    mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX;
  mascotaJugadorObjeto.y =
    mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY;
  //".clearReact" limpia el rastro dejado de las antiguas posiciones del Mokepon.
  lienzo.clearRect(0, 0, mapa.width, mapa.height);
  lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height);
  mascotaJugadorObjeto.pintarMokepon();

  enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y);

  mokeponesEnemigos.forEach(function (mokepon) {
    if (mokepon != undefined) {
      mokepon.pintarMokepon();
      revisarColision(mokepon);
    }
  });

  // if (mascotaJugadorObjeto.velocidadX !== 0 || mascotaJugadorObjeto.velocidadY !== 0) {
  //     revisarColision(hipodogeEnemigo)
  //     revisarColision(capipepoEnemigo)
  //     revisarColision(ratigueyaEnemigo)
  //     revisarColision(langostelvisEnemigo)
  //     revisarColision(pydosEnemigo)
  //     revisarColision(tucapalmaEnemigo)
  // }
}

function enviarPosicion(x, y) {
  fetch(`http://192.168.1.15:8080/mokepon/${jugadorId}/posicion`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      x,
      y,
    }),
  }).then(function (res) {
    if (res.ok)
      res.json().then(function ({ enemigos }) {
        console.log(enemigos);
        mokeponesEnemigos = enemigos.map(function (enemigo) {
          if (enemigo.mokepon != undefined) {
            let mokeponEnemigo = null;
            const mokeponNombre = enemigo.mokepon.nombre || "";
            if (mokeponNombre === "Hipodoge") {
              mokeponEnemigo = new Mokepon(
                "Hipodoge",
                "./Assets/mokepons_mokepon_hipodoge_attack.png",
                5,
                "Water",
                "./assets/hipodoge.png",
                enemigo.id
              );
            } else if (mokeponNombre === "Capipepo") {
              mokeponEnemigo = new Mokepon(
                "Capipepo",
                "./Assets/mokepons_mokepon_capipepo_attack.png",
                5,
                "Grass",
                "./assets/capipepo.png",
                enemigo.id
              );
            } else if (mokeponNombre === "Ratigueya") {
              mokeponEnemigo = new Mokepon(
                "Ratigueya",
                "./Assets/mokepons_mokepon_ratigueya_attack.png",
                5,
                "Fire",
                "./assets/ratigueya.png",
                enemigo.id
              );
            } else if (mokeponNombre === "Pydos") {
              mokeponEnemigo = new Mokepon(
                "Pydos",
                "./Assets/mokepons_mokepon_pydos_attack.png",
                5,
                "Poison",
                "./assets/pydos.png",
                enemigo.id
              );
            } else if (mokeponNombre === "Tucapalma") {
              mokeponEnemigo = new Mokepon(
                "Tucapalma",
                "./Assets/mokepons_mokepon_tucapalma_attack.png",
                5,
                "Fliying",
                "./assets/tucapalma.png",
                enemigo.id
              );
            } else if (mokeponNombre === "Langostelvis") {
              mokeponEnemigo = new Mokepon(
                "Langostelvis",
                "./Assets/mokepons_mokepon_langostelvis_attack.png",
                5,
                "Fire",
                "./assets/langostelvis.png",
                enemigo.id
              );
            }
            mokeponEnemigo.x = enemigo.x;
            mokeponEnemigo.y = enemigo.y;

            return mokeponEnemigo;
          }
        });
      });
  });
}

function moverDerecha() {
  mascotaJugadorObjeto.velocidadX = 5;
}
function moverIzquierda() {
  mascotaJugadorObjeto.velocidadX = -5;
}
function moverArriba() {
  mascotaJugadorObjeto.velocidadY = -5;
}
function moverAbajo() {
  mascotaJugadorObjeto.velocidadY = 5;
}

function detenerMovimiento() {
  mascotaJugadorObjeto.velocidadX = 0;
  mascotaJugadorObjeto.velocidadY = 0;
}

//el evento ".eventListener" pueden retornar un "event", el cual es un objeto, que puede decir qué tecla se precionó, el valor de un input, entre otros.
//(Para este caso se crea un "console.log" para revisar "event.key" y saber cuál tecla se está presionando)
function sePresionoUnaTecla(event) {
  //"switch(key)" es una manera de juntar varios "if" según los casos.
  //console.log(event.key)
  //(event.key) hace referencia a la tecla que se presionó. por lo que el "value" de cada "case" debe ser la tecla presionada (ArrowUp, ArrowDown, etc.)
  //"break" detiene la ejecución (de la función) para que no se ejecute a la par con otro caso.
  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "W":
      moverArriba();
      break;
    case "ArrowDown":
      moverAbajo();
      break;
    case "ArrowLeft":
      moverIzquierda();
      break;
    case "ArrowRight":
      moverDerecha();
      break;
    default:
      break;
  }
}

function iniciarMapa() {
  // mapa.width = 640
  // mapa.height = 480
  mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador);
  console.log(mascotaJugadorObjeto, mascotaJugador);
  //este eveneto se activa al presionar una tecla "keydown". La function "sePresionoUnaTecla" es un switch que valida cuál tecla fue presionada para indicar las acciones.
  intervalo = setInterval(pintarCanvas, 50);
  window.addEventListener("keydown", sePresionoUnaTecla);
  //este eveneto se activa al soltar una tecla "keyup"
  window.addEventListener("keyup", detenerMovimiento);
}

function obtenerObjetoMascota() {
  for (let i = 0; i < mokepones.length; i++) {
    if (mascotaJugador === mokepones[i].nombre) {
      return mokepones[i];
    }
  }
}

//Se designa como parametro el "objeto = enemigo" por los diferentes enemigos (para saber con cual se hace la comparación)
function revisarColision(enemigo) {
  //Este "if" soluciona el bug de que apenas ingresa el segundo jugador notifique una colición por no tener las coordenadas aún (son asincronas)
  if (enemigo.x == undefined || enemigo.y == undefined) {
    return;
  }
  //Estas "const" permiten identificar la posición exacta del enemigo, según los puntos cardinales (enemigo.y + enemigo.alto = a el punto donde empieza a dibujarse el enemigo, hasta el punto donde termina de dibujarse)
  const arribaEnemigo = enemigo.y;
  const abajoEnemigo = enemigo.y + enemigo.alto;
  const derechaEnemigo = enemigo.x + enemigo.ancho;
  const izquierdaEnemigo = enemigo.x;

  const arribaMascota = mascotaJugadorObjeto.y;
  const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto;
  const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho;
  const izquierdaMascota = mascotaJugadorObjeto.x;

  if (
    abajoMascota < arribaEnemigo ||
    arribaMascota > abajoEnemigo ||
    derechaMascota < izquierdaEnemigo ||
    izquierdaMascota > derechaEnemigo
  ) {
    return;
  }

  detenerMovimiento();
  clearInterval(intervalo);
  alert(
    "Ohhhh!! Te has topado con un " +
      enemigo.nombre +
      " enemigo!!" +
      " A Luchaaaaaar!!"
  );

  enemigoId = enemigo.id;
  seccionSeleccionarAtaque.style.display = "flex";
  sectionVerMapa.style.display = "none";
  seleccionarMascotaEnemigo(enemigo);
}

window.addEventListener("load", iniciarJuego);
