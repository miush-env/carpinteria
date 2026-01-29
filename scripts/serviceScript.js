
  const header = document.querySelector('.header-nav-bar');
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelectorAll('.nav-bar a');

  toggle.addEventListener('click', () => {
    header.classList.toggle('active');
  });

  links.forEach(link =>
    link.addEventListener('click', () => {
      header.classList.remove('active');
    })
  );

document.getElementById('btnBackPage').addEventListener('click', () => {
  window.history.back();
});

const SERVICE_URL = '/dataPages/Services/service.json';

// fetch genérico
const getData = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al cargar JSON');
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

// obtener id desde la URL (?id=1)
const params = new URLSearchParams(window.location.search);
const serviceId = Number(params.get('id'));

getData(SERVICE_URL).then(data => {
  if (!data || !Array.isArray(data.service)) return;

  const service = data.service.find(s => s.id === serviceId);
  if (!service) return;

  // 🔹 SELECTORES DEL HTML EXISTENTE
  const article = document.querySelector('.art-service-1');
  const title = article.querySelector('.sect-data h2');
  const paragraph = article.querySelector('.sect-data p');
  const list = article.querySelector('.list-details ul');
  const button = article.querySelector('.btn-service');
  const image = article.querySelector('.cont-img img');

  // 🔹 REEMPLAZAR CONTENIDO
  title.textContent = service.title;
  paragraph.textContent = service.description;

  list.innerHTML = '';
  service.list.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });

  image.src = service.img;
  image.alt = service.title;

  button.href = `https://wa.me/541127817096?text=${encodeURIComponent(
    'Hola, me gustaría saber más sobre el servicio de ' + service.title
  )}`;
});

