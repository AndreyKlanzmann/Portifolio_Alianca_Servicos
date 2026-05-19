/* ===========================
   ALIANÇA — ADMIN
   =========================== */

// ════════════════════════════════════════════════════════════════
//  SISTEMA DE CONTROLE DE ACESSO — Aliança Informática v3.1
//  F5 sempre desloga • Total/Histórico/PDF ocultos sem senha
// ════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  // ── CONFIGURAÇÃO ──────────────────────────────────────────────
  // Hash SHA-256 da senha padrão: alianca2025
  // Para trocar: https://emn178.github.io/online-tools/sha256.html
  // Digite a nova senha, copie o hash e cole aqui abaixo:
  const ADMIN_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' // SHA-256 de 'admin123' — gere o seu em: https://emn178.github.io/online-tools/sha256.html;
  // ↑ troque esse valor pelo hash da senha real da loja

  // Sessão 100% em memória — F5 sempre desloga
  let _adminActive = false;
  let _pendingCallback = null;

  // ── SHA-256 ───────────────────────────────────────────────────
  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ── MODAL ─────────────────────────────────────────────────────
  function showModal(callback) {
    _pendingCallback = callback;
    const ov = document.getElementById('adminAuthOverlay');
    const inp = document.getElementById('adminPasswordInput');
    ov.style.display = 'flex';
    setTimeout(() => inp && inp.focus(), 80);
  }

  function hideModal() {
    const ov = document.getElementById('adminAuthOverlay');
    ov.style.display = 'none';
    const inp = document.getElementById('adminPasswordInput');
    if (inp) inp.value = '';
    const msg = document.getElementById('adminAuthMsg');
    if (msg) msg.textContent = '';
    _pendingCallback = null;
  }

  window._cancelAdminAuth = function () {
    hideModal();
  };

  window._confirmAdminAuth = async function () {
    const inp = document.getElementById('adminPasswordInput');
    const msg = document.getElementById('adminAuthMsg');
    const val = inp ? inp.value.trim() : '';
    if (!val) { msg.textContent = 'Digite a senha.'; return; }

    const hash = await sha256(val);

    // DEBUG TEMPORÁRIO — apague depois de confirmar que funciona:
    // console.log('Hash digitado:', hash);

    if (hash === ADMIN_HASH) {
      _adminActive = true;
      hideModal();
      updateAllAdminUI();
      if (_pendingCallback) {
        const cb = _pendingCallback;
        _pendingCallback = null;
        cb();
      }
    } else {
      msg.textContent = 'Senha incorreta.';
      if (inp) { inp.value = ''; inp.focus(); }
    }
  };

  // ── GATE PRINCIPAL ────────────────────────────────────────────
  window.requireAdmin = function (fn) {
    if (_adminActive) { fn(); } else { showModal(fn); }
  };

  window.adminLogout = function () {
    _adminActive = false;
    updateAllAdminUI();
    if (typeof showToast === 'function') showToast('🔒 Modo operacional ativo');
  };

  // ── BADGE NO HEADER ───────────────────────────────────────────
  function updateAdminBadge() {
    const badge = document.getElementById('adminStatusBadge');
    if (!badge) return;
    if (_adminActive) {
      badge.innerHTML = `
        <span onclick="window.adminLogout()" title="Clique para sair do modo admin" style="
          display:inline-flex;align-items:center;gap:5px;
          background:var(--color-primary,#01696f);color:#fff;
          font-size:11px;font-weight:700;padding:3px 10px 3px 8px;
          border-radius:999px;cursor:pointer;letter-spacing:.3px;
          transition:background .15s;
        " onmouseover="this.style.background='var(--color-primary-hover,#0c4e54)'"
           onmouseout="this.style.background='var(--color-primary,#01696f)'">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/>
            <path d="M12 14c-5 0-8 2-8 3v1h16v-1c0-1-3-3-8-3z"/>
          </svg>
          ADMIN
        </span>`;
    } else {
      badge.innerHTML = `
        <span onclick="window.requireAdmin(()=>{})" title="Clique para entrar como admin" style="
          display:inline-flex;align-items:center;gap:5px;
          background:var(--color-surface-offset,#eee);color:var(--color-text-muted,#666);
          font-size:11px;font-weight:600;padding:3px 10px 3px 8px;
          border-radius:999px;cursor:pointer;letter-spacing:.3px;
          transition:background .15s;
        " onmouseover="this.style.background='var(--color-surface-dynamic)'"
           onmouseout="this.style.background='var(--color-surface-offset,#eee)'">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          OPERACIONAL
        </span>`;
    }
  }

  // ── OCULTAR TOTAL DO DIA ──────────────────────────────────────
  function updateTotalDiaUI() {
    // Container do total do dia (aba histórico)
    const totalWrapper = document.getElementById('dayTotalVal');
    const clientsEl = document.getElementById('dayTotalClients');

    // Tenta encontrar o bloco pai do total
    const totalBlock = totalWrapper ? totalWrapper.closest('.day-total, [id*="dayTotal"], [class*="day-total"]') || totalWrapper.parentElement : null;

    if (_adminActive) {
      // Mostra tudo normalmente
      if (totalBlock) totalBlock.classList.remove('admin-hidden');
      // Remove hint de desbloqueio se existir
      const hints = document.querySelectorAll('.admin-unlock-hint');
      hints.forEach(h => h.remove());
    } else {
      // Oculta o total
      if (totalBlock) {
        totalBlock.classList.add('admin-hidden');
        totalBlock.onclick = function(e) {
          e.stopPropagation();
          window.requireAdmin(() => {});
        };
      }
    }
  }

  // ── OCULTAR HISTÓRICO ─────────────────────────────────────────
  function updateHistoricoUI() {
    const histItems = document.getElementById('histItems');
    if (!histItems) return;

    if (_adminActive) {
      histItems.classList.remove('admin-hidden');
      histItems.onclick = null;
      // Remove placeholder se existir
      const ph = document.getElementById('adminHistPlaceholder');
      if (ph) ph.remove();
      // Re-renderiza histórico real
      if (typeof renderHistory === 'function') renderHistory();
    } else {
      // Mostra placeholder em vez do histórico
      histItems.innerHTML = `
        <div id="adminHistPlaceholder" style="
          display:flex;flex-direction:column;align-items:center;
          padding:32px 16px;gap:12px;
        ">
          <div style="
            width:48px;height:48px;border-radius:14px;
            background:var(--color-surface-offset);
            display:flex;align-items:center;justify-content:center;
          ">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-faint)" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div style="text-align:center;">
            <div style="font-size:14px;font-weight:600;color:var(--color-text);">Histórico protegido</div>
            <div style="font-size:12px;color:var(--color-text-muted);margin-top:4px;">Somente administradores podem ver o histórico</div>
          </div>
          <button onclick="window.requireAdmin(()=>{})" style="
            padding:8px 20px;border-radius:999px;border:none;
            background:var(--color-primary,#01696f);color:#fff;
            font-size:13px;font-weight:600;cursor:pointer;
          ">🔓 Entrar como Admin</button>
        </div>`;
    }
  }

  // ── OCULTAR BOTÕES PDF E GRÁFICO ─────────────────────────────
  function updatePdfGraficoBtns() {
    // Botões com onclick que chamam gerarRelatorio ou abrirGrafico
    document.querySelectorAll('button').forEach(btn => {
      const oc = btn.getAttribute('onclick') || '';
      const txt = btn.textContent.trim();
      const isPdf = oc.includes('gerarRelatorio') || txt.includes('PDF') || txt.includes('Relatório');
      const isGrafico = oc.includes('abrirGrafico') || txt.includes('Gráfico') || txt.includes('Grafico');

      if (isPdf || isGrafico) {
        if (_adminActive) {
          btn.style.opacity = '';
          btn.style.pointerEvents = '';
          btn.title = btn.dataset.origTitle || btn.title;
        } else {
          btn.dataset.origTitle = btn.title;
          btn.style.opacity = '0.45';
          btn.style.pointerEvents = 'none';
          btn.title = 'Apenas admin pode acessar';
        }
      }
    });
  }

  // ── ATUALIZAR TODA A UI ───────────────────────────────────────
  function updateAllAdminUI() {
    updateAdminBadge();
    updateTotalDiaUI();
    updateHistoricoUI();
    updatePdfGraficoBtns();
  }

  // ── INJETAR BADGE NO HEADER ───────────────────────────────────
  function injectBadge() {
    if (document.getElementById('adminStatusBadge')) return;
    const badge = document.createElement('div');
    badge.id = 'adminStatusBadge';
    badge.style.cssText = 'display:inline-flex;align-items:center;margin-left:6px;vertical-align:middle;';

    const header = document.querySelector('header');
    if (!header) return;

    // Tenta colocar após o span de versão (v3.0)
    const spans = header.querySelectorAll('span');
    let inserted = false;
    spans.forEach(s => {
      if (/^v\d/.test(s.textContent.trim()) && !inserted) {
        s.parentNode.insertBefore(badge, s.nextSibling);
        inserted = true;
      }
    });
    if (!inserted) {
      const firstDiv = header.querySelector('div') || header;
      firstDiv.appendChild(badge);
    }
    updateAdminBadge();
  }

  // ── INTERCEPTAR FUNÇÕES ADMIN ─────────────────────────────────
  function patchFunctions() {
    const toProtect = [
      'abrirEstoque', 'abrirImportSMB', 'limparTodosProdutos',
      'abrirEditarProduto', 'fecharCaixaDoDia', 'abrirFecharCaixaAvancado',
      'abrirDashboard', 'abrirExportCSV', 'abrirConfigTelegram',
      'excluirHistoricoAnterior', 'abrirHistoricoAnterior',
    ];

    toProtect.forEach(fnName => {
      if (typeof window[fnName] === 'function') {
        const _orig = window[fnName];
        window[fnName] = function (...args) {
          window.requireAdmin(() => _orig.apply(this, args));
        };
      }
    });

    // Protege gerarRelatorio e abrirGrafico
    ['gerarRelatorio', 'abrirGrafico'].forEach(fnName => {
      if (typeof window[fnName] === 'function') {
        const _orig = window[fnName];
        window[fnName] = function (...args) {
          window.requireAdmin(() => _orig.apply(this, args));
        };
      }
    });

    // Atualiza botões PDF/Gráfico após patch
    updatePdfGraficoBtns();
    console.log('[AdminPatch v3.1] ✅ Funções protegidas aplicadas.');
  }

  // ── OBSERVAR MUDANÇA DE ABA (Caixa → Histórico) ──────────────
  // Quando o usuário clica na aba Histórico, atualiza a UI
  function observeTabChange() {
    const tabHistory = document.getElementById('tabHistory');
    if (tabHistory) {
      tabHistory.addEventListener('click', () => {
        setTimeout(updateHistoricoUI, 50);
        setTimeout(updateTotalDiaUI, 50);
        setTimeout(updatePdfGraficoBtns, 100);
      });
    }
    // Também observa o drawer do caixa para quando abrir
    const cartDrawer = document.getElementById('cartDrawer');
    if (cartDrawer) {
      const obs = new MutationObserver(() => {
        setTimeout(updatePdfGraficoBtns, 80);
      });
      obs.observe(cartDrawer, { attributes: true, attributeFilter: ['class'] });
    }
  }

  // ── INICIALIZAÇÃO ─────────────────────────────────────────────
  function init() {
    injectBadge();
    observeTabChange();
    setTimeout(() => {
      patchFunctions();
      updateAllAdminUI();
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expõe para uso externo se necessário
  window._adminIsActive = () => _adminActive;

})();
