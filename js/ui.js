/* ===========================
   ALIANÇA — UI
   =========================== */

// ---- RENDER ----
function buildCard(s) {
  let btnClass, btnLabel, btnIcon;
  if (s.localFile) {
    btnClass = 'local-file'; btnLabel = 'Arquivo Local'; 
    btnIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
  } else if (s.url) {
    btnClass = 'has-link'; btnLabel = 'Acessar Sistema';
    btnIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
  } else {
    btnClass = 'no-link'; btnLabel = s.obs2 || 'Serviço Interno';
    btnIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  }
  const onclick = s.url ? `onclick="window.open('${s.url}','_blank')"` : '';
  const escapedName = s.name.replace(/'/g,"\\'").replace(/"/g,'&quot;');
  const escapedPrice = (s.price||'').replace(/'/g,"\\'");
  const escapedUrl = (s.url||'').replace(/'/g,"\\'");
  const escapedLabel = btnLabel.replace(/'/g,"\\'");
  const isLocal = s.localFile ? 'true' : 'false';
  return `<div class="card" data-name="${s.name.toLowerCase()}" data-obs="${(s.obs||'').toLowerCase()}" data-cat="${s.cat}" data-tags="${(SVC_TAGS[s.name]||'').toLowerCase()}">
    <div class="card-top">
      <div class="card-name">${s.name}${(typeof IMAGENS !== 'undefined' && IMAGENS[s.name]) ? '<span class="badge-visual"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>visual</span>' : ''}</div>
      ${s.price && s.price!=='—' ? `<span class="card-price">${s.price}</span>` : ''}
    </div>
    <div class="card-obs">${s.obs||''}</div>
    <div class="card-footer" style="display:flex;gap:6px;margin-bottom:6px">
      <button class="btn-access ${btnClass}" style="flex:1" ${onclick} ${!s.url?'disabled':''}>
        ${btnIcon} ${btnLabel}
      </button>
    </div>
    <div style="display:flex;gap:6px">
      <button class="btn-ver" onclick="openSvcDetail('${escapedName}','${escapedPrice}','${escapedUrl}','${escapedLabel}',${isLocal})" style="flex:1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Detalhes
      </button>
      <button type="button" onclick="copyMsg('${escapedName}','${escapedPrice}')" class="btn-copy-msg">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Copiar
      </button>
      <button type="button" class="btn-add-cart" onclick="addToCart('${escapedName}','${escapedPrice}')" style="flex:1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        + Caixa
      </button>
    </div>
  </div>`;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  const cats = [...new Set(SERVICES.map(s=>s.cat))];
  cats.forEach(cat => {
    const grid = document.getElementById('grid-'+cat);
    if (!grid) return;
    const items = SERVICES.filter(s=>s.cat===cat);
    grid.innerHTML = items.map(buildCard).join('');
    const cnt = document.getElementById('count-'+cat);
    if (cnt) cnt.textContent = items.length + ' serviços';
  });

  // Category filter
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.cat;
      document.querySelectorAll('.section').forEach(sec => {
        sec.classList.toggle('hidden', cat!=='all' && sec.dataset.cat!==cat);
      });
      document.getElementById('search').value = '';
      document.querySelectorAll('.section:not(.hidden) .card').forEach(c=>c.classList.remove('hidden'));
      document.getElementById('emptyState').style.display = 'none';
    });
  });

  // Search — generic + tags + fuzzy (com debounce de 150ms pra suavizar digitação rápida)
  var _searchTimer = null;
  document.getElementById('search').addEventListener('input', function() {
    var self = this;
    if (_searchTimer) clearTimeout(_searchTimer);
    _searchTimer = setTimeout(function(){ _runSearch.call(self); }, 150);
  });
  function _runSearch() {
    const raw = this.value.toLowerCase().trim();
    if (!raw) { showAllCards(); return; }

    function norm(s) {
      return (s||'').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        .replace(/[-_.\/]/g,' ');
    }

    // Fuzzy: check if query matches target allowing 1 substitution/deletion for queries >= 4 chars
    function fuzzyContains(target, q) {
      if (target.includes(q)) return true;
      if (q.length < 4) return false;
      // check each word in target
      var words = target.split(' ');
      for (var wi = 0; wi < words.length; wi++) {
        var w = words[wi];
        if (w.length < q.length - 1) continue;
        // sliding window: compare q against substrings of w with 1 error tolerance
        for (var si = 0; si <= w.length - q.length + 1; si++) {
          var sub = w.substr(si, q.length);
          var diff = 0;
          for (var ci = 0; ci < q.length; ci++) {
            if (sub[ci] !== q[ci]) diff++;
            if (diff > 1) break;
          }
          if (diff <= 1) return true;
        }
      }
      return false;
    }

    const q = norm(raw);
    // Synonym expansion
    var synKey = SYNONYMS[raw] || SYNONYMS[norm(raw)];
    const synQ = synKey ? norm(synKey) : null;

    let any = false;
    document.querySelectorAll('.card').forEach(card => {
      const haystack = norm(card.dataset.name + ' ' + card.dataset.obs + ' ' + (card.dataset.tags||''));
      const match = fuzzyContains(haystack, q) || (synQ && fuzzyContains(haystack, synQ));
      card.classList.toggle('hidden', !match);
      if (match) any = true;
    });
    document.querySelectorAll('.section').forEach(sec => {
      const visible = [...sec.querySelectorAll('.card')].some(c=>!c.classList.contains('hidden'));
      sec.classList.toggle('hidden', !visible);
    });
    document.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active'));
    document.querySelector('.cat-pill[data-cat="all"]').classList.add('active');
    document.getElementById('emptyState').style.display = any ? 'none' : 'block';
  }

  // Theme toggle
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  updateIcon(theme);
  toggle.addEventListener('click', () => {
    theme = theme==='dark'?'light':'dark';
    root.setAttribute('data-theme', theme);
    updateIcon(theme);
  });
  function updateIcon(t) {
    toggle.innerHTML = t==='dark'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
});

function showAllCards() {
  document.querySelectorAll('.card').forEach(c=>c.classList.remove('hidden'));
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('hidden'));
  document.getElementById('emptyState').style.display = 'none';
}
function openPatch() { document.getElementById('patchOverlay').classList.add('open'); }
function closePatch() { document.getElementById('patchOverlay').classList.remove('open'); }
document.addEventListener('keydown', e => { if(e.key==='Escape') closePatch(); });
document.getElementById('patchOverlay').addEventListener('click', function(e){ if(e.target===this) closePatch(); });

