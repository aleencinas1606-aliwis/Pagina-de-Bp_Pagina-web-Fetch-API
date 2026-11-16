const container = document.getElementById('cards-container');
const statusMessage = document.getElementById('status-message');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.controls button');

const BIN_ID = '6afac2a3ac6210605a8b45e8';
const DOMINIO_API = 'api.jsonbin.io';
const RUTA_API = '/v3/b/';
const API_URL = `https://${DOMINIO_API}${RUTA_API}${BIN_ID}`;

let datosCache = [];

async function obtenerDatosBP() {
  statusMessage.textContent = 'Cargando integrantes desde mi API...';
  container.innerHTML = '';

  try {
    const respuesta = await fetch(API_URL);
    const json = await respuesta.json();

    console.log('Respuesta exacta de JSONBin:', json);

    if (!respuesta.ok) {
      statusMessage.textContent = `Error de JSONBin: ${json.message || respuesta.status}`;
      return;
    }

    const contenido = json.record ? json.record : json;

    if (Array.isArray(contenido)) {
      datosCache = contenido;
    } else if (typeof contenido === 'object') {
      const primerArreglo = Object.values(contenido).find((val) => Array.isArray(val));
      datosCache = primerArreglo || [contenido];
    }

    renderizarTarjetas(datosCache);
  } catch (error) {
    statusMessage.textContent = 'Error de red al consultar JSONBin.';
    console.error('Error:', error);
  }
}

function renderizarTarjetas(lista) {
  container.innerHTML = '';

  if (!lista || lista.length === 0) {
    statusMessage.textContent = 'No se encontraron coincidencias.';
    return;
  }

  statusMessage.textContent = `Mostrando ${lista.length} integrantes de BLACKPINK`;

  lista.forEach((item) => {
    const card = document.createElement('article');
    card.classList.add('card');
    const img = document.createElement('img');
    const nombreSeguro = item.name || 'BLACKPINK';

    const fotosLocales = {
      'Jisoo': 'jisoo.jfif',
      'Jennie': 'jennie.jfif',
      'Rosé': 'rosita.jfif',
      'Lisa': 'lisa.jfif'
    };

    const urlImagen = fotosLocales[item.name] || 'https://placehold.co';

    img.setAttribute('src', urlImagen);
    img.setAttribute('alt', `Foto de ${nombreSeguro}`);


    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h3');
    title.textContent = `${item.name || 'Sin nombre'} — "${item.alias || ''}"`;

    const desc = document.createElement('p');
    desc.textContent = item.description || '';

    const species = document.createElement('p');
    species.textContent = `Rol: ${item.species || 'Idol'}`;

    const age = document.createElement('p');
    age.textContent = `Edad: ${item.age || 'N/A'} años`;

    const weakness = document.createElement('p');
    weakness.textContent = `Debilidad: ${item.weakness || 'Ninguna'}`;

    cardBody.appendChild(title);
    cardBody.appendChild(desc);
    cardBody.appendChild(species);
    cardBody.appendChild(age);
    cardBody.appendChild(weakness);

    card.appendChild(img);
    card.appendChild(cardBody);
    container.appendChild(card);
  });
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const texto = searchInput.value.trim().toLowerCase();

  const filtrados = datosCache.filter((m) =>
    (m.name && m.name.toLowerCase().includes(texto)) ||
    (m.alias && m.alias.toLowerCase().includes(texto)) ||
    (m.weakness && m.weakness.toLowerCase().includes(texto))
  );

  renderizarTarjetas(filtrados);
});

filterButtons.forEach((boton) => {
  boton.addEventListener('click', (event) => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    const botonPresionado = event.target;
    botonPresionado.classList.add('active');

    const query = botonPresionado.getAttribute('data-query');

    if (query === 'BLACKPINK' || query === 'TODAS') {
      renderizarTarjetas(datosCache);
    } else {
      const normalizar = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const filtrada = datosCache.filter(
        (m) => m.name && normalizar(m.name) === normalizar(query)
      );
      renderizarTarjetas(filtrada);
    }
  });
});

obtenerDatosBP();

