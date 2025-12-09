document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     MENÚ MÓVIL (para navegación sticky)
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
     SCROLL SUAVE PARA ENLACES INTERNOS
  ========================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Cerrar menú móvil si está abierto
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
        }
        
        // Scroll suave
        window.scrollTo({
          top: targetElement.offsetTop - 100, // Ajuste para header sticky
          behavior: 'smooth'
        });
      }
    });
  });

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
        // Aquí normalmente enviarías los datos a un servidor
        // Por ahora solo mostramos un mensaje
        alert('¡Gracias por suscribirte! Te hemos agregado a nuestra lista de novedades.');
        form.reset();
      } else {
        alert('Por favor, introduce un email válido.');
      }
    });
  }

  /* =========================
     EFECTO SCROLL PARA NAVEGACIÓN STICKY
  ========================= */
  const mainNavigation = document.querySelector('.main-navigation');
  
  if (mainNavigation) {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Mostrar/ocultar navegación sticky según scroll
      if (scrollTop > 300) { // Después de pasar el hero
        mainNavigation.style.opacity = '1';
        mainNavigation.style.visibility = 'visible';
        mainNavigation.style.transform = 'translateY(0)';
      } else {
        mainNavigation.style.opacity = '0';
        mainNavigation.style.visibility = 'hidden';
        mainNavigation.style.transform = 'translateY(-20px)';
      }
      
      // Efecto de esconder al hacer scroll hacia abajo
      if (scrollTop > lastScrollTop && scrollTop > 400) {
        // Scroll hacia abajo - esconder
        mainNavigation.style.transform = 'translateY(-100%)';
      } else {
        // Scroll hacia arriba - mostrar
        mainNavigation.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    });
  }

  /* =========================
     ANIMACIÓN PARA CARDS AL SCROLL
  ========================= */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observar todas las cards
  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });

  /* =========================
     CONTADOR DE PRODUCTOS (opcional, para engagement)
  ========================= */
  const updateProductCounts = () => {
    const countElements = document.querySelectorAll('.product-count');
    
    if (countElements.length > 0) {
      // Simular que tenemos X productos vendidos hoy
      const todayCount = Math.floor(Math.random() * 15) + 5;
      
      countElements.forEach(element => {
        element.textContent = todayCount;
      });
    }
  };

  // Actualizar cada 30 segundos (solo si hay elementos)
  if (document.querySelector('.product-count')) {
    updateProductCounts();
    setInterval(updateProductCounts, 30000);
  }

});
