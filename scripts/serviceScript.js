
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

