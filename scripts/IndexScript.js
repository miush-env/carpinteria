const header = document.querySelector('.header-nav-bar');
const toggle = document.querySelector('.menu-toggle');  
const links = document.querySelectorAll('.nav-bar a');

// Abrir/cerrar menú al hacer click en el toggle
toggle.addEventListener('click', () => {
  if (window.innerWidth > 899) return; // solo mobile
  header.classList.toggle('active');
});

// Cerrar menú al hacer click en un link
links.forEach(link =>
  link.addEventListener('click', () => {
    header.classList.remove('active');
  })
);

// Cerrar menú al hacer scroll (solo mobile)
window.addEventListener('scroll', () => {
  if (window.innerWidth > 899) return;
  if (header.classList.contains('active')) {
    header.classList.remove('active');
  }
});

// Cerrar menú al hacer swipe hacia arriba (solo mobile)
let touchStartY = 0;
const minSwipeDistance = 30;

document.addEventListener('touchstart', (e) => {
  if (window.innerWidth > 899) return;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (window.innerWidth > 899) return;
  const touchEndY = e.changedTouches[0].clientY;
  const distance = touchStartY - touchEndY;
  if (distance > minSwipeDistance && header.classList.contains('active')) {
    header.classList.remove('active');
  }
}, { passive: true });


// ! DataBase Local Json
const art_welcome = '/dataPages/Home/art_welcome.json';
const art_services = '/dataPages/Home/art_services.json';
const art_about_we = '/dataPages/Home/art_about_we.json'
const art_reviews = '/dataPages/Home/art_reviews.json';
const art_projects = '/dataPages/Projects/projects.json'

// Function to fetch and display data
const getData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data
  }
  catch (error) {
    console.log('Error fetching artwork data:', error);
  }
}

// * Article Welcome 
const $video = document.querySelector('#video');

getData(art_welcome).then(data => {
  $video.src = data.video;
  document.querySelector('.title').innerHTML = data.title;
  document.querySelector('.brand-title').textContent = data.brand;
  document.querySelector('.description-welcome').innerHTML = data.description;

});

// * Article About Services
const $servicesContainer = document.querySelector('.sect-services');

getData(art_services).then(data => {
  data.services.forEach(service => {
    const serviceDiv = document.createElement('div');
    serviceDiv.classList.add('service');

    serviceDiv.innerHTML = `
      <img src="${service.icon}" alt="${service.title} Icon" />
      <h3>${service.title}</h3>
      <p>${service.description}</p>

      <div>
        <a href="/servicePage.html?id=${service.id}">Leer más</a>
        <a 
          target="_blank"
          href="https://wa.me/541134229643?text=${encodeURIComponent(service.ms_whatsapp)}"
        >
          Contratar
        </a>
      </div>
    `;

    $servicesContainer.appendChild(serviceDiv);
  });
  
  document.querySelector('.welcome-art-services span').innerHTML = data.caption_top
  document.querySelector('.welcome-art-services h2').innerHTML = data.title
  document.querySelector('.welcome-art-services p').innerHTML = data.description
});


// * Article about we
getData(art_about_we).then(data=> {
  document.querySelector('.art-about-we-start img').src = data.about_we_sects[0].img_url;
  document.querySelector('.art-about-we-start span').innerHTML = data.about_we_sects[0].icon;
  document.querySelector('.art-about-we-start h3').innerHTML = data.about_we_sects[0].title;
  document.querySelector('.art-about-we-start p').innerHTML = data.about_we_sects[0].description;

  document.querySelector('.art-about-we-goal img').src = data.about_we_sects[1].img_url;
  document.querySelector('.art-about-we-goal span').innerHTML = data.about_we_sects[1].icon;
  document.querySelector('.art-about-we-goal h3').innerHTML = data.about_we_sects[1].title;
  document.querySelector('.art-about-we-goal p').innerHTML = data.about_we_sects[1].description;

})

// * Article reviews
const $reviewsContainer = document.querySelector('.cont-carousel-review');

getData(art_reviews).then(data => {
  data.reviews.forEach(review => {
    const reviewDiv = document.createElement('div');
    reviewDiv.classList.add('review');
    reviewDiv.innerHTML = `
      <h4>${review.name}</h4>
      <div class="data-rate">
      <strong>Puntuación :</strong>
      ${'★'.repeat(review.rate)+ '☆'.repeat(5 - review.rate)}
      </div>
      <p>"${review.comment}"</p>
    `;
    
    $reviewsContainer.appendChild(reviewDiv);
  })
  const clone = $reviewsContainer.innerHTML;
  $reviewsContainer.innerHTML += clone;
})

let paused = false;

$reviewsContainer.addEventListener('click', e => {
   const card = e.target.closest('.review');
  if (!card) return;

  // 🔹 pausa / reanuda animación
  paused = !paused;
  $reviewsContainer.style.animationPlayState = paused ? 'paused' : 'running';

  const activeCard = $reviewsContainer.querySelector('.review.work-card-click');

  // click en la misma → quitar clase
  if (card === activeCard) {
    card.classList.remove('work-card-click');
    return;
  }

  // quitar clase a la anterior
  if (activeCard) {
    activeCard.classList.remove('work-card-click');
  }

  // agregar clase a la nueva
  card.classList.add('work-card-click');  
});

// * Article Work Done

getData(art_projects).then(data => {
  const $workList = document.querySelector('.works-list');
  const $searchInput = document.getElementById('search-work');
  const $filterButtons = document.querySelectorAll('.works-order button');

  let projects = data.projects;
  let filteredProjects = [...projects];

  function renderProjects(list) {
    $workList.innerHTML = '';

    list.forEach(project => {
      const workItem = document.createElement('li');
      workItem.classList.add('work-item');

      const image = project.image_bank?.[0] ?? 'fallback.jpg';
      const { duration, service, assistants } = project.tags ?? {};
      const foreman = project.data_Foreman ?? {};

      workItem.innerHTML = `
        <article class="work-card">
          <div class="work-image">
            <img src="${image}" width="250px" alt="${project.name}">
          </div>

          <div class="work-body">
            <ul class="work-tags">
              <li>${duration ?? ''}</li>
              <li>${assistants ?? ''}</li>
            </ul>

            <header class="work-head">
              <h5 class="work-title">${project.name}</h5>
              <span class="material-symbols-outlined" aria-hidden="true">
                arrow_outward
              </span>
            </header>

            <p class="work-desc">${project.description_card}</p>

            <figure class="work-author">
              <img src="${foreman.photo ?? ''}" alt="${foreman.name ?? ''}">
              <figcaption class="author-info">
                <h6 class="author-name">${foreman.name ?? ''}</h6>
                <time class="author-date" datetime="${project.launch}">
                  ${project.launch}
                </time>
              </figcaption>
            </figure>
          </div>
        </article>
      `;

      workItem.addEventListener('click', () => {
        window.location.href = `workDone.html?id=${project.id}`;
      });

      $workList.appendChild(workItem);
    });
  }

  // 🔍 BUSCADOR
  $searchInput.addEventListener('input', e => {
    const query = e.target.value.toLowerCase();

    filteredProjects = projects.filter(project => {
      const text = `
        ${project.name}
        ${project.description_card}
        ${project.tags?.duration}
        ${project.tags?.service}
        ${project.data_Foreman?.name}
      `.toLowerCase();

      return text.includes(query);
    });

    renderProjects(filteredProjects);
  });
  // Render inicial
  renderProjects(projects);
});


const projects = document.querySelector('.projects');
const btnLeft = document.querySelector('.carousel-btn.left');
const btnRight = document.querySelector('.carousel-btn.right');

const scrollAmount = 350;
const tolerance = 10; // ← clave

function updateCarouselButtons() {
  const atStart = projects.scrollLeft <= tolerance;

  const atEnd =
    projects.scrollLeft + projects.clientWidth >=
    projects.scrollWidth - tolerance;

  btnLeft.style.opacity = atStart ? '0' : '1';
  btnLeft.style.pointerEvents = atStart ? 'none' : 'auto';

  btnRight.style.opacity = atEnd ? '0' : '1';
  btnRight.style.pointerEvents = atEnd ? 'none' : 'auto';
}

btnRight.addEventListener('click', () => {
  projects.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  });
});

btnLeft.addEventListener('click', () => {
  projects.scrollBy({
    left: -scrollAmount,
    behavior: 'smooth'
  });
});

projects.addEventListener('scroll', updateCarouselButtons);
window.addEventListener('load', updateCarouselButtons);
window.addEventListener('resize', updateCarouselButtons);

