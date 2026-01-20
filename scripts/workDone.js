const container = document.getElementById('render_data')

const params = new URLSearchParams(window.location.search)
const projectId = Number(params.get('id'))
let REAL_IMAGES = 0; 

fetch('/dataPages/Projects/projects.json')
.then((res) => res.json())
.then((data) => {
  const project = data.projects.find((p) => p.id === projectId)

  if (!project) {
    container.innerHTML =
      '<h1 style="margin-top: 3rem;">Proyecto no encontrado</h1>'
    return
  }

  document.querySelector('.front_page').src = project.image_bank[0]
  document.querySelector('.cont-info-work h1').textContent = project.name
  document.querySelector('.name_foreman').textContent =
    project.data_Foreman.name

  const tagsMap = {
    duration: project.tags.duration,
    service: project.tags.service,
    assistants: project.tags.assistants,
    foremanName: project.data_Foreman.name,
  }

  document.querySelectorAll('.underlined').forEach((el) => {
    const key = el.dataset.key
    el.textContent = tagsMap[key] ?? '-'
  })

  document.querySelector('.service-description').innerHTML = project.description

  const imagesHTML = project.image_bank
    .map(
      (imgSrc) =>
        `<img src="${imgSrc}" alt="${project.name}" />`
    )
    .join('')

  document.querySelector('.track').innerHTML = imagesHTML
  document.querySelector('.track').innerHTML += imagesHTML

  const images = document.querySelectorAll('.track img');
  REAL_IMAGES = images.length / 2; 

  indicators.innerHTML = '';
  for (let i = 0; i < REAL_IMAGES; i++) {
    const dot = document.createElement('div');
    if (i === 0) dot.classList.add('active');
    indicators.appendChild(dot);
  }
   
  images.forEach(img => {
    img.addEventListener('click', () => {
      openModal(img.src);
    });
    
  });

  syncIndicator();
})

// ========================================================== \\
const track = document.querySelector('.track');
const indicators = document.getElementById('indicators');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const close = document.getElementById('close');

// const DURATION = 30000; // ⬅️ MISMO tiempo que el animation CSS (20s)
const DURATION = window.matchMedia('(max-width: 768px)').matches
  ? 20000
  : 30000;


let current = 0;

function syncIndicator() {
 if (!REAL_IMAGES) return;

  const now = performance.now() % DURATION;
  const progress = now / DURATION;
  const index = Math.floor(progress * REAL_IMAGES);

  if (index !== current) {
    indicators.children[current].classList.remove('active');
    indicators.children[index].classList.add('active');
    current = index;
  }

  requestAnimationFrame(syncIndicator);
}

/* Modal */
function isModalOpen() {
  return modal.style.display === 'flex';
}

function openModal(src) {
  modalImg.src = src;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!isModalOpen()) return;

  modal.style.display = 'none';
  document.body.style.overflow = '';
}

close.onclick = () => closeModal();

document.addEventListener("keydown", (e) => {
  if (!isModalOpen()) return;

  if (
    e.key === "Escape" ||
    e.key === "Enter" ||
    e.key === "Backspace"
    
  ) {
    
    closeModal()
  }
});

modal.onclick =  e => {
  if (!isModalOpen()) return;
  if (e.target === modal) closeModal();
};

// menu desplegable
