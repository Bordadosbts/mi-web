document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* =========================
     CONSTANTES Y VARIABLES GLOBALES
  ========================= */
  const btn = document.getElementById('btnMenu');
  const nav = document.getElementById('mainNav');
  const mainNavigation = document.querySelector('.main-navigation');
  const SCROLL_THRESHOLD = 300;
  const CTA_SELECTOR = '.btn, .cta, a[href*="wa.me"]';

  /* =========================
     UTILIDADES
  ========================= */
  
  // Throttle para eventos de scroll/resize
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // Validar email
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  /* =========================
     MENÚ MÓVIL - MEJORADO
  ========================= */
  if (btn && nav) {
    // Actualizar aria-expanded
    const updateAriaExpanded = () => {
      const isExpanded = nav.classList.contains('open');
      btn.setAttribute('aria-expanded', isExpanded);
      btn.setAttribute('aria-label', isExpanded ? 'Cerrar menú' : 'Abrir menú');
    };

    // Toggle menú
    const toggleMenu = (e) => {
      if (e) e.stopPropagation();
      nav.classList.toggle('open');
      updateAriaExpanded();
      
      // Bloquear scroll cuando el menú está abierto
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    };

    // Cerrar menú
    const closeMenu = () => {
      nav.classList.remove('open');
      updateAriaExpanded();
      document.body.style.overflow = '';
    };

    // Event listeners
    btn.addEventListener('click', toggleMenu);
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && 
          !nav.contains(e.target) && 
          !btn.contains(e.target)) {
        closeMenu();
      }
    });

    // Cerrar con Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        btn.focus(); // Devolver foco al botón
      }
    });

    // Cerrar al hacer scroll en móviles
    window.addEventListener('scroll', throttle(() => {
      if (window.innerWidth <= 768 && nav.classList.contains('open')) {
        closeMenu();
      }
    }, 100));
  }

  /* =========================
     SCROLL SUAVE - OPTIMIZADO
  ========================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Ignorar enlaces vacíos o placeholder
      if (href === '#' || href === '#0' || href === 'javascript:void(0)') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      // Cerrar menú móvil si está abierto
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
      }
      
      // Calcular offset dinámico
      const topbarHeight = document.querySelector('.topbar')?.offsetHeight || 0;
      const navHeight = mainNavigation?.offsetHeight || 0;
      const totalOffset = topbarHeight + navHeight + 20; // 20px de margen extra
      
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - totalOffset;
      
      // Smooth scroll con polyfill si es necesario
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback para navegadores antiguos
        window.scrollTo(0, targetPosition);
      }
      
      // Focus en el target para accesibilidad
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.removeAttribute('tabindex');
    });
  });

  /* =========================
     NAVEGACIÓN STICKY - MEJORADO
  ========================= */
  if (mainNavigation) {
    let ticking = false;
    let lastKnownScrollPosition = 0;
    
    const handleScroll = () => {
      lastKnownScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      if (!ticking) {
        requestAnimationFrame(() => {
          // Mostrar/ocultar navegación
          if (lastKnownScrollPosition > SCROLL_THRESHOLD) {
            mainNavigation.classList.add('visible');
          } else {
            mainNavigation.classList.remove('visible');
          }
          
          // Añadir clase cuando se hace scroll hacia abajo
          if (lastKnownScrollPosition > 50) {
            document.body.classList.add('scrolled');
          } else {
            document.body.classList.remove('scrolled');
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    // Usar passive listeners para mejor performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Ejecutar una vez al cargar para estado inicial
    handleScroll();
  }

  /* =========================
     AÑO AUTOMÁTICO FOOTER
  ========================= */
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
    year.setAttribute('aria-live', 'polite'); // Para screen readers
  }

  /* =========================
     NEWSLETTER - MEJORADO
  ========================= */
  const form = document.querySelector('.newsletter form');
  if (form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validación en tiempo real
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (emailInput.value && !isValidEmail(emailInput.value)) {
          emailInput.setAttribute('aria-invalid', 'true');
        } else {
          emailInput.removeAttribute('aria-invalid');
        }
      });
    }
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!emailInput || !emailInput.value) {
        showNotification('Por favor, introduce tu email.', 'error');
        emailInput?.focus();
        return;
      }
      
      if (!isValidEmail(emailInput.value)) {
        showNotification('Por favor, introduce un email válido.', 'error');
        emailInput.focus();
        return;
      }
      
      // Deshabilitar botón durante envío
      const originalText = submitBtn?.textContent;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        submitBtn.setAttribute('aria-busy', 'true');
      }
      
      try {
        // Aquí iría la llamada real a tu API
        await simulateApiCall(emailInput.value);
        
        showNotification('¡Gracias por suscribirte! Te mantendremos informado.', 'success');
        form.reset();
        emailInput.removeAttribute('aria-invalid');
        
        // Track event
        trackEvent('newsletter_subscription', { email: emailInput.value });
        
      } catch (error) {
        showNotification('Hubo un error. Por favor, inténtalo de nuevo.', 'error');
        console.error('Newsletter error:', error);
      } finally {
        // Rehabilitar botón
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.removeAttribute('aria-busy');
        }
      }
    });
  }

  /* =========================
     ANIMACIÓN CARDS - OPTIMIZADO
  ========================= */
  const cards = document.querySelectorAll('.card');
  
  if (cards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Usar requestAnimationFrame para mejor performance
          requestAnimationFrame(() => {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
              
              // Añadir evento de hover después de animación
              entry.target.addEventListener('mouseenter', handleCardHover, { passive: true });
              entry.target.addEventListener('mouseleave', handleCardHover, { passive: true });
            }, index * 80); // Reducido delay
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05, // Más sensible
      rootMargin: '50px 0px -50px 0px'
    });
    
    cards.forEach(card => {
      observer.observe(card);
    });
  }

  /* =========================
     TRACKING DE EVENTOS
  ========================= */
  const trackEvent = (action, data = {}) => {
    console.log('Event tracked:', action, data);
    // Aquí integrarías Google Analytics, Facebook Pixel, etc.
    // Ejemplo: gtag('event', action, data);
  };

  // Track CTA clicks
  document.querySelectorAll(CTA_SELECTOR).forEach(element => {
    element.addEventListener('click', function() {
      const label = this.textContent.trim() || 
                    this.getAttribute('aria-label') || 
                    this.getAttribute('href');
      trackEvent('cta_click', { 
        label, 
        section: this.closest('section')?.id || 'unknown'
      });
    });
  });

  // Track WhatsApp clicks específicos
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('whatsapp_click', {
        location: this.closest('section')?.id || 'floating',
        text: this.textContent.trim()
      });
    });
  });

  /* =========================
     FUNCIONES AUXILIARES
  ========================= */
  
  // Simular llamada API
  const simulateApiCall = (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Newsletter subscription:', email);
        resolve({ success: true });
      }, 800);
    });
  };
  
  // Mostrar notificación
  const showNotification = (message, type = 'info') => {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.textContent = message;
    
    // Estilos básicos
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      z-index: 9999;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
      notification.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#f44336';
    } else {
      notification.style.backgroundColor = '#2196F3';
    }
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  };
  
  // Manejar hover de cards
  const handleCardHover = (e) => {
    const card = e.currentTarget;
    if (e.type === 'mouseenter') {
      card.classList.add('is-hovered');
    } else {
      card.classList.remove('is-hovered');
    }
  };

  /* =========================
     MEJORAS DE PERFORMANCE
  ========================= */
  
  // Preconectar a dominios externos
  if ('connection' in navigator && navigator.connection.saveData === false) {
    const preconnect = (url) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };
    
    preconnect('https://wa.me');
  }
  
  // Lazy load imágenes fuera del viewport
  if ('loading' in HTMLImageElement.prototype) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      if (img.complete) return;
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    });
  }

  /* =========================
     POLYFILLS Y FALLBACKS
  ========================= */
  
  // Polyfill para IntersectionObserver en IE
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported, loading polyfill...');
    // Aquí cargarías el polyfill dinámicamente
    // import('intersection-observer').then(() => initAnimations());
  }
  
  // Polyfill para smooth scroll
  if (!('scrollBehavior' in document.documentElement.style)) {
    console.warn('Smooth scroll not supported, using polyfill...');
    // Podrías cargar smoothscroll-polyfill aquí
  }

  /* =========================
     CLEANUP AL SALIR DE LA PÁGINA
  ========================= */
  
  window.addEventListener('beforeunload', () => {
    // Limpiar event listeners si es necesario
    if (observer) observer.disconnect();
  });

});

// CSS para animaciones de notificación
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notification {
    animation: slideIn 0.3s ease;
  }
  
  .notification--success {
    background-color: #4CAF50;
  }
  
  .notification--error {
    background-color: #f44336;
  }
  
  .notification--info {
    background-color: #2196F3;
  }
`;

document.head.appendChild(notificationStyles);
