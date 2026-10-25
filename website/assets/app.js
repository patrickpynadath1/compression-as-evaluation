const progress = document.querySelector('#reading-progress-bar');
const updateProgress = () => {
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${distance > 0 ? Math.min(100, 100 * scrollY / distance) : 0}%`;
};
addEventListener('scroll', updateProgress, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();

function revealTarget() {
  let anchor;
  try { anchor = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(anchor);
  if (!target) return;
  for (let node = target; node; node = node.parentElement) if (node.tagName === 'DETAILS') node.open = true;
  requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
}
addEventListener('hashchange', revealTarget);
if (location.hash) revealTarget();

const chapters = [...document.querySelectorAll('main .chapter')];
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    for (const link of document.querySelectorAll('[data-toc]')) {
      if (link.dataset.toc === entry.target.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
}, { rootMargin: '-15% 0px -70% 0px' });
chapters.forEach(chapter => observer.observe(chapter));

const dialog = document.querySelector('#comments-dialog');
const commentButton = document.querySelector('#comment-button');
const enable = document.querySelector('#enable-comments');
const status = document.querySelector('#comment-status');
let loaded = false;
commentButton.addEventListener('click', () => dialog.showModal());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
enable.addEventListener('click', () => {
  if (loaded) { dialog.close(); return; }
  enable.disabled = true;
  status.textContent = 'Loading the shared annotation sidebar…';
  const settings = { openSidebar: true, showHighlights: true };
  const group = document.body.dataset.hypothesisGroup;
  if (group) settings.group = group;
  let config = document.querySelector('.js-hypothesis-config');
  if (!config) {
    config = document.createElement('script');
    config.type = 'application/json';
    config.className = 'js-hypothesis-config';
    document.head.append(config);
  }
  config.textContent = JSON.stringify(settings);
  const script = document.createElement('script');
  script.src = 'https://hypothes.is/embed.js';
  script.async = true;
  let failed = false;
  const fail = () => {
    if (loaded) return;
    failed = true;
    script.remove();
    enable.disabled = false;
    status.textContent = 'The annotation service could not load. Check your connection or content blocker, then try again.';
  };
  const timeout = setTimeout(fail, 20000);
  script.onerror = () => { clearTimeout(timeout); fail(); };
  script.onload = () => {
    clearTimeout(timeout);
    if (failed) return;
    loaded = true;
    enable.disabled = false;
    enable.textContent = 'Return to reading';
    commentButton.querySelector('span').textContent = 'Comments enabled';
    commentButton.classList.add('enabled');
    status.textContent = 'The client has loaded. Use its sidebar to sign in and choose a group. If the sidebar is blocked, reload and check your content blocker.';
    dialog.close();
  };
  document.body.append(script);
});
