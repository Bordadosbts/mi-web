document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     MENÚ MÓVIL
  ========================= */
  const btn = document.getElementById('btnMenu');
  const nav = document.getElementById('mainNav');
  const mainNavigation = document.querySelector('.main-navigation');

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
     SCROLL SUAVE
  ========================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Solo procesar enlaces internos que no sean solo "#"
      if (href === '#' || href === '#0') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        // Cerrar menú móvil si está abierto
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
        }
        
        // Calcular posición con offset para header sticky
        const headerHeight = mainNavigation ? mainNavigation.offsetHeight + 36 : 100;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* =========================
     MOSTRAR/OCULTAR NAVEGACIÓN STICKY
  ========================= */
  /* VERSIÓN MEJORADA - Umbral dinámico */
if (mainNavigation) {
  const heroSection = document.querySelector('.hero-header');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const heroHeight = heroSection ? heroSection.offsetHeight : 400;
    
    // Mostrar navegación cuando se sale del hero (70% del hero)
    if (scrollTop > heroHeight * 0.7) {
      mainNavigation.classList.add('scrolled');
    } else {
      mainNavigation.classList.remove('scrolled');
    }
  });

  // Inicializar
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const heroHeight = heroSection ? heroSection.offsetHeight : 400;
  if (scrollTop > heroHeight * 0.7) {
    mainNavigation.classList.add('scrolled');
  }
}
  
  /* =========================
     AÑO AUTOMÁTICO FOOTER
  ========================= */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* =========================
     NEWSLETTER
  ========================= */
  const form = document.querySelector('.newsletter form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        // Simular envío exitoso
        alert('¡Gracias por suscribirte! Te mantendremos informado de nuestras novedades.');
        form.reset();
      }
    });
  }

  /* =========================
     ANIMACIÓN PARA CARDS AL SCROLL
  ========================= */
  const cards = document.querySelectorAll('.card');
  
  if (cards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Añadir delay escalonado para cada card
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
      observer.observe(card);
    });
  }

});

