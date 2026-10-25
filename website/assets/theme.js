(() => {
  let theme = 'light';
  try {
    if (localStorage.getItem('compression-article-theme') === 'dark') theme = 'dark';
  } catch {}

  function applyTheme(value) {
    theme = value;
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0c1422' : '#f8fafb';
    const button = document.querySelector('#theme-toggle');
    if (button) button.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  applyTheme(theme);
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#theme-toggle');
    button.hidden = false;
    applyTheme(theme);
    button.addEventListener('click', () => {
      applyTheme(theme === 'dark' ? 'light' : 'dark');
      try { localStorage.setItem('compression-article-theme', theme); } catch {}
    });
  });
})();
