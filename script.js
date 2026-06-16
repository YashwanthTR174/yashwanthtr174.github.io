/* ============================================================
   YAHWANTH — Portfolio Website Script
   Pure ES6+ · No Dependencies · Production-Ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. PRELOADER
     ---------------------------------------------------------- */
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.6s ease';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    });
  }

  /* ----------------------------------------------------------
     2. THEME TOGGLE  (dark ↔ light)
     ---------------------------------------------------------- */
  const themeToggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;

  // Restore saved preference (default → dark)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
  }

  /** Swap the toggle icon between moon (dark) and sun (light). */
  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    icon.className = theme === 'dark' ? 'ph ph-moon' : 'ph ph-sun';
  }

  /* ----------------------------------------------------------
     3. NAVBAR — shrink on scroll, mobile menu, active link
     ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  // 3a. Shrink & shadow on scroll
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    highlightActiveNav();
    handleScrollToTopVisibility();
  });

  // 3b. Hamburger toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks?.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // 3c. Close mobile menu on link click
  navItems.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('active');
      navToggle?.classList.remove('active');
    });
  });

  // 3d. Highlight the nav link whose section is in view
  function highlightActiveNav() {
    const scrollY = window.scrollY + 100; // offset for fixed nav
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach((a) => a.classList.remove('active'));
        link?.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------
     4. SMOOTH SCROLLING
     ---------------------------------------------------------- */
  navItems.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = target.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  /* ----------------------------------------------------------
     5. SCROLL ANIMATIONS  (IntersectionObserver + stagger)
     ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeEls.forEach((el) => fadeObserver.observe(el));

  // Staggered delays for cards
  addStaggerDelay('.skill-card');
  addStaggerDelay('.project-card');

  /** Adds incremental transition-delay to a set of cards. */
  function addStaggerDelay(selector) {
    document.querySelectorAll(selector).forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
    });
  }

  /* ----------------------------------------------------------
     6. TYPING ANIMATION
     ---------------------------------------------------------- */
  const typingEl = document.querySelector('.typing-text');

  if (typingEl) {
    const words = [
      'Software Developer',
      'Python Developer',
      'Java Developer',
      'Problem Solver',
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const current = words[wordIndex];

      // Build or erase the visible portion
      typingEl.textContent = current.substring(0, charIndex);

      if (!isDeleting && charIndex < current.length) {
        // Still typing forward
        charIndex++;
        setTimeout(typeEffect, 100);
      } else if (!isDeleting && charIndex === current.length) {
        // Pause before deleting
        isDeleting = true;
        setTimeout(typeEffect, 2000);
      } else if (isDeleting && charIndex > 0) {
        // Deleting characters
        charIndex--;
        setTimeout(typeEffect, 50);
      } else {
        // Move to next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeEffect, 300);
      }
    }

    typeEffect();
  }

  /* ----------------------------------------------------------
     7. SKILL PROGRESS BARS
     ---------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-level');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const level = entry.target.getAttribute('data-level');
          entry.target.style.width = level;
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  skillBars.forEach((bar) => {
    bar.style.width = '0';
    skillObserver.observe(bar);
  });

  /* ----------------------------------------------------------
     8. PROJECT FILTER  (optional — only if buttons exist)
     ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Toggle active state on buttons
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category') || 'all';

        projectCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = '';
            // Re-trigger fade-in
            card.classList.remove('visible');
            requestAnimationFrame(() => card.classList.add('visible'));
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
     9. CONTACT FORM — validation + toast notification
     ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic required-field validation
      const requiredFields = contactForm.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          // Remove error highlight after user starts typing
          field.addEventListener(
            'input',
            () => field.classList.remove('error'),
            { once: true }
          );
        }
      });

      if (!isValid) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Success — reset form and notify
      showToast('Message sent successfully! 🚀', 'success');
      contactForm.reset();
    });
  }

  /** Creates a temporary toast notification. */
  function showToast(message, type = 'success') {
    // Remove any existing toast first
    document.querySelector('.toast-notification')?.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;

    // Inline styles keep the toast self-contained
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      padding: '16px 28px',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '0.95rem',
      fontWeight: '500',
      zIndex: '10000',
      opacity: '0',
      transform: 'translateY(20px)',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      backdropFilter: 'blur(12px)',
      background:
        type === 'success'
          ? 'rgba(16, 185, 129, 0.9)'
          : 'rgba(239, 68, 68, 0.9)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
    });

    document.body.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  /* ----------------------------------------------------------
     10. SCROLL-TO-TOP BUTTON
     ---------------------------------------------------------- */
  const scrollTopBtn = document.querySelector('.scroll-to-top');

  function handleScrollToTopVisibility() {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     11. COUNTER ANIMATION
     ---------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  counters.forEach((el) => counterObserver.observe(el));

  /** Smoothly counts from 0 → data-target over ~2 s. */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 2000; // ms
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad for natural deceleration
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target; // ensure exact final value
      }
    }

    requestAnimationFrame(step);
  }

  /* ----------------------------------------------------------
     12. PARALLAX — subtle hero image movement on mousemove
     ---------------------------------------------------------- */
  const heroImage = document.querySelector('.hero-image');

  if (heroImage) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;  // ±10 px
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      heroImage.style.transform = `translate(${x}px, ${y}px)`;
      heroImage.style.transition = 'transform 0.3s ease-out';
    });
  }

  /* ----------------------------------------------------------
     INIT — fire scroll-dependent logic on first paint
     ---------------------------------------------------------- */
  highlightActiveNav();
  handleScrollToTopVisibility();

}); /* end DOMContentLoaded */
