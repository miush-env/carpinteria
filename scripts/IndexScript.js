const header = document.querySelector('.header-nav-bar');
const toggle = document.querySelector('.menu-toggle');

toggle.addEventListener('click', () => {
	header.classList.toggle('active');
})

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
const $captionTop = document.querySelector('.welcome-art-services span')
getData(art_services).then(data => {
  $captionTop.textContent = data.caption_top;
  document.querySelector('.welcome-art-services h2').innerHTML = data.title;
  document.querySelector('.welcome-art-services p').innerHTML = data.description;
});

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
      <a href="/service.html#${service.section_page}">Leer mas</a>
        <a target="_blank" href="https://wa.me/541134229643?text=${service.ms_whatsapp}">Contratar</a>
      </div>
    
    `;
    $servicesContainer.appendChild(serviceDiv);
  });
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
  if (e.target.closest('.review')) {
    paused = !paused;
    $reviewsContainer.style.animationPlayState = paused ? 'paused' : 'running';
  }
  
});



// * Article Work Done
getData(art_projects).then(data => {
  const $workList = document.querySelector('.works-list');

  data.projects.forEach(project => {
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
              <time class="author-date" datetime="${project.launch}">${project.launch}</time>
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
});

