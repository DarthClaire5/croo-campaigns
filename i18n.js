/* CROO Campaigns — shared i18n engine
   Translations are merged from T_BASE (shared nav/footer) and T_PAGE (per-page).
   Defaults to localStorage > <html lang> > 'en'.
*/
(function () {
  const SUPPORTED = ['en','zh','ja','ko','es','pt','fr','de','id'];
  const STORAGE_KEY = 'croo-lang';

  function pickDefault() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (e) {}
    const nav = (navigator.language || 'en').slice(0,2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : 'en';
  }

  function get(dict, key) {
    return dict && dict[key];
  }

  window.setLang = function (code) {
    if (!SUPPORTED.includes(code)) code = 'en';
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
    document.documentElement.lang = code;
    const t = Object.assign({}, window.T_BASE && window.T_BASE[code], window.T_PAGE && window.T_PAGE[code]);
    // English fallback when a key is missing in the active language
    const fallback = Object.assign({}, window.T_BASE && window.T_BASE.en, window.T_PAGE && window.T_PAGE.en);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = get(t, key) || get(fallback, key);
      if (val == null) return;
      if (el.dataset.i18nMode === 'html') el.innerHTML = val;
      else if (el.dataset.i18nMode === 'placeholder') el.setAttribute('placeholder', val);
      else el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = get(t, key) || get(fallback, key);
      if (val != null) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = get(t, key) || get(fallback, key);
      if (val != null) document.title = val;
    });
    // Sync the dropdown
    const sel = document.querySelector('.lang-sel');
    if (sel && sel.value !== code) sel.value = code;
  };

  // Run on DOM ready
  function init() {
    const code = pickDefault();
    window.setLang(code);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
