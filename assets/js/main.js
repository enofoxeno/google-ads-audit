// Eno Fox landing page. Plain ES modules, no dependencies.

// ---- Configuration (edit these) --------------------------------------------
const CONFIG = {
  // From HubSpot: Marketing > Forms > your form > Share > Embed code.
  hubspot: { region: 'na1', portalId: 'PORTAL_ID', formId: 'FORM_ID' },
  // YouTube video ID (the part after v=). Leave empty to hide the video.
  videoId: '',
};

// Hidden-field names must match the HubSpot contact property INTERNAL names.
const ATTRIBUTION_KEYS = [
  'gclid', 'gbraid', 'wbraid',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
];
const STORE_KEY = 'ads_attr_v1';
const STORE_DAYS = 90;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pushDataLayer = (payload) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

// ---- Click ID and UTM capture (last touch, 90 days) -------------------------
const getCookie = (name) => {
  const match = document.cookie.match(`(?:^|; )${name}=([^;]*)`);
  return match ? decodeURIComponent(match[1]) : null;
};

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY) ?? getCookie(STORE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data?.exp && Date.now() > data.exp ? null : data;
  } catch {
    return null;
  }
}

function writeStore(data) {
  const json = JSON.stringify(data);
  try { localStorage.setItem(STORE_KEY, json); } catch { /* storage blocked */ }
  try {
    document.cookie = `${STORE_KEY}=${encodeURIComponent(json)};max-age=${STORE_DAYS * 86400};path=/;SameSite=Lax`;
  } catch { /* cookies blocked */ }
}

function captureAttribution() {
  const params = new URLSearchParams(location.search);
  const fresh = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) fresh[key] = value;
  }
  const pageUrl = location.href.split('#')[0];
  const data = readStore() ?? { vals: {}, landing: pageUrl };
  if (Object.keys(fresh).length > 0) {
    data.vals = fresh; // last touch: new campaign parameters replace stored ones
    data.landing = pageUrl;
  }
  data.exp = Date.now() + STORE_DAYS * 86400000;
  writeStore(data);
  pushDataLayer({ event: 'attribution_ready', attribution: data.vals });
  return data;
}

const attribution = captureAttribution();

function fillHidden(form) {
  const root = form?.[0] ?? form; // HubSpot passes a jQuery object or a DOM node
  if (!root?.querySelector) return;
  const setField = (name, value) => {
    const el = root.querySelector(`input[name="${name}"]`);
    if (!el || value == null) return;
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };
  for (const key of ATTRIBUTION_KEYS) setField(key, attribution.vals[key]);
  setField('landing_page_url', attribution.landing);
}

// ---- HubSpot forms ------------------------------------------------------------
function loadHubspot() {
  return new Promise((resolve, reject) => {
    if (window.hbspt) return resolve();
    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/embed/v2.js';
    script.charset = 'utf-8';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('HubSpot script failed to load'));
    document.head.append(script);
  });
}

async function mountForms() {
  const targets = [...document.querySelectorAll('[data-hs-form]')];
  const { region, portalId, formId } = CONFIG.hubspot;
  if (portalId === 'PORTAL_ID' || formId === 'FORM_ID') {
    console.warn('HubSpot IDs are not set. Edit CONFIG in assets/js/main.js.');
    for (const el of targets) {
      el.innerHTML = '<p class="hsform-note">The signup form appears here once HubSpot is connected.</p>';
    }
    return;
  }
  try {
    await loadHubspot();
    for (const el of targets) {
      window.hbspt.forms.create({
        region, portalId, formId,
        target: `#${el.id}`,
        onFormReady: fillHidden,
        onFormSubmitted: () => pushDataLayer({ event: 'audit_form_submitted', form_id: formId }),
      });
    }
  } catch (err) {
    console.error(err);
    for (const el of targets) {
      el.innerHTML = '<p class="hsform-note">The form could not load. Please refresh the page.</p>';
    }
  }
}

// ---- Header: blur once the page scrolls --------------------------------------
function initHeader() {
  const header = document.getElementById('site-header');
  const sentinel = document.getElementById('top-sentinel');
  if (!header || !sentinel || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }).observe(sentinel);
}

// ---- CTA buttons: scroll to the hero form and focus the email field -----------
function initCtas() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href="#audit"]');
    if (!link) return;
    event.preventDefault();
    const target = document.getElementById('audit');
    target?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => {
      target?.querySelector('input:not([type="hidden"])')?.focus({ preventScroll: true });
    }, prefersReducedMotion ? 0 : 550);
  });
}

// ---- Video: lightweight facade, iframe loads only on click --------------------
function initVideo() {
  const button = document.getElementById('video');
  if (!button || !CONFIG.videoId) return;
  button.hidden = false;
  button.closest('.about')?.classList.add('has-media');
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(CONFIG.videoId)}?autoplay=1&rel=0&modestbranding=1`;
    frame.title = button.dataset.videoTitle ?? 'Video';
    frame.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    const wrapper = document.createElement('div');
    wrapper.className = 'video';
    wrapper.style.cursor = 'default';
    wrapper.append(frame);
    button.replaceWith(wrapper);
    frame.focus();
  }, { once: true });
}

// ---- Boot ---------------------------------------------------------------------
const year = document.getElementById('yr');
if (year) year.textContent = String(new Date().getFullYear());
initHeader();
initCtas();
initVideo();
mountForms();
