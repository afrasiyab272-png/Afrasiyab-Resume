'use strict';

// Theme preference: user-controlled, persistent, and accessible.
const root = document.documentElement;
const themeButton = document.getElementById('theme-toggle');
try {
  const savedTheme = localStorage.getItem('ad-resume-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') root.dataset.theme = savedTheme;
} catch (error) { /* Private mode can disable local storage; the theme still works. */ }
function updateThemeLabel() {
  const isDark = root.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  themeButton.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
}
updateThemeLabel();
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('ad-resume-theme', root.dataset.theme); } catch (error) { /* Ignore blocked storage. */ }
  updateThemeLabel();
});

// The filter updates actual resume entries, not just decorative controls.
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const experienceCards = [...document.querySelectorAll('.experience-card')];
const emptyMessage = document.getElementById('filter-empty');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const requestedCategory = button.dataset.filter;
  filterButtons.forEach(other => {
    const selected = other === button;
    other.classList.toggle('active', selected);
    other.setAttribute('aria-pressed', String(selected));
  });
  let visibleCount = 0;
  experienceCards.forEach(card => {
    const categories = card.dataset.category.split(' ');
    const visible = requestedCategory === 'all' || categories.includes(requestedCategory);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  emptyMessage.hidden = visibleCount > 0;
}));

// Responsive navigation with correctly managed expanded state.
const menuToggle = document.getElementById('menu-toggle');
const navigation = document.getElementById('site-nav');
menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}));

// Optional productivity features: print-friendly resume and copyable email.
document.getElementById('print-resume').addEventListener('click', () => window.print());
document.getElementById('year').textContent = new Date().getFullYear();
const copyButton = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
copyButton.addEventListener('click', async () => {
  const email = 'afrasiyab272@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = 'Email copied to clipboard.';
  } catch (error) {
    copyStatus.textContent = 'You can select the email address above to copy it.';
  }
});
