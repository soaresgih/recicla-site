

document.addEventListener('DOMContentLoaded', () => {
  //elementos
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('nav');
  const navLinks = Array.from(document.querySelectorAll('nav a'));
  const scrollButtons = Array.from(document.querySelectorAll('[data-scroll-to]'));
  const revealElements = Array.from(document.querySelectorAll('.reveal'));

  // Mobile menu 
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', nav.classList.contains('show'));
    });
  }

  // close menu (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('show')) nav.classList.remove('show');
    });
  });

//scroll links
  function smoothScrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = a.getAttribute('href').slice(1);
      smoothScrollToId(target);
    });
  });

  scrollButtons.forEach(btn => {
    const id = btn.getAttribute('data-scroll-to');
    btn.addEventListener('click', () => smoothScrollToId(id));
  });

  // scrollspy
  const sectionAnchors = navLinks
    .map(a => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return null;
      return document.getElementById(href.slice(1));
    })
    .filter(Boolean);

  function updateActiveNav() {
    let indexToActivate = -1;
    const offset = window.innerHeight * 0.25;

    sectionAnchors.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= offset) indexToActivate = i;
    });

    // Clear active
    navLinks.forEach(l => l.classList.remove('active'));
    if (indexToActivate >= 0) {
      const id = sectionAnchors[indexToActivate].id;
      const link = navLinks.find(l => l.getAttribute('href') === `#${id}`);
      if (link) link.classList.add('active');
    } else {
  
      const homeLink = navLinks.find(l => l.getAttribute('href') === 'index.html' || l.getAttribute('href') === './index.html');
      if (homeLink) {
        navLinks.forEach(l => l.classList.remove('active'));
        homeLink.classList.add('active');
      }
    }
  }

  window.addEventListener('scroll', () => {
    updateActiveNav();
    handleRevealOnScroll();
  }, { passive: true });

  
  updateActiveNav();
  handleRevealOnScroll();

//scroll
  function handleRevealOnScroll() {
    const bottomOfScreen = window.innerHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= bottomOfScreen - 80) {
        el.classList.add('show');
      }
    });
  }

 //botoes cta
  document.querySelectorAll('[data-action="participar"]').forEach(btn => {
    btn.addEventListener('click', () => {
      // UX-friendly inline modal alternative
      const toast = document.createElement('div');
      toast.textContent = 'Em breve teremos cadastro no Recicla+ — fique de olho!';
      toast.style.position = 'fixed';
      toast.style.right = '20px';
      toast.style.bottom = '20px';
      toast.style.padding = '12px 16px';
      toast.style.background = 'rgba(46,125,50,0.95)';
      toast.style.color = '#fff';
      toast.style.borderRadius = '10px';
      toast.style.boxShadow = '0 8px 20px rgba(0,0,0,0.14)';
      toast.style.zIndex = 9999;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3200);
    });
  });


  const lazyImgs = Array.from(document.querySelectorAll('img[data-src]'));
  if ('IntersectionObserver' in window && lazyImgs.length) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          o.unobserve(img);
        }
      });
    }, { rootMargin: '60px 0px', threshold: 0.01 });
    lazyImgs.forEach(i => obs.observe(i));
  }

  // close menu (escape)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('show')) {
      nav.classList.remove('show');
    }
  });
});
