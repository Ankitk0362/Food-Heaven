

'use strict';

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    startHeroAnimations();
  }, 2200);
});


const navbar  = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
  toggleScrollTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});


navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}


function startHeroAnimations() {
  const el = document.getElementById('heroTyping');
  const phrases = [
    'An intimate journey through seasonal flavours.',
    'Where every plate is a work of art.',
    'Michelin-starred excellence, every evening.',
    'Reserve your table and let us do the rest.'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const cursor = '<span class="cursor"></span>';

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      el.innerHTML = phrase.slice(0, charIdx) + cursor;
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
    } else {
      charIdx--;
      el.innerHTML = phrase.slice(0, charIdx) + cursor;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 35 : 55);
  }
  type();
}


const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));


const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}


const menuTabs = document.querySelectorAll('.menu-tab');
menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    menuTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    document.querySelectorAll('.menu-card').forEach(card => {
      const show = card.dataset.cat === cat;
      card.classList.toggle('hidden', !show);
      if (show) {
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = 'fadeSlide 0.4s ease forwards';
      }
    });
  });
});


const lightbox = document.getElementById('lightbox');

function openLightbox(src, caption) {
  document.getElementById('lightboxImg').src    = src;
  document.getElementById('lightboxCaption').textContent = caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});


const slides = document.querySelectorAll('.testimonial-slide');
const dotsContainer = document.getElementById('tDots');
let currentSlide = 0;
let autoSlideTimer;


slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 't-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dotsContainer.querySelectorAll('.t-dot')[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dotsContainer.querySelectorAll('.t-dot')[currentSlide].classList.add('active');
  resetAutoSlide();
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

document.getElementById('tPrev').addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('tNext').addEventListener('click', () => goToSlide(currentSlide + 1));
resetAutoSlide();


const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const cartItemsEl = document.getElementById('cartItems');

let cart = [];

function toggleCart() {
  const open = cartSidebar.classList.toggle('open');
  cartOverlay.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
  showCartToast(name);
  if (!cartSidebar.classList.contains('open')) toggleCart();
}

function renderCart() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartCountEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
  cartTotalEl.textContent = '$' + total.toFixed(0);

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    return;
  }

  cartItemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(0)}</div>
      </div>
      <div class="cart-item-qty">
        <button class="cart-qty-btn" onclick="updateQty(${idx}, -1)">−</button>
        <span>${item.qty}</span>
        <button class="cart-qty-btn" onclick="updateQty(${idx}, 1)">+</button>
      </div>
    </div>
  `).join('');
}

function updateQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}

function showCartToast(name) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:90px; right:28px; background:var(--gold); color:var(--black);
    padding:12px 20px; border-radius:4px; font-size:0.82rem; font-weight:500;
    z-index:3000; animation:fadeSlide 0.3s ease; letter-spacing:0.05em;
    box-shadow:0 4px 20px rgba(201,168,76,0.4);
  `;
  toast.textContent = `✓ ${name} added`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}


document.getElementById('resForm').addEventListener('submit', function(e) {
  e.preventDefault();
  let valid = true;

  const fields = [
    { id: 'resName',   errId: 'resNameErr',   msg: 'Full name is required.',         check: v => v.trim().length >= 2 },
    { id: 'resEmail',  errId: 'resEmailErr',  msg: 'A valid email is required.',     check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'resPhone',  errId: 'resPhoneErr',  msg: 'Phone number is required.',      check: v => v.trim().length >= 7 },
    { id: 'resGuests', errId: 'resGuestsErr', msg: 'Please select number of guests.',check: v => v !== '' },
    { id: 'resDate',   errId: 'resDateErr',   msg: 'Please select a date.',          check: v => v !== '' },
    { id: 'resTime',   errId: 'resTimeErr',   msg: 'Please select a time.',          check: v => v !== '' },
  ];

  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const errEl = document.getElementById(f.errId);
    if (!f.check(input.value)) {
      errEl.textContent = f.msg;
      input.style.borderColor = 'var(--error)';
      valid = false;
    } else {
      errEl.textContent = '';
      input.style.borderColor = '';
    }
  });

  if (valid) {
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Confirming…';
    btn.disabled = true;
    setTimeout(() => {
      document.getElementById('resSuccess').classList.add('show');
      this.reset();
      btn.textContent = 'Confirm Reservation';
      btn.disabled = false;
      setTimeout(() => document.getElementById('resSuccess').classList.remove('show'), 5000);
    }, 1200);
  }
});


['resName','resEmail','resPhone','resGuests','resDate','resTime'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => {
    const errId = id + 'Err';
    document.getElementById(errId).textContent = '';
    el.style.borderColor = '';
  });
});


document.getElementById('newsletterForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('newsletterSuccess').classList.add('show');
    this.reset();
    setTimeout(() => document.getElementById('newsletterSuccess').classList.remove('show'), 4000);
  }
});


const scrollTopBtn = document.getElementById('scrollTop');
function toggleScrollTop() {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


const darkToggle = document.getElementById('darkToggle');
let lightMode = false;
darkToggle.addEventListener('click', () => {
  lightMode = !lightMode;
  document.body.classList.toggle('light-mode', lightMode);
  darkToggle.querySelector('i').className = lightMode ? 'fas fa-sun' : 'fas fa-moon';
});


const chatPopup = document.getElementById('chatPopup');
const chatBadge = document.querySelector('.chat-badge');
const chatMessages = document.getElementById('chatMessages');

function toggleChat() {
  chatPopup.classList.toggle('open');
  if (chatBadge) chatBadge.style.display = 'none';
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  appendChatMsg(msg, 'user');
  input.value = '';

  const replies = [
    "Of course! I'd be happy to help with your reservation. What date and time works best for you?",
    "We have availability this week — shall I help you book a table for two?",
    "Our tasting menu is currently available Tuesday through Saturday evenings. Would you like details?",
    "I'll connect you with our reservations team right away. Could you share your preferred date?",
    "We'd love to host you! Is this for a special occasion we should know about?"
  ];
  setTimeout(() => {
    appendChatMsg(replies[Math.floor(Math.random() * replies.length)], 'bot');
  }, 900);
}

function appendChatMsg(text, type) {
  const div = document.createElement('div');
  div.className = 'chat-msg ' + type;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}


const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  if (heroImg && window.scrollY < window.innerHeight) {
    heroImg.style.transform = `scale(1) translateY(${window.scrollY * 0.2}px)`;
  }
});


document.querySelector('.cart-checkout').addEventListener('click', () => {
  if (cart.length === 0) return;
  const msg = document.createElement('div');
  msg.style.cssText = `
    position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
    background:var(--surface); border:1px solid var(--gold); border-radius:12px;
    padding:40px 48px; text-align:center; z-index:4000;
    box-shadow:0 20px 80px rgba(0,0,0,0.6); max-width:380px; width:90%;
    animation:fadeSlide 0.3s ease;
  `;
  msg.innerHTML = `
    <div style="font-size:2.5rem;color:var(--gold);margin-bottom:12px;">✓</div>
    <h3 style="font-family:'Cormorant Garamond',serif;color:var(--cream);margin-bottom:8px;">Order Confirmed</h3>
    <p style="color:var(--text-dim);font-size:0.9rem;margin-bottom:24px;">Your order has been received. Our team will contact you shortly to confirm details.</p>
    <button onclick="this.parentElement.remove()" style="background:var(--gold);color:var(--black);padding:12px 30px;border-radius:4px;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;font-family:'Jost',sans-serif;font-weight:500;cursor:pointer;">Close</button>
  `;
  document.body.appendChild(msg);
  cart = [];
  renderCart();
  toggleCart();
});


(function() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeSlide {
      from { opacity:0; transform: translateY(16px); }
      to   { opacity:1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();


window.addToCart    = addToCart;
window.updateQty    = updateQty;
window.toggleCart   = toggleCart;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.toggleChat   = toggleChat;
window.sendChat     = sendChat;
