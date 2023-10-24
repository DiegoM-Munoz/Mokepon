//Se importa "express.js" para usarlo dentro del proyecto.
const express = require("express");
//Se debe instalar esta librería desde NPM (En la terminal activar código "npm install cors" para descargarla y llamarla por medio de la "const cors = require("cors")). Esta 'librería' se instala para evitar problemas de "Access-Control-Allow-Origin".
const cors = require("cors");

//Se crea una aplicación con "express.js".
const app = express();

//"express.static('')" se usa para 'servir' archivos estaticos (HTML, CSS, imagenes, etc.).
//se asigna una carpeta (public) en la cual se van a "meter" todos los archivos 'estaticos' para poder ingresar al frontend de la aplicación desde el servidor de nodejs
app.use(express.static("public"));
//aquí se llama como función "cors()".
app.use(cors());
//Para trabajar con peticiones tipo post (recibir datos enviados por los usuarios), se debe activar la function "app.use(express.json())" para que soporte archivos tipo "json" como parte de su cuerpo.
app.use(express.json());

const jugadores = [];

class Jugador {
  constructor(id) {
    this.id = id;
  }

  asignarMokepon(mokepon) {
    this.mokepon = mokepon;
  }

  actualizarPosicion(x, y) {
    this.x = x;
    this.y = y;
  }

  asignarAtaques(ataques) {
    this.ataques = ataques;
  }
}

class Mokepon {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

//Se indica que cuando "express.js" reciba una petición responda con "id" aleatorio.
app.get("/unirse", (req, res) => {
  const id = `${Math.random()}`;

  const jugador = new Jugador(id);

  jugadores.push(jugador);
  //".setHeader" es una "cabecera" que se usa para indicar qué tipos de solicitudes se pueden aceptar (en este caso se permite hacer peticiones desde cualquier origen "*")
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.send(id);
});

app.post("/mokepon/:jugadorId", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const nombre = req.body.mokepon || "";
  const mokepon = new Mokepon(nombre);

  //".findIndex" busca dentro del arreglo "jugadores[]" el que cumpla (para este caso con el "jugador.id") y nos devuelve su número de indice (si no existe devuelve valor igual a -1).
  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugadorId === jugador.id
  );
  //Con esta validación, luego de identificar que encontramos al "jugadorId(es enviado dentro de la URL) === jugador.Id" asignamos el mokepon a la posición del index donde se encuentra el jugador (const jugadorIndex).
  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarMokepon(mokepon);
  }
  console.log(jugadores);
  console.log(jugadorId);
  res.end();
});

//Estas direcciones son inventadas (puede llamarse *posiciondelmokepon* o hasta *yuca*)
app.post("/mokepon/:jugadorId/posicion", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const x = req.body.x || 0;
  const y = req.body.y || 0;

  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugadorId === jugador.id
  );

  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].actualizarPosicion(x, y);
  }

  //".filter" filtra a todos los jugadores (menos el "jugador.id") para tener la lista de enemigos.
  const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id);

  res.send({
    enemigos,
  });
});

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const ataques = req.body.ataques || [];

  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugadorId === jugador.id
  );

  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarAtaques(ataques);
  }
  res.end();
});

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const jugador = jugadores.find((jugador) => jugador.id === jugadorId);
  res.send({
    ataques: jugador.ataques || [],
  });
});

//Escucha continuamente.
app.listen(8080, () => {
  console.log("Servidor funcionando");
});
