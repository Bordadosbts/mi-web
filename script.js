document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     MENÚ MÓVIL
  ========================= */
  const btn = document.getElementById('btnMenu');
  const nav = document.getElementById('mainNav');

  if (btn && nav) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open'); // ✅ AHORA SÍ SE ABRE
    });

    // cerrar menú al clicar fuera
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove('open');
      }
    });
  }

  /* =========================
     CAROUSEL DE SLIDES
  ========================= */
  const carousel = document.getElementById('carousel');

  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');

    let idx = slides.findIndex(s => s.classList.contains('active'));
    if (idx === -1) idx = 0;

    const show = (i) => {
      slides.forEach((s, n) => {
        s.classList.toggle('active', n === i);
      });
    };

    const go = (n) => {
      idx = (n + slides.length) % slides.length;
      show(idx);
    };

    if (prev) prev.addEventListener('click', () => go(idx - 1));
    if (next) next.addEventListener('click', () => go(idx + 1));

    // auto rotación
    setInterval(() => go(idx + 1), 6000);
  }

  /* =========================
     AÑO AUTOMÁTICO
  ========================= */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* =========================
     NEWSLETTER (SIMULADO)
  ========================= */
  const form = document.getElementById('formNewsletter');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Gracias! Te hemos agregado a la lista.');
      form.reset();
    });
  }

});
