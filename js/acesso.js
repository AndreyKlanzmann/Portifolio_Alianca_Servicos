/* ===========================
   ALIANÇA — ACESSO (senha de entrada)
   Expira em 8h ou ao fechar o navegador
   =========================== */

(function () {
  var SENHA = 'demo123';
  var CHAVE = 'alianca_acesso_v1';
  var DURACAO = 8 * 60 * 60 * 1000; // 8 horas em ms

  function acessoValido() {
    try {
      var salvo = JSON.parse(sessionStorage.getItem(CHAVE) || 'null');
      if (!salvo) return false;
      if (Date.now() - salvo.ts > DURACAO) { sessionStorage.removeItem(CHAVE); return false; }
      return salvo.ok === true;
    } catch (e) { return false; }
  }

  function marcarAcesso() {
    sessionStorage.setItem(CHAVE, JSON.stringify({ ok: true, ts: Date.now() }));
  }

  function mostrarTela() {
    var overlay = document.createElement('div');
    overlay.id = 'acessoOverlay';
    overlay.style.cssText = [
      'position:fixed;inset:0;z-index:99999',
      'background:#f7f6f2',
      'display:flex;align-items:center;justify-content:center',
      'font-family:"Inter",sans-serif',
      'transition:opacity .3s ease'
    ].join(';');

    overlay.innerHTML = [
      '<div style="width:min(360px,92vw);display:flex;flex-direction:column;align-items:center;gap:24px">',

        // Logo
        '<svg width="48" height="48" viewBox="0 0 36 36" fill="none">',
          '<rect width="36" height="36" rx="8" fill="#01696f"/>',
          '<path d="M18 7L8 26h4.5l1.8-4h7.4l1.8 4H28L18 7z" fill="white"/>',
          '<path d="M15.2 18.5l2.8-6.2 2.8 6.2h-5.6z" fill="rgba(0,0,0,.25)"/>',
        '</svg>',

        // Título
        '<div style="text-align:center">',
          '<div style="font-size:1.25rem;font-weight:700;color:#28251d;letter-spacing:-.01em">Aliança Serviços</div>',
          '<div style="font-size:.85rem;color:#7a7974;margin-top:4px">Digite a senha para continuar</div>',
        '</div>',

        // Card
        '<div style="width:100%;background:#fff;border:1px solid #d4d1ca;border-radius:12px;padding:24px;box-shadow:0 4px 14px rgba(40,37,29,.10);display:flex;flex-direction:column;gap:12px">',

          '<input id="acessoInput" type="password" placeholder="Senha" autocomplete="current-password" style="',
            'width:100%;padding:10px 14px;border:1.5px solid #d4d1ca;border-radius:8px;',
            'font-size:1rem;font-family:inherit;outline:none;background:#f7f6f2;',
            'transition:border-color .15s,box-shadow .15s;box-sizing:border-box',
          '">',

          '<div id="acessoErro" style="display:none;font-size:.8rem;color:#a12c7b;background:#fde8f4;padding:8px 12px;border-radius:6px">',
            'Senha incorreta. Tente novamente.',
          '</div>',

          '<div style="margin-top:8px;padding:8px 12px;background:rgba(1,105,111,.08);border:1px dashed #01696f;border-radius:8px;text-align:center">' +
      '<span style="font-size:11px;color:#01696f;font-weight:600">🔑 Demonstração — senha: <code style="background:rgba(1,105,111,.15);padding:1px 6px;border-radius:4px;font-size:12px">demo123</code></span>' +
      '</div>' +
      '<button id="acessoBtn" style="',
            'width:100%;padding:11px;border-radius:8px;border:none;cursor:pointer;',
            'background:#01696f;color:#fff;font-size:.95rem;font-weight:600;',
            'font-family:inherit;transition:background .15s',
          '">Entrar</button>',

        '</div>',

      '</div>'
    ].join('');

    document.body.appendChild(overlay);

    var input = document.getElementById('acessoInput');
    var btn = document.getElementById('acessoBtn');
    var erro = document.getElementById('acessoErro');

    function tentar() {
      if (input.value === SENHA) {
        marcarAcesso();
        overlay.style.opacity = '0';
        setTimeout(function () { overlay.remove(); }, 300);
      } else {
        erro.style.display = 'block';
        input.value = '';
        input.style.borderColor = '#a12c7b';
        input.focus();
        setTimeout(function () {
          input.style.borderColor = '#d4d1ca';
        }, 1500);
      }
    }

    btn.addEventListener('click', tentar);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tentar(); });

    // Focus automático com delay (aguarda render)
    setTimeout(function () { input.focus(); }, 100);

    // Estilo hover no botão
    btn.addEventListener('mouseover', function () { btn.style.background = '#0c4e54'; });
    btn.addEventListener('mouseout', function () { btn.style.background = '#01696f'; });

    // Estilo focus no input
    input.addEventListener('focus', function () {
      input.style.borderColor = '#01696f';
      input.style.boxShadow = '0 0 0 3px #cedcd8';
    });
    input.addEventListener('blur', function () {
      input.style.borderColor = '#d4d1ca';
      input.style.boxShadow = 'none';
    });
  }

  // Executa assim que o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (!acessoValido()) mostrarTela();
    });
  } else {
    if (!acessoValido()) mostrarTela();
  }
})();
