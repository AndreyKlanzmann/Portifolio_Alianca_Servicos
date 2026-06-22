/* ===========================
   PDV DEMO — FIREBASE (mock em memória)
   Simula a API do Firestore usada pelo sistema.
   Não faz nenhuma requisição de rede — os dados
   existem apenas nestes arrays em memória e
   resetam ao recarregar a página.
   =========================== */
(function () {
  'use strict';

  function _uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
  function _todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  // ── "Coleções" em memória ──────────────────────────────────────
  var _dbAtendimentos = [];
  var _dbProdutos = [];
  var _dbEstoqueMovimentos = [];
  var _dbCaixaFechamentos = {};
  var _dbDespesas = [];
  var _dbClientes = [];

  // ── Seed: atendimentos fictícios de hoje ────────────────────────
  (function seedAtendimentos() {
    var hoje = _todayISO();
    var seeds = [
      { time: '08:45', name: 'IPVA', qty: 1, tot: 6.00 },
      { time: '09:10', name: '2ª Via CEMIG', qty: 1, tot: 4.75 },
      { time: '09:50', name: 'Xerox P/B', qty: 3, tot: 7.50 },
      { time: '10:30', name: 'Currículo Personalizado', qty: 1, tot: 15.00 },
      { time: '11:20', name: 'Troca de Titularidade CEMIG', qty: 1, tot: 50.00 }
    ];
    seeds.forEach(function (s, i) {
      _dbAtendimentos.push({
        _docId: _uid('aten'),
        id: i + 1,
        time: s.time,
        items: [{ name: s.name, qty: s.qty, tot: s.tot }],
        total: s.tot,
        data: hoje,
        hora: s.time,
        vendedor: 'Demo',
        criadoEm: new Date().toISOString()
      });
    });
  })();

  // ── Seed: despesas fictícias de hoje ────────────────────────────
  (function seedDespesas() {
    var hoje = _todayISO();
    var seeds = [
      { hora: '08:05', descricao: 'Internet da loja', valor: 120.00, categoria: 'net_loja', obs: 'Mensalidade', tipo: 'manual' },
      { hora: '09:40', descricao: 'Papel A4 (resma)', valor: 24.90, categoria: 'insumos', obs: 'Reposição de estoque interno', tipo: 'manual' },
      { hora: '12:15', descricao: 'Almoço', valor: 18.00, categoria: 'almoco', obs: '', tipo: 'manual' }
    ];
    seeds.forEach(function (s) {
      _dbDespesas.push(Object.assign({ docId: _uid('desp') }, s, {
        data: hoje,
        criadoEm: new Date().toISOString()
      }));
    });
  })();

  // ── Seed: clientes em andamento fictícios ───────────────────────
  (function seedClientes() {
    _dbClientes.push({
      docId: _uid('cli'),
      nome: 'João Silva',
      telefone: '(00) 00000-0001',
      criadoEm: new Date().toISOString(),
      servicos: [
        { descricao: 'Formatação de notebook', valor: 80.00, obs: 'Aguardando peça chegar', funcionario: 'Atendente A', pago: false, entregue: false }
      ]
    });
    _dbClientes.push({
      docId: _uid('cli'),
      nome: 'Maria Souza',
      telefone: '(00) 00000-0002',
      criadoEm: new Date().toISOString(),
      servicos: [
        { descricao: 'Currículo + 5 cópias', valor: 25.00, obs: '', funcionario: 'Atendente B', pago: true, entregue: false }
      ]
    });
  })();

  // ════════════════════════════════════════════════════════════════
  //  ATENDIMENTOS
  // ════════════════════════════════════════════════════════════════

  async function salvarAtendimento(at) {
    var payload = {
      _docId: _uid('aten'),
      id: at.id,
      time: at.time,
      items: at.items,
      total: at.total,
      data: at.data,
      hora: at.hora,
      criadoEm: new Date().toISOString()
    };
    _dbAtendimentos.push(payload);
    at._docId = payload._docId;
    return payload._docId;
  }

  async function excluirAtendimento(docId) {
    if (!docId) throw new Error('docId vazio');
    _dbAtendimentos = _dbAtendimentos.filter(function (a) { return a._docId !== docId; });
    return true;
  }

  function _filtrarPeriodo(di, df) {
    return _dbAtendimentos
      .filter(function (a) { return a.data >= di && a.data <= df; })
      .slice()
      .sort(function (a, b) { return (a.data + a.hora).localeCompare(b.data + b.hora); });
  }

  async function carregarAtendimentosPorPeriodo(dataInicioISO, dataFimISO) {
    return _filtrarPeriodo(dataInicioISO, dataFimISO);
  }

  async function carregarTodosAtendimentos() {
    return _filtrarPeriodo('0000-00-00', '9999-99-99');
  }

  async function carregarAtendimentosDoDia(dataISO) {
    return _filtrarPeriodo(dataISO, dataISO);
  }

  // Replica o boot do Firebase real: ao carregar a página, busca os
  // atendimentos já "salvos" de hoje e injeta no histórico do cart.js
  window.addEventListener('load', async function () {
    var dataISO = _todayISO();
    var listaFS = await carregarAtendimentosDoDia(dataISO);
    if (listaFS.length > 0) {
      listaFS.forEach(function (a) { a._syncStatus = 'saved'; });
      _atendimentos = listaFS.concat(_atendimentos || []);
      var maxId = 0;
      for (var i = 0; i < _atendimentos.length; i++) {
        if (_atendimentos[i].id && _atendimentos[i].id > maxId) maxId = _atendimentos[i].id;
      }
      if (maxId > 0) _atenCount = maxId;
      _renderHistory();
      _updateDayTotal();
    }
  });

  // ════════════════════════════════════════════════════════════════
  //  PRODUTOS / ESTOQUE
  // ════════════════════════════════════════════════════════════════

  async function carregarProdutos() {
    return _dbProdutos.slice().sort(function (a, b) { return a.nome.localeCompare(b.nome); });
  }

  async function salvarProduto(prod) {
    if (!prod.codigo) throw new Error('produto sem código');
    var docId = String(prod.codigo);
    var payload = {
      _docId: docId,
      codigo: Number(prod.codigo),
      nome: String(prod.nome || '').trim(),
      grupo: String(prod.grupo || 'OUTROS').trim(),
      subgrupo: String(prod.subgrupo || '').trim(),
      preco: Number(prod.preco) || 0,
      unid: String(prod.unid || 'UN').trim(),
      estoque: Number(prod.estoque) || 0,
      estoqueMinimo: Number(prod.estoqueMinimo) || 0,
      ativo: prod.ativo !== false,
      origem: prod.origem || 'manual',
      atualizadoEm: new Date().toISOString()
    };
    var idx = _dbProdutos.findIndex(function (p) { return p._docId === docId; });
    if (idx >= 0) _dbProdutos[idx] = Object.assign({}, _dbProdutos[idx], payload);
    else _dbProdutos.push(payload);
    return docId;
  }

  async function deletarProduto(codigo) {
    _dbProdutos = _dbProdutos.filter(function (p) { return String(p.codigo) !== String(codigo); });
  }

  async function entradaEstoque(codigo, quantidade, motivo) {
    var prod = _dbProdutos.find(function (p) { return String(p.codigo) === String(codigo); });
    if (prod) {
      prod.estoque = (Number(prod.estoque) || 0) + Number(quantidade);
      prod.atualizadoEm = new Date().toISOString();
    }
    _dbEstoqueMovimentos.push({
      codigo: Number(codigo),
      tipo: 'entrada',
      quantidade: Number(quantidade),
      motivo: motivo || 'Entrada manual',
      em: new Date().toISOString()
    });
  }

  async function baixaEstoque(codigo, quantidade, atendimentoId) {
    var prod = _dbProdutos.find(function (p) { return String(p.codigo) === String(codigo); });
    if (!prod) return;
    prod.estoque = (Number(prod.estoque) || 0) - Math.abs(Number(quantidade));
    prod.atualizadoEm = new Date().toISOString();
    _dbEstoqueMovimentos.push({
      codigo: Number(codigo),
      tipo: 'venda',
      quantidade: Number(quantidade),
      atendimentoId: atendimentoId || null,
      em: new Date().toISOString()
    });
  }

  async function importarProdutosEmLote(lista) {
    lista.forEach(function (p) {
      var docId = String(p.codigo);
      var payload = {
        _docId: docId,
        codigo: Number(p.codigo),
        nome: String(p.nome || '').trim(),
        grupo: String(p.grupo || 'OUTROS').trim(),
        subgrupo: String(p.subgrupo || '').trim(),
        preco: Number(p.preco) || 0,
        unid: String(p.unid || 'UN').trim(),
        estoque: Number(p.estoque) || 0,
        estoqueMinimo: Number(p.estoqueMinimo) || 0,
        ativo: true,
        origem: 'SMB',
        atualizadoEm: new Date().toISOString()
      };
      var idx = _dbProdutos.findIndex(function (x) { return x._docId === docId; });
      if (idx >= 0) _dbProdutos[idx] = Object.assign({}, _dbProdutos[idx], payload);
      else _dbProdutos.push(payload);
    });
    return lista.length;
  }

  // ════════════════════════════════════════════════════════════════
  //  FECHAMENTO DE CAIXA
  // ════════════════════════════════════════════════════════════════

  async function fecharCaixaFirebase(dataISO, info) {
    var existente = _dbCaixaFechamentos[dataISO] || { data: dataISO };
    var payload = Object.assign({}, existente, {
      data: dataISO,
      fechadoEm: new Date().toISOString(),
      fechadoPor: 'Demo',
      atendimentos: (info && info.atendimentos !== undefined) ? info.atendimentos : (existente.atendimentos || 0),
      total: (info && info.total !== undefined) ? info.total : (existente.total || 0),
      moeda: (info && info.moeda !== undefined) ? info.moeda : (existente.moeda || 0),
      recolhido: (info && info.recolhido !== undefined) ? info.recolhido : (existente.recolhido || 0)
    });
    _dbCaixaFechamentos[dataISO] = payload;
    return payload;
  }

  async function reabrirCaixaFirebase(dataISO) {
    delete _dbCaixaFechamentos[dataISO];
  }

  async function listarCaixaFechamentos(inicioISO, fimISO) {
    return Object.keys(_dbCaixaFechamentos).filter(function (d) { return d >= inicioISO && d <= fimISO; });
  }

  async function caixaJaFechado(dataISO) {
    return !!_dbCaixaFechamentos[dataISO];
  }

  async function buscarFechamentoPorData(dataISO) {
    return _dbCaixaFechamentos[dataISO] || null;
  }

  async function carregarCaixaFechado() {
    return null;
  }

  // ════════════════════════════════════════════════════════════════
  //  DESPESAS
  // ════════════════════════════════════════════════════════════════

  async function salvarDespesaFirebase(desp) {
    var docId = _uid('desp');
    _dbDespesas.unshift(Object.assign({ docId: docId }, desp));
    return docId;
  }

  async function atualizarDespesaFirebase(docId, dados) {
    var idx = _dbDespesas.findIndex(function (d) { return d.docId === docId; });
    if (idx >= 0) {
      var payload = Object.assign({}, dados);
      delete payload.docId;
      _dbDespesas[idx] = Object.assign({}, _dbDespesas[idx], payload);
    }
  }

  async function excluirDespesaFirebase(docId) {
    _dbDespesas = _dbDespesas.filter(function (d) { return d.docId !== docId; });
  }

  async function carregarDespesasHoje(dataISO) {
    return _dbDespesas.filter(function (d) { return d.data === dataISO; });
  }

  // ════════════════════════════════════════════════════════════════
  //  CLIENTES EM ANDAMENTO
  // ════════════════════════════════════════════════════════════════

  async function salvarClienteFirebase(cliente) {
    var docId = _uid('cli');
    _dbClientes.unshift(Object.assign({ docId: docId }, cliente));
    return docId;
  }

  async function atualizarClienteFirebase(docId, dados) {
    var idx = _dbClientes.findIndex(function (c) { return c.docId === docId; });
    if (idx >= 0) {
      var payload = Object.assign({}, dados);
      delete payload.docId;
      _dbClientes[idx] = Object.assign({}, _dbClientes[idx], payload);
    }
  }

  async function excluirClienteFirebase(docId) {
    _dbClientes = _dbClientes.filter(function (c) { return c.docId !== docId; });
  }

  async function carregarClientesAtivos() {
    return _dbClientes.slice().sort(function (a, b) { return (b.criadoEm || '').localeCompare(a.criadoEm || ''); });
  }

  // ════════════════════════════════════════════════════════════════
  //  FUNCIONÁRIOS / SERVIÇOS
  //  (sem telas que os usem nesta demo — mantidos só para compatibilidade de API)
  // ════════════════════════════════════════════════════════════════

  async function autenticarFuncionario() { return null; }
  async function listarFuncionarios() { return []; }
  async function salvarFuncionario(nome) {
    return String(nome || '').toLowerCase().trim().replace(/\s+/g, '_');
  }
  async function atualizarStatusFuncionario() {}
  async function trocarSenhaFuncionario() {}
  async function carregarServicosFirebase() { return null; } // null = usa data.js como fallback
  async function salvarServico(dados, docId) { return docId || _uid('srv'); }
  async function removerServico() {}

  // ════════════════════════════════════════════════════════════════
  //  EXPOSIÇÃO GLOBAL
  // ════════════════════════════════════════════════════════════════

  window.db = {}; // placeholder truthy — só para checagens "if (window.db && ...)"

  window.salvarAtendimento = salvarAtendimento;
  window.excluirAtendimento = excluirAtendimento;
  window.carregarAtendimentosDoDia = carregarAtendimentosDoDia;
  window.carregarAtendimentosPorPeriodo = carregarAtendimentosPorPeriodo;
  window.carregarTodosAtendimentos = carregarTodosAtendimentos;

  window.carregarProdutos = carregarProdutos;
  window.salvarProduto = salvarProduto;
  window.deletarProduto = deletarProduto;
  window.entradaEstoque = entradaEstoque;
  window.baixaEstoque = baixaEstoque;
  window.importarProdutosEmLote = importarProdutosEmLote;

  window.fecharCaixaFirebase = fecharCaixaFirebase;
  window.reabrirCaixaFirebase = reabrirCaixaFirebase;
  window.listarCaixaFechamentos = listarCaixaFechamentos;
  window.caixaJaFechado = caixaJaFechado;
  window.buscarFechamentoPorData = buscarFechamentoPorData;
  window.carregarCaixaFechado = carregarCaixaFechado;

  window.salvarDespesaFirebase = salvarDespesaFirebase;
  window.atualizarDespesaFirebase = atualizarDespesaFirebase;
  window.excluirDespesaFirebase = excluirDespesaFirebase;
  window.carregarDespesasHoje = carregarDespesasHoje;

  window.salvarClienteFirebase = salvarClienteFirebase;
  window.atualizarClienteFirebase = atualizarClienteFirebase;
  window.excluirClienteFirebase = excluirClienteFirebase;
  window.carregarClientesAtivos = carregarClientesAtivos;

  window._autenticarFuncionario = autenticarFuncionario;
  window._listarFuncionarios = listarFuncionarios;
  window._salvarFuncionario = salvarFuncionario;
  window._atualizarStatusFuncionario = atualizarStatusFuncionario;
  window._trocarSenhaFuncionario = trocarSenhaFuncionario;
  window._carregarServicosFirebase = carregarServicosFirebase;
  window._salvarServico = salvarServico;
  window._removerServico = removerServico;

  console.log('[DEMO] Firebase simulado em memória. Dados resetam ao recarregar.');

})();
