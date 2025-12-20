document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     MENÚ MÓVIL
  ========================= */
  const btn = document.getElementById('btnMenu');
  const nav = document.getElementById('mainNav');
  const mainNavigation = document.querySelector('.main-navigation');

  if (btnMenu && mainNav) {
    btnMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      mainNav.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !btnMenu.contains(e.target)) {
        mainNav.classList.remove('open');
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
        if (mainNav?.classList.contains('open')) {
          mainNav.classList.remove('open');
        }
        
        // Calcular posición con offset para header sticky
        const topbarHeight = document.querySelector('.topbar')?.offsetHeight || 0;
        const navHeight = mainNavigation?.classList.contains('scrolled') 
          ? mainNavigation.offsetHeight 
          : 0;

        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - (topbarHeight + navHeight);

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
    
    const updateNavOnScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 50) {
        mainNavigation.classList.add('scrolled');
      } else {
        mainNavigation.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', updateNavOnScroll);
    updateNavOnScroll(); // Inicializar estado
  }
  
  /* =========================
     AÑO AUTOMÁTICO FOOTER
  ========================= */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* =========================
     NEWSLETTER
  ========================= */
  const newsletterForm = document.querySelector('.newsletter form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput?.value) {
        alert('¡Gracias por suscribirte! Te mantendremos informado de nuestras novedades.');
        newsletterForm.reset();
      }
    });
  }

  /* =========================
     ANIMACIÓN PARA CARDS AL SCROLL
  ========================= */
  const cards = document.querySelectorAll('.card');
  if (cards.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 100);
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => observer.observe(card));
  }

});




