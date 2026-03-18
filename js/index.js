'use strict';

const topNav   = document.querySelector('.top-nav');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  const delta = currentY - lastScrollY;

  if (currentY <= 60) {
    // 최상단: 항상 표시
    topNav.classList.remove('nav-hidden');
  } else if (delta > 4) {
    // 4px 이상 내릴 때 → 숨김
    topNav.classList.add('nav-hidden');
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  } else if (delta < -4) {
    // 4px 이상 올릴 때 → 표시
    topNav.classList.remove('nav-hidden');
  }

  lastScrollY = currentY;
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// 메뉴 링크 클릭 시 자동 닫기
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});


const tilForm = document.querySelector('#til-form');
const tilList = document.querySelector('#til-list');

tilForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const dateVal = document.getElementById('til-date').value;
  const titleVal = document.getElementById('til-title').value.trim();
  const contentVal = document.getElementById('til-content').value.trim();

  if (!dateVal || !titleVal || !contentVal) return;

  const [y, m, d] = dateVal.split('-');
  const formattedDate = `${y}-${m}-${d}`;

  const article = document.createElement('article');
  article.className = 'til-item';
  article.innerHTML = `
    <time datetime="${dateVal}">${formattedDate}</time>
    <h3>${escapeHtml(titleVal)}</h3>
    <p>${escapeHtml(contentVal)}</p>
    <button class="til-delete" aria-label="TIL 삭제">삭제</button>
  `;

  tilList.insertBefore(article, tilList.firstChild);

  article.querySelector('.til-delete').addEventListener('click', () => {
    removeTilItem(article);
  });

  tilForm.reset();
  article.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// 기존 TIL 삭제 버튼 이벤트 바인딩
document.querySelectorAll('.til-delete').forEach(btn => {
  btn.addEventListener('click', () => removeTilItem(btn.closest('.til-item')));
});

function removeTilItem(item) {
  item.style.transition = 'opacity 0.4s, transform 0.4s';
  item.style.opacity = '0';
  item.style.transform = 'translateX(-20px)';
  setTimeout(() => item.remove(), 400);
}

const modal = document.getElementById('gallery-modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');

document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

const sections = document.querySelectorAll('section[id], .hero[id]');
const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchorLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));


function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
