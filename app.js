document.addEventListener('DOMContentLoaded', () => {

  /* ─── CUSTOM CURSOR ─── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform  = `translate(${mx}px,${my}px)`;
    });

    (function animateRing() {
      rx += (mx - rx) * 0.28;
      ry += (my - ry) * 0.28;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(animateRing);
    })();

    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });

    document.querySelectorAll('a, button, [role="button"], input, textarea, .project-card, .about-card, .skill-card, .tool-chip, .contact-link').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ─── SCROLL-BASED NAV ─── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── MOBILE MENU ─── */
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  /* ─── PROFICIENCY BARS ─── */
  const bars = document.querySelectorAll('.prof-bar-fill');
  const barObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const w = parseFloat(el.dataset.width) || 0;
        requestAnimationFrame(() => {
          el.style.transform = `scaleX(${w})`;
          el.classList.add('animated');
        });
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => barObs.observe(bar));

  /* ─── ACTIVE NAV LINK (section tracking) ─── */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navLinks.length) {
    const sectionObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--white)' : '';
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => sectionObs.observe(s));
  }

  /* ─── CONTACT FORM ─── */
  const form = document.getElementById('contact-form');
  const responseMessage = document.getElementById('form-response');

  if (form && responseMessage) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const endpoint = form.action;
      const submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton) return;

      responseMessage.textContent = 'Sending your message…';
      submitButton.disabled = true;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });
        if (response.ok) {
          responseMessage.textContent = '✓ Message sent! I\'ll be in touch within 24 hours.';
          responseMessage.style.color = '#86efac';
          form.reset();
        } else {
          const result = await response.json().catch(() => ({}));
          responseMessage.textContent = result.message || 'Something went wrong. Please email olowuadeyinka97@gmail.com.';
          responseMessage.style.color = 'var(--gold-2)';
        }
      } catch {
        responseMessage.textContent = 'Unable to send here. Please email olowuadeyinka97@gmail.com directly.';
        responseMessage.style.color = 'var(--gold-2)';
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  /* ─── SMOOTH LINK HOVER SOUNDS (visual ripple) ─── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r = document.createElement('span');
      r.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.18);width:6px;height:6px;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);animation:btn-ripple 0.5s ease forwards;pointer-events:none;`;
      this.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });

  const style = document.createElement('style');
  style.textContent = `@keyframes btn-ripple{to{transform:translate(-50%,-50%) scale(28);opacity:0}}`;
  document.head.appendChild(style);

  /* ─── LUCA CHAT WIDGET ─── */
  const lucaToggle = document.getElementById('luca-chat-toggle');
  const lucaWidget = document.getElementById('luca-chat-widget');
  const lucaPanel = document.getElementById('luca-chat-panel');
  const lucaClose = document.getElementById('luca-chat-close');

  if (lucaToggle && lucaWidget && lucaPanel) {
    const setOpen = isOpen => {
      lucaWidget.classList.toggle('open', isOpen);
      lucaToggle.setAttribute('aria-expanded', String(isOpen));
      lucaPanel.setAttribute('aria-hidden', String(!isOpen));
    };

    lucaToggle.addEventListener('click', () => {
      const isOpen = !lucaWidget.classList.contains('open');
      setOpen(isOpen);
    });

    lucaClose?.addEventListener('click', () => setOpen(false));

    const lucaChatForm = document.getElementById('luca-chat-form');
    const lucaChatInput = document.getElementById('luca-chat-input');
    const lucaChatMessages = document.getElementById('luca-chat-messages');

    const addChatMessage = (text, type = 'bot') => {
      const wrapper = document.createElement('div');
      wrapper.className = `luca-chat-message luca-chat-message--${type}`;
      wrapper.innerHTML = `<p>${text}</p>`;
      lucaChatMessages.appendChild(wrapper);
      lucaChatMessages.scrollTop = lucaChatMessages.scrollHeight;
    };

    const getLucaResponse = message => {
      const text = message.trim().toLowerCase();
      if (!text) return 'Please type a question so I can help you navigate the site.';
      if (/work|project|portfolio/.test(text)) {
        return 'Check out the Selected Work section for project case studies, design systems, and product development highlights.';
      }
      if (/experience|resume|cv|job|roles/.test(text)) {
        return 'The Experience section shows my timeline, roles, and responsibilities. You can also download the full CV from the experience panel.';
      }
      if (/contact|email|whatsapp|phone/.test(text)) {
        return 'You can reach me via email at olowuadeyinka97@gmail.com, WhatsApp at +234 815 991 2255, or use the contact form at the bottom of the page.';
      }
      if (/navigate|where|how|find/.test(text)) {
        return 'Use the buttons above to jump to Work, Experience, or Contact, or ask me directly what you want to see.';
      }
      if (/hi|hello|hey|hey luca/.test(text)) {
        return 'Hello! I’m Luca. Ask me where to find portfolio work, experience details, or contact info.';
      }
      return 'I’m here to help. Ask me about the site sections, my experience, or how to get in touch.';
    };

    document.querySelectorAll('.luca-chat-action').forEach(button => {
      button.addEventListener('click', () => {
        const target = document.querySelector(button.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => setOpen(false), 400);
        }
      });
    });

    lucaChatForm?.addEventListener('submit', event => {
      event.preventDefault();
      const message = lucaChatInput?.value || '';
      if (!message.trim()) return;
      addChatMessage(message, 'user');
      lucaChatInput.value = '';
      setTimeout(() => {
        addChatMessage(getLucaResponse(message), 'bot');
      }, 250);
    });
  }

});