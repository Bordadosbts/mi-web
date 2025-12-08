document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     MENÚ MÓVIL
  ========================= */
  const btn = document.getElementById('btnMenu');
  const nav = document.getElementById('mainNav');

  if (btn && nav) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove('open');
      }
    });
  }

  /* =========================
     CAROUSEL SIMPLE (SOLO SI EXISTEN SLIDES)
  ========================= */
  const slides = document.querySelectorAll('.slide');

  if (slides.length > 1) {
    let idx = 0;

    const show = (i) => {
      slides.forEach((s, n) => {
        s.classList.toggle('active', n === i);
      });
    };

    setInterval(() => {
      idx = (idx + 1) % slides.length;
      show(idx);
    }, 6000);
  }

  /* =========================
     AÑO AUTOMÁTICO FOOTER
  ========================= */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* =========================
     NEWSLETTER (SIMULADO)
  ========================= */
  const form = document.querySelector('.newsletter form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Gracias! Te hemos agregado a la lista.');
      form.reset();
    });
  }

});
