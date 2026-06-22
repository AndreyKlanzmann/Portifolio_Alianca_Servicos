/* ===========================
   PDV DEMO — CLIENTES
   Requer: firebase.js, cart.js (showToast, _brl, _todayISO)
   =========================== */

(function () {

  /* ── Estado ── */
  var _clientes = [];

  /* ── Abrir/Fechar ── */
  window.abrirClientes = function () {
    _carregarClientes();
    document.getElementById('clientesOverlay').classList.add('open');
  };

  window.fecharClientes = function () {
    document.getElementById('clientesOverlay').classList.remove('open');
  };

  /* ── Carregar do Firebase ── */
  function _carregarClientes() {
    var lista = document.getElementById('clientesLista');
    lista.innerHTML = '<div style="text-align:center;padding:24px;font-size:12px;color:var(--color-text-muted)">Carregando...</div>';

    if (window.carregarClientesAtivos) {
      window.carregarClientesAtivos().then(function(docs) {
        _clientes = docs;
        _renderClientes();
      }).catch(function() { _clientes = []; _renderClientes(); });
    } else {
      _clientes = [];
      _renderClientes();
    }
  }

  /* ── Render ── */
  function _renderClientes() {
    var lista = document.getElementById('clientesLista');
    var filtro = document.getElementById('clientesBusca').value.toLowerCase();

    var filtrados = filtro
      ? _clientes.filter(function(c) {
          return c.nome.toLowerCase().includes(filtro) ||
                 (c.telefone || '').includes(filtro);
        })
      : _clientes;

    document.getElementById('clientesCount').textContent = filtrados.length + ' em andamento';

    if (!filtrados.length) {
      lista.innerHTML = '<div style="text-align:center;padding:32px;font-size:13px;color:var(--color-text-muted)">'
        + (filtro ? 'Nenhum cliente encontrado' : 'Nenhum serviço em andamento')
        + '</div>';
      return;
    }

    lista.innerHTML = filtrados.map(function(c) {
      var servicos = c.servicos || [];
      var totalPendente = servicos.filter(function(s) { return !s.pago; })
                                  .reduce(function(sum, s) { return sum + (s.valor || 0); }, 0);

      return '<div class="cliente-card" id="cliente-' + c.docId + '">'
        + '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">'
        +   '<div style="flex:1;min-width:0">'
        +     '<div style="font-size:14px;font-weight:700;color:var(--color-text)">' + c.nome + '</div>'
        +     (c.telefone ? '<div style="font-size:12px;color:var(--color-text-muted);margin-top:2px">📱 ' + c.telefone + '</div>' : '')
        +   '</div>'
        +   '<div style="display:flex;align-items:center;gap:6px;flex-shrink:0">'
        +     (totalPendente > 0 ? '<span style="font-size:12px;font-weight:700;color:#a12c7b">' + _brl(totalPendente) + ' pendente</span>' : '<span style="font-size:12px;font-weight:700;color:#437a22">✓ Pago</span>')
        +     '<button onclick="editarCliente(\'' + c.docId + '\')" style="background:none;border:1.5px solid var(--color-border);border-radius:6px;padding:3px 8px;cursor:pointer;font-size:11px;color:var(--color-text-muted)">✏️</button>'
        +     '<button onclick="excluirCliente(\'' + c.docId + '\')" style="background:none;border:1.5px solid var(--color-border);border-radius:6px;padding:3px 8px;cursor:pointer;font-size:11px;color:var(--color-text-muted)">🗑</button>'
        +   '</div>'
        + '</div>'
        + '<div style="margin-top:10px;display:flex;flex-direction:column;gap:6px">'
        + servicos.map(function(s, si) {
            return '<div style="background:var(--color-surface-offset);border-radius:8px;padding:8px 10px;display:flex;align-items:flex-start;gap:8px">'
              + '<div style="flex:1;min-width:0">'
              +   '<div style="font-size:12px;font-weight:600;color:var(--color-text)">' + s.descricao + (s.funcionario ? ' <span style="font-size:10px;font-weight:600;color:var(--color-primary);background:var(--color-primary-highlight);padding:1px 6px;border-radius:10px">' + s.funcionario + '</span>' : '') + '</div>'
              +   (s.obs ? '<div style="font-size:11px;color:var(--color-text-muted);margin-top:2px">' + s.obs + '</div>' : '')
              +   '<div style="display:flex;gap:8px;margin-top:4px;flex-wrap:wrap">'
              +     '<span style="font-size:11px;font-weight:700;color:var(--color-primary)">' + _brl(s.valor || 0) + '</span>'
              +     '<span onclick="togglePago(\'' + c.docId + '\',' + si + ')" style="font-size:10px;padding:2px 6px;border-radius:4px;cursor:pointer;font-weight:600;' + (s.pago ? 'background:#d4edda;color:#155724' : 'background:#f8d7da;color:#721c24') + '">💰 ' + (s.pago ? 'Pago' : 'Pendente') + '</span>'
              +     '<span onclick="toggleEntregue(\'' + c.docId + '\',' + si + ')" style="font-size:10px;padding:2px 6px;border-radius:4px;cursor:pointer;font-weight:600;' + (s.entregue ? 'background:#d4edda;color:#155724' : 'background:#fff3cd;color:#856404') + '">📦 ' + (s.entregue ? 'Entregue' : 'Pendente') + '</span>'
              +   '</div>'
              + '</div>'
              + '</div>';
          }).join('')
        + '</div>'
        + '<div style="margin-top:8px;display:flex;gap:6px">'
        +   '<button onclick="adicionarServico(\'' + c.docId + '\')" style="flex:1;padding:6px;border-radius:6px;background:var(--color-surface-offset);border:1px dashed var(--color-border);cursor:pointer;font-size:11px;font-weight:600;color:var(--color-text-muted)">+ Adicionar serviço</button>'
        + '</div>'
        + '</div>';
    }).join('');
  }

  /* ── Toggle pago/entregue ── */
  window.togglePago = function(docId, idx) {
    var c = _clientes.find(function(x) { return x.docId === docId; });
    if (!c) return;
    c.servicos[idx].pago = !c.servicos[idx].pago;
    _verificarFinalizado(c);
    _salvarCliente(c);
    _renderClientes();
  };

  window.toggleEntregue = function(docId, idx) {
    var c = _clientes.find(function(x) { return x.docId === docId; });
    if (!c) return;
    c.servicos[idx].entregue = !c.servicos[idx].entregue;
    _verificarFinalizado(c);
    _salvarCliente(c);
    _renderClientes();
  };

  function _verificarFinalizado(c) {
    var todoPago = c.servicos.every(function(s) { return s.pago; });
    var todoEntregue = c.servicos.every(function(s) { return s.entregue; });
    if (todoPago && todoEntregue && c.servicos.length > 0) {
      setTimeout(function() {
        if (confirm('✅ Todos os serviços de ' + c.nome + ' foram pagos e entregues!\n\nRemover da lista de andamento?')) {
          excluirCliente(c.docId);
        }
      }, 300);
    }
  }

  /* ── Adicionar serviço ao cliente ── */
  window.adicionarServico = function(docId) {
    var c = _clientes.find(function(x) { return x.docId === docId; });
    if (!c) return;
    _abrirFormServico(c);
  };

  function _abrirFormServico(c) {
    document.getElementById('clienteFormTitulo').textContent = 'Adicionar serviço — ' + c.nome;
    document.getElementById('clienteFormDocId').value = c.docId || '';
    document.getElementById('clienteFormMode').value = 'servico';
    document.getElementById('clienteNomeWrap').style.display = 'none';
    document.getElementById('clienteTelWrap').style.display = 'none';
    document.getElementById('clienteFormPanel').style.display = 'flex';
    document.getElementById('clienteDescricao').value = '';
    document.getElementById('clienteValor').value = '';
    document.getElementById('clienteObs').value = '';
  }

  /* ── Editar cliente ── */
  window.editarCliente = function(docId) {
    var c = _clientes.find(function(x) { return x.docId === docId; });
    if (!c) return;
    document.getElementById('clienteFormTitulo').textContent = 'Editar cliente';
    document.getElementById('clienteFormDocId').value = c.docId;
    document.getElementById('clienteFormMode').value = 'editar';
    document.getElementById('clienteNome').value = c.nome || '';
    document.getElementById('clienteTelefone').value = c.telefone || '';
    document.getElementById('clienteNomeWrap').style.display = 'flex';
    document.getElementById('clienteTelWrap').style.display = 'flex';
    document.getElementById('clienteDescricao').value = '';
    document.getElementById('clienteValor').value = '';
    document.getElementById('clienteObs').value = '';
    document.getElementById('clienteFormPanel').style.display = 'flex';
  };

  /* ── Excluir cliente ── */
  window.excluirCliente = function(docId) {
    var c = _clientes.find(function(x) { return x.docId === docId; });
    var nome = c ? c.nome : 'este cliente';
    if (!confirm('Remover ' + nome + ' da lista?')) return;
    if (window.excluirClienteFirebase) {
      window.excluirClienteFirebase(docId).then(function() {
        _clientes = _clientes.filter(function(x) { return x.docId !== docId; });
        _renderClientes();
        showToast('✅ Cliente removido');
      });
    }
  };

  /* ── Salvar form ── */
  window.salvarClienteForm = function() {
    var mode = document.getElementById('clienteFormMode').value;
    var docId = document.getElementById('clienteFormDocId').value;

    if (mode === 'novo') {
      var nome = document.getElementById('clienteNome').value.trim();
      var tel = document.getElementById('clienteTelefone').value.trim();
      var desc = document.getElementById('clienteDescricao').value.trim();
      var val = parseFloat(document.getElementById('clienteValor').value.replace(',', '.')) || 0;
      var obs = document.getElementById('clienteObs').value.trim();
      if (!nome) { document.getElementById('clienteNome').focus(); return; }
      if (!desc) { document.getElementById('clienteDescricao').focus(); return; }
      var novo = {
        nome: nome,
        telefone: tel,
        criadoEm: new Date().toISOString(),
        servicos: [{ descricao: desc, valor: val, obs: obs, funcionario: document.getElementById('clienteFuncionario').value, pago: false, entregue: false }]
      };
      if (window.salvarClienteFirebase) {
        window.salvarClienteFirebase(novo).then(function(id) {
          novo.docId = id;
          _clientes.unshift(novo);
          _renderClientes();
          _fecharForm();
          showToast('✅ Cliente adicionado!');
        });
      }
    } else if (mode === 'servico') {
      var c = _clientes.find(function(x) { return x.docId === docId; });
      if (!c) return;
      var desc2 = document.getElementById('clienteDescricao').value.trim();
      var val2 = parseFloat(document.getElementById('clienteValor').value.replace(',', '.')) || 0;
      var obs2 = document.getElementById('clienteObs').value.trim();
      if (!desc2) { document.getElementById('clienteDescricao').focus(); return; }
      c.servicos.push({ descricao: desc2, valor: val2, obs: obs2, funcionario: document.getElementById('clienteFuncionario').value, pago: false, entregue: false });
      _salvarCliente(c);
      _renderClientes();
      _fecharForm();
      showToast('✅ Serviço adicionado!');
    } else if (mode === 'editar') {
      var c2 = _clientes.find(function(x) { return x.docId === docId; });
      if (!c2) return;
      c2.nome = document.getElementById('clienteNome').value.trim() || c2.nome;
      c2.telefone = document.getElementById('clienteTelefone').value.trim();
      _salvarCliente(c2);
      _renderClientes();
      _fecharForm();
      showToast('✅ Cliente atualizado!');
    }
  };

  function _salvarCliente(c) {
    if (window.atualizarClienteFirebase && c.docId) {
      window.atualizarClienteFirebase(c.docId, c).catch(function(e) {
        showToast('Erro ao salvar: ' + e.message);
      });
    }
  }

  function _fecharForm() {
    document.getElementById('clienteFormPanel').style.display = 'none';
  }

  /* ── Injetar HTML ── */
  function _injetarHTML() {
    var el = document.createElement('div');
    el.innerHTML = [
      '<div id="clientesOverlay" style="display:none;position:fixed;inset:0;z-index:600;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto">',
        '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:16px;width:min(720px,100%);display:flex;flex-direction:column;box-shadow:var(--shadow-lg);margin:auto">',

          // Header
          '<div style="display:flex;align-items:center;gap:12px;padding:18px 22px;border-bottom:1px solid var(--color-divider);flex-shrink:0">',
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#01696f" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            '<span style="font-size:1.1rem;font-weight:700;flex:1">Clientes em Andamento</span>',
            '<span id="clientesCount" style="font-size:12px;color:var(--color-text-muted);margin-right:8px"></span>',
            '<button onclick="fecharClientes()" style="background:var(--color-surface-offset);border:none;border-radius:8px;width:30px;height:30px;cursor:pointer;font-size:16px;color:var(--color-text-muted)">✕</button>',
          '</div>',

          // Busca + botão novo
          '<div style="padding:12px 22px;border-bottom:1px solid var(--color-divider);display:flex;gap:8px">',
            '<input id="clientesBusca" type="text" placeholder="Buscar por nome ou telefone..." oninput="_renderClientes()" style="flex:1;padding:8px 12px;border:1.5px solid var(--color-border);border-radius:8px;font-size:13px;background:var(--color-bg);color:var(--color-text);font-family:inherit;outline:none">',
            '<button onclick="_abrirNovoCliente()" style="padding:8px 16px;border-radius:8px;background:var(--color-primary);color:#fff;border:none;cursor:pointer;font-size:13px;font-weight:700;font-family:inherit;white-space:nowrap">+ Novo Cliente</button>',
          '</div>',

          // Form
          '<div id="clienteFormPanel" style="display:none;flex-direction:column;gap:10px;padding:16px 22px;border-bottom:1px solid var(--color-divider);background:var(--color-surface-offset)">',
            '<div style="font-size:12px;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.5px" id="clienteFormTitulo">Novo Cliente</div>',
            '<input type="hidden" id="clienteFormDocId">',
            '<input type="hidden" id="clienteFormMode" value="novo">',
            '<div id="clienteNomeWrap" style="display:flex;flex-direction:column;gap:4px">',
              '<label style="font-size:11px;font-weight:600;color:var(--color-text-muted)">Nome do cliente *</label>',
              '<input id="clienteNome" type="text" placeholder="Nome completo" style="padding:9px 12px;border:1.5px solid var(--color-border);border-radius:8px;font-size:13px;background:var(--color-bg);color:var(--color-text);font-family:inherit;outline:none">',
            '</div>',
            '<div id="clienteTelWrap" style="display:flex;flex-direction:column;gap:4px">',
              '<label style="font-size:11px;font-weight:600;color:var(--color-text-muted)">Telefone</label>',
              '<input id="clienteTelefone" type="tel" placeholder="(00) 00000-0000" style="padding:9px 12px;border:1.5px solid var(--color-border);border-radius:8px;font-size:13px;background:var(--color-bg);color:var(--color-text);font-family:inherit;outline:none">',
            '</div>',
            '<div style="display:flex;flex-direction:column;gap:4px">',
              '<label style="font-size:11px;font-weight:600;color:var(--color-text-muted)">Descrição do serviço *</label>',
              '<input id="clienteDescricao" type="text" placeholder="Ex: Etiqueta personalizada, Formatação..." style="padding:9px 12px;border:1.5px solid var(--color-border);border-radius:8px;font-size:13px;background:var(--color-bg);color:var(--color-text);font-family:inherit;outline:none">',
            '</div>',
            '<div style="display:flex;gap:10px">',
              '<div style="flex:1;display:flex;flex-direction:column;gap:4px">',
                '<label style="font-size:11px;font-weight:600;color:var(--color-text-muted)">Valor (R$)</label>',
                '<input id="clienteValor" type="number" step="0.01" min="0" placeholder="0,00" style="padding:9px 12px;border:1.5px solid var(--color-border);border-radius:8px;font-size:13px;background:var(--color-bg);color:var(--color-text);font-family:inherit;outline:none">',
              '</div>',
              '<div style="flex:2;display:flex;flex-direction:column;gap:4px">',
                '<label style="font-size:11px;font-weight:600;color:var(--color-text-muted)">Observação</label>',
                '<input id="clienteObs" type="text" placeholder="Detalhes, andamento..." style="padding:9px 12px;border:1.5px solid var(--color-border);border-radius:8px;font-size:13px;background:var(--color-bg);color:var(--color-text);font-family:inherit;outline:none">',
              '</div>',
            '<div style="display:flex;flex-direction:column;gap:4px">',
                '<label style="font-size:11px;font-weight:600;color:var(--color-text-muted)">Funcionário</label>',
                '<select id="clienteFuncionario" style="padding:9px 12px;border:1.5px solid var(--color-border);border-radius:8px;font-size:13px;background:var(--color-bg);color:var(--color-text);font-family:inherit;outline:none">',
                  '<option value="">Selecionar</option>',
                  '<option value="Atendente A">Atendente A</option>',
                  '<option value="Atendente B">Atendente B</option>',
                  '<option value="Atendente C">Atendente C</option>',
                  '<option value="Atendente D">Atendente D</option>',
                '</select>',
              '</div>',
            '</div>',
            '<div style="display:flex;gap:8px">',
              '<button onclick="salvarClienteForm()" style="flex:1;padding:10px;border-radius:8px;background:var(--color-primary);color:#fff;border:none;cursor:pointer;font-size:13px;font-weight:700;font-family:inherit">Salvar</button>',
              '<button onclick="document.getElementById(\'clienteFormPanel\').style.display=\'none\'" style="padding:10px 16px;border-radius:8px;background:var(--color-surface);border:1.5px solid var(--color-border);cursor:pointer;font-size:13px;font-family:inherit;color:var(--color-text-muted)">Cancelar</button>',
            '</div>',
          '</div>',

          // Lista
          '<div id="clientesLista" style="padding:16px 22px;display:flex;flex-direction:column;gap:10px;max-height:60vh;overflow-y:auto">',
          '</div>',

        '</div>',
      '</div>',

      // Botão flutuante
      '<button onclick="abrirClientes()" title="Clientes em andamento" style="position:fixed;bottom:220px;right:24px;z-index:299;background:#01696f;color:#fff;border:none;border-radius:999px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(1,105,111,.4);display:flex;align-items:center;gap:6px;font-family:inherit;transition:transform .15s">',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
        'Clientes',
      '</button>',
    ].join('');
    document.body.appendChild(el);

    // CSS
    var style = document.createElement('style');
    style.textContent = [
      '.cliente-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:12px;padding:14px 16px}',
      '#clientesOverlay.open{display:flex!important}',
    ].join('');
    document.head.appendChild(style);
  }

  window._abrirNovoCliente = function() {
    document.getElementById('clienteFormTitulo').textContent = 'Novo Cliente';
    document.getElementById('clienteFormDocId').value = '';
    document.getElementById('clienteFormMode').value = 'novo';
    document.getElementById('clienteNome').value = '';
    document.getElementById('clienteTelefone').value = '';
    document.getElementById('clienteDescricao').value = '';
    document.getElementById('clienteValor').value = '';
    document.getElementById('clienteObs').value = '';
    document.getElementById('clienteNomeWrap').style.display = 'flex';
    document.getElementById('clienteTelWrap').style.display = 'flex';
    document.getElementById('clienteFormPanel').style.display = 'flex';
  };

  window._renderClientes = _renderClientes;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _injetarHTML);
  } else {
    _injetarHTML();
  }

})();
