/* ===========================
   PDV DEMO — RELATORIOS
   =========================== */

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  _renderCart();
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

//  MODO RÁPIDO

var QUICK_PRESETS = [
  {label:'Xerox P/B',        name:'Xerox / Cópia',                      tierKey:'Xerox P/B',                                          fixedPrice:0.50},
  {label:'Impressão P/B',    name:'Impressão PB Frente Apostila',        tierKey:'Impressão P/B (Apenas Frente) [Apostila]',            fixedPrice:2.50},
  {label:'IPVA',             name:'IPVA',                                tierKey:null,                                                  fixedPrice:6.00},
  {label:'CRLV',             name:'Imprimir CRLV',                       tierKey:null,                                                  fixedPrice:6.00},
  {label:'Currículo',        name:'Currículo Padrão',                    tierKey:null,                                                  fixedPrice:10.00},
  {label:'Plastif. Pequena', name:'Plastificação Pequena',               tierKey:null,                                                  fixedPrice:4.00},
  {label:'Plastif. Grande',  name:'Plastificação Grande',                tierKey:null,                                                  fixedPrice:6.00},
  {label:'Foto',             name:'Foto Polaroid',                       tierKey:null,                                                  fixedPrice:6.00},
  {label:'Multa',            name:'Multas',                              tierKey:null,                                                  fixedPrice:6.00},
  {label:'Imp. Colorida',    name:'Impressão Colorida Frente Apostila',  tierKey:'Impressão Colorida (Apenas Frente) [Apostila]',       fixedPrice:3.00},
  {label:'Boleto / 2ª Via',  name:'Boleto / 2ª Via',                     tierKey:null,                                                  fixedPrice:4.75},
  {label:'Consulta R$4',     name:'Consulta Completa',                   tierKey:null,                                                  fixedPrice:4.00},
  {label:'Consulta R$2',     name:'Consulta Básica',                     tierKey:null,                                                  fixedPrice:2.00},
  {label:'Papel Cartão',     name:'Papel Cartão',                        tierKey:null,                                                  fixedPrice:4.00}
];

var _quickCart = {}; // name -> qty

function _qUnitPrice(preset, qty) {
  if (preset.tierKey && TIERS[preset.tierKey]) {
    var p = _tierPrice(preset.tierKey, qty);
    if (p !== null) return p;
  }
  return preset.fixedPrice;
}

function _qItemTotal(preset, qty) {
  if (qty === 0) return 0;
  return _qUnitPrice(preset, qty) * qty;
}

function _renderQuickGrid() {
  var grid = document.getElementById('quickGrid');
  var totalEl = document.getElementById('quickTotal');
  if (!grid) return;
  var out = '';
  var sum = 0;
  for (var i = 0; i < QUICK_PRESETS.length; i++) {
    var p = QUICK_PRESETS[i];
    var qty = _quickCart[p.name] || 0;
    var unitP = qty > 0 ? _qUnitPrice(p, qty) : p.fixedPrice;
    var itemTot = _qItemTotal(p, qty);
    sum += itemTot;
    var hasTier = p.tierKey && TIERS[p.tierKey];
    var discountLabel = '';
    if (hasTier && qty > 1) {
      discountLabel = '<span style="font-size:9px;color:var(--color-success);font-weight:700">R$ ' + unitP.toFixed(2).replace('.',',') + '/un</span>';
    }
    out += '<div class="quick-btn-wrap">' +
      '<button class="quick-btn" onclick="_quickAdd(' + i + ')">' +
        '<span class="quick-btn-label">' + p.label + '</span>' +
        '<span class="quick-btn-price">R$ ' + p.fixedPrice.toFixed(2).replace('.',',') + '</span>' +
        (qty > 0 ? '<span style="font-size:10px;color:var(--color-text-muted)">x' + qty + ' = R$ ' + itemTot.toFixed(2).replace('.',',') + '</span>' : '') +
        discountLabel +
      '</button>' +
      '<span class="quick-btn-badge' + (qty > 0 ? ' show' : '') + '">' + (qty > 0 ? qty : '') + '</span>' +
    '</div>';
  }
  grid.innerHTML = out;
  if (totalEl) totalEl.textContent = 'R$ ' + sum.toFixed(2).replace('.',',');
}

function _quickAdd(idx) {
  var p = QUICK_PRESETS[idx];
  _quickCart[p.name] = (_quickCart[p.name] || 0) + 1;
  _renderQuickGrid();
}

function quickClear() {
  _quickCart = {};
  _renderQuickGrid();
}

function quickFinish() {
  var keys = Object.keys(_quickCart);
  if (keys.length === 0) { alert('Nenhum serviço adicionado!'); return; }
  for (var i = 0; i < keys.length; i++) {
    var name = keys[i];
    var qty = _quickCart[name];
    var preset = null;
    for (var j = 0; j < QUICK_PRESETS.length; j++) {
      if (QUICK_PRESETS[j].name === name) { preset = QUICK_PRESETS[j]; break; }
    }
    if (!preset) continue;
    var unitP = _qUnitPrice(preset, qty);
    var ex = null;
    for (var k = 0; k < _cart.length; k++) { if (_cart[k].name === name) { ex = _cart[k]; break; } }
    if (ex) { ex.qty += qty; }
    else { _cart.push({uid: 'q_' + i + '_' + Date.now(), name: name, qty: qty, basePrice: unitP}); }
  }
  finishAttendance();
  _quickCart = {};
  _renderQuickGrid();
  closeQuickMode();
}

function openQuickMode() {
  document.getElementById('quickModeOverlay').classList.add('open');
  _renderQuickGrid();
}

function closeQuickMode() {
  document.getElementById('quickModeOverlay').classList.remove('open');
}

//  TOTAL DO DIA

function _updateDayTotal() {
  var val = document.getElementById('dayTotalVal');
  var clients = document.getElementById('dayTotalClients');
  if (!val || !clients) return;
  var visiveis = _atendimentosDoDia();
  var sum = 0;
  for (var i = 0; i < visiveis.length; i++) sum += (visiveis[i].item.total || 0);
  val.textContent = 'R$ ' + sum.toFixed(2).replace('.',',');
  var n = visiveis.length;
  clients.textContent = n + ' atendimento' + (n !== 1 ? 's' : '');
  _updateCaixaStatusBadge();
}

function _updateCaixaStatusBadge() {
  var badge = document.getElementById('dayCaixaStatus');
  if (!badge) return;
  try {
    var hoje = _hojeISO();
    // Fonte da verdade: Firebase (cache local serve só pra UI instantânea)
    var cacheFirebase = JSON.parse(localStorage.getItem('pdvdemo_caixa_cache_v1') || '{"dias":[]}');
    var log = JSON.parse(localStorage.getItem('pdvdemo_tg_sent_log_v1') || '{}');
    var fechado = cacheFirebase.dias.indexOf(hoje) !== -1 || (log.day || []).indexOf(hoje) !== -1;
    if (fechado) {
      badge.textContent = '✓ Fechado';
      badge.style.background = '#dcfce7';
      badge.style.color = '#166534';
      badge.title = 'Caixa de hoje já foi fechado (sincronizado entre PCs)';
    } else {
      badge.textContent = '○ Aberto';
      badge.style.background = '#fef3c7';
      badge.style.color = '#92400e';
      badge.title = 'Caixa de hoje em andamento';
    }
  } catch(e){}
}

//  ATALHOS DE TECLADO

document.addEventListener('keydown', function(e) {
  var tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  if (e.key === 'Escape') {
    closeQuickMode();
    closeCart();
    closePatch();
    fecharHistoricoAnterior();
    fecharExportCSV();
    var ov = document.getElementById('svcOv');
    if (ov) ov.classList.remove('open');
  }
  if (e.key === 'q' || e.key === 'Q') {
    var qm = document.getElementById('quickModeOverlay');
    if (qm && qm.classList.contains('open')) closeQuickMode();
    else openQuickMode();
  }
  if (e.key === 'c' || e.key === 'C') {
    var cd = document.getElementById('cartDrawer');
    if (cd && cd.classList.contains('open')) closeCart();
    else openCart();
  }
});

//  HISTÓRICO ANTERIOR (DIAS PASSADOS)

function abrirHistoricoAnterior() {
  document.getElementById('histAntOverlay').classList.add('open');
  // pré-preenche com ontem → hoje
  var hoje = _todayISO();
  var ontem = new Date(); ontem.setDate(ontem.getDate() - 7);
  var ontemISO = ontem.getFullYear()+'-'+('0'+(ontem.getMonth()+1)).slice(-2)+'-'+('0'+ontem.getDate()).slice(-2);
  var di = document.getElementById('histAntDataIni');
  var df = document.getElementById('histAntDataFim');
  if (di && !di.value) di.value = ontemISO;
  if (df && !df.value) df.value = hoje;
}
function fecharHistoricoAnterior() {
  document.getElementById('histAntOverlay').classList.remove('open');
}
function _histAntPreset(dias) {
  var hoje = new Date();
  var hojeISO = hoje.getFullYear()+'-'+('0'+(hoje.getMonth()+1)).slice(-2)+'-'+('0'+hoje.getDate()).slice(-2);
  var di = document.getElementById('histAntDataIni');
  var df = document.getElementById('histAntDataFim');
  if (dias === 0) { di.value = hojeISO; df.value = hojeISO; }
  else if (dias === 1) {
    var ontem = new Date(); ontem.setDate(ontem.getDate() - 1);
    var ontemISO = ontem.getFullYear()+'-'+('0'+(ontem.getMonth()+1)).slice(-2)+'-'+('0'+ontem.getDate()).slice(-2);
    di.value = ontemISO; df.value = ontemISO;
  } else {
    var ini = new Date(); ini.setDate(ini.getDate() - (dias - 1));
    var iniISO = ini.getFullYear()+'-'+('0'+(ini.getMonth()+1)).slice(-2)+'-'+('0'+ini.getDate()).slice(-2);
    di.value = iniISO; df.value = hojeISO;
  }
  buscarHistoricoAnterior();
}

async function buscarHistoricoAnterior() {
  var di = document.getElementById('histAntDataIni').value;
  var df = document.getElementById('histAntDataFim').value;
  var lista = document.getElementById('histAntLista');
  var resumo = document.getElementById('histAntResumo');
  if (!di || !df) { alert('Selecione as datas de início e fim'); return; }
  if (di > df) { alert('Data inicial deve ser anterior à final'); return; }
  if (!window.carregarAtendimentosPorPeriodo) { alert('Firebase não disponível'); return; }

  lista.innerHTML = '<div style="text-align:center;color:var(--color-text-muted);font-size:13px;padding:30px">⏳ Buscando no Firebase...</div>';
  resumo.style.display = 'none';

  try {
    var dados = await window.carregarAtendimentosPorPeriodo(di, df);
    if (dados.length === 0) {
      lista.innerHTML = '<div style="text-align:center;color:var(--color-text-muted);font-size:13px;padding:30px">Nenhum atendimento no período</div>';
      return;
    }

    // Resumo geral
    var totalGeral = 0, totalItens = 0;
    var porDia = {};
    for (var i = 0; i < dados.length; i++) {
      totalGeral += (dados[i].total || 0);
      for (var j = 0; j < dados[i].items.length; j++) totalItens += dados[i].items[j].qty || 0;
      var dt = dados[i].data;
      if (!porDia[dt]) porDia[dt] = { total: 0, n: 0 };
      porDia[dt].total += dados[i].total || 0;
      porDia[dt].n++;
    }
    var diasUnicos = Object.keys(porDia).length;
    resumo.style.display = 'flex';
    resumo.innerHTML =
      '<div><strong style="color:#2a7a2a;font-size:18px">' + _brl(totalGeral) + '</strong><br><span style="font-size:11px;color:#555">Total no período</span></div>' +
      '<div><strong>' + dados.length + '</strong><br><span style="font-size:11px;color:#555">Atendimentos</span></div>' +
      '<div><strong>' + totalItens + '</strong><br><span style="font-size:11px;color:#555">Itens vendidos</span></div>' +
      '<div><strong>' + diasUnicos + '</strong><br><span style="font-size:11px;color:#555">Dia' + (diasUnicos!==1?'s':'') + ' com vendas</span></div>' +
      '<div><strong>' + _brl(totalGeral / Math.max(1, diasUnicos)) + '</strong><br><span style="font-size:11px;color:#555">Média / dia</span></div>';

    // Agrupar por dia
    var grupos = {};
    for (var i = 0; i < dados.length; i++) {
      var d = dados[i].data || '----';
      if (!grupos[d]) grupos[d] = [];
      grupos[d].push(dados[i]);
    }
    var datas = Object.keys(grupos).sort().reverse(); // mais recente em cima

    var html = '';
    for (var k = 0; k < datas.length; k++) {
      var dia = datas[k];
      var ats = grupos[dia];
      var totDia = 0;
      for (var i = 0; i < ats.length; i++) totDia += ats[i].total || 0;
      // formato pt-BR da data
      var partes = dia.split('-');
      var dataFmt = partes[2] + '/' + partes[1] + '/' + partes[0];

      html += '<div style="border:1px solid var(--color-border);border-radius:8px;overflow:hidden;background:var(--color-surface)">' +
        '<div style="background:var(--color-surface-offset);padding:8px 12px;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:13px;border-bottom:1px solid var(--color-border)">' +
          '<span>📅 ' + dataFmt + ' — ' + ats.length + ' atendimento' + (ats.length!==1?'s':'') + '</span>' +
          '<span style="color:var(--color-success);font-weight:800">' + _brl(totDia) + '</span>' +
        '</div>' +
        '<div style="padding:8px 12px;display:flex;flex-direction:column;gap:6px">';
      for (var i = 0; i < ats.length; i++) {
        var a = ats[i];
        var resItens = '';
        for (var j = 0; j < a.items.length; j++) {
          resItens += (j > 0 ? ', ' : '') + (a.items[j].qty > 1 ? a.items[j].qty + 'x ' : '') + a.items[j].name;
        }
        html += '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 8px;background:var(--color-bg);border-radius:6px;font-size:12px">' +
          '<div style="flex:1;min-width:0"><strong>#' + (a.id || '-') + '</strong> <span style="color:var(--color-text-muted)">' + (a.hora || a.time || '') + '</span><br><span style="color:var(--color-text-muted);font-size:11px">' + resItens + '</span></div>' +
          '<span style="font-weight:700;color:var(--color-primary)">' + _brl(a.total) + '</span>' +
          '<button onclick="_excluirHistoricoAnterior(\'' + a._docId + '\', this)" title="Excluir do Firebase" style="padding:4px 8px;border-radius:4px;background:#fee2e2;color:#a12c7b;border:1px solid #f5b8c8;cursor:pointer;font-size:10px;font-weight:700">✕</button>' +
        '</div>';
      }
      html += '</div></div>';
    }
    lista.innerHTML = html;
  } catch (e) {
    lista.innerHTML = '<div style="text-align:center;color:var(--color-error);font-size:13px;padding:30px">Erro: ' + (e.message || e) + '</div>';
  }
}

async function _excluirHistoricoAnterior(docId, btn) {
  if (!docId) return;
  if (!confirm('Excluir esse atendimento do Firebase?\nEssa ação não pode ser desfeita.')) return;
  try {
    btn.disabled = true; btn.textContent = '...';
    await window.excluirAtendimento(docId);
    // também remove do _atendimentos local (se existir)
    for (var i = _atendimentos.length - 1; i >= 0; i--) {
      if (_atendimentos[i]._docId === docId) {
        _atendimentos.splice(i, 1);
      }
    }
    _renderHistory();
    _updateDayTotal();
    buscarHistoricoAnterior(); // recarrega a lista
  } catch (e) {
    alert('Erro ao excluir: ' + (e.message || e));
    btn.disabled = false; btn.textContent = '✕';
  }
}

//  EXPORTAR CSV

function abrirExportCSV() {
  document.getElementById('exportCsvOverlay').classList.add('open');
  var hoje = _todayISO();
  var di = document.getElementById('csvDataIni');
  var df = document.getElementById('csvDataFim');
  if (di && !di.value) {
    var ini = new Date(); ini.setDate(ini.getDate() - 29);
    di.value = ini.getFullYear()+'-'+('0'+(ini.getMonth()+1)).slice(-2)+'-'+('0'+ini.getDate()).slice(-2);
  }
  if (df && !df.value) df.value = hoje;
  document.getElementById('csvStatus').style.display = 'none';
}
function fecharExportCSV() {
  document.getElementById('exportCsvOverlay').classList.remove('open');
}
function _csvPreset(dias) {
  var hoje = new Date();
  var hojeISO = hoje.getFullYear()+'-'+('0'+(hoje.getMonth()+1)).slice(-2)+'-'+('0'+hoje.getDate()).slice(-2);
  var di = document.getElementById('csvDataIni');
  var df = document.getElementById('csvDataFim');
  if (dias === -1) { di.value = '2020-01-01'; df.value = hojeISO; }
  else if (dias === 0) { di.value = hojeISO; df.value = hojeISO; }
  else {
    var ini = new Date(); ini.setDate(ini.getDate() - (dias - 1));
    di.value = ini.getFullYear()+'-'+('0'+(ini.getMonth()+1)).slice(-2)+'-'+('0'+ini.getDate()).slice(-2);
    df.value = hojeISO;
  }
}

// Escapa um valor para CSV (RFC 4180): aspas duplas, escapa aspas internas, etc.
function _csvEsc(v, sep) {
  if (v === null || v === undefined) return '';
  var s = String(v);
  if (s.indexOf('"') !== -1 || s.indexOf(sep) !== -1 || s.indexOf('\n') !== -1 || s.indexOf('\r') !== -1) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

async function exportarCSV() {
  var di = document.getElementById('csvDataIni').value;
  var df = document.getElementById('csvDataFim').value;
  var incItens = document.getElementById('csvIncluirItens').checked;
  var incResumo = document.getElementById('csvIncluirResumo').checked;
  var sepVirgula = document.getElementById('csvSepVirgula').checked;
  var status = document.getElementById('csvStatus');
  var btn = document.getElementById('csvBtnDownload');

  if (!di || !df) { alert('Selecione as datas'); return; }
  if (di > df) { alert('Data inicial deve ser anterior à final'); return; }
  if (!window.carregarAtendimentosPorPeriodo) { alert('Firebase não disponível'); return; }

  // separador: ponto e vírgula (padrão Excel pt-BR) ou vírgula
  var SEP = sepVirgula ? ',' : ';';
  // decimais: se sep é vírgula, decimais com ponto. Senão, decimais com vírgula (pt-BR).
  var dec = sepVirgula ? '.' : ',';
  function fmtMoney(v) { return (Number(v) || 0).toFixed(2).replace('.', dec); }
  function fmtNum(v) { return String(Number(v) || 0); }

  btn.disabled = true; btn.textContent = '⏳ Buscando...';
  status.style.display = 'block';
  status.style.background = '#fff8e6'; status.style.color = '#b08a3a';
  status.textContent = 'Carregando dados do Firebase...';

  try {
    var dados = await window.carregarAtendimentosPorPeriodo(di, df);
    if (dados.length === 0) {
      status.style.background = '#fee2e2'; status.style.color = '#a12c7b';
      status.textContent = 'Nenhum atendimento encontrado no período';
      btn.disabled = false; btn.textContent = '⬇ Baixar Planilha';
      return;
    }

    btn.textContent = '⏳ Gerando planilha...';
    status.textContent = 'Gerando planilha com ' + dados.length + ' atendimento(s)...';

    var linhas = [];
    // Cabeçalho de metadados (comentários iníciais)
    var hoje = new Date();
    linhas.push(_csvEsc('PDV Demo — Relatório de Atendimentos', SEP));
    linhas.push(_csvEsc('Período: ' + di.split('-').reverse().join('/') + ' até ' + df.split('-').reverse().join('/'), SEP));
    linhas.push(_csvEsc('Gerado em: ' + hoje.toLocaleString('pt-BR'), SEP));
    linhas.push(_csvEsc('Total de atendimentos: ' + dados.length, SEP));
    var totGeral = 0; var totQty = 0;
    for (var i = 0; i < dados.length; i++) {
      totGeral += dados[i].total || 0;
      for (var j = 0; j < dados[i].items.length; j++) totQty += dados[i].items[j].qty || 0;
    }
    linhas.push(_csvEsc('Faturamento total: R$ ' + fmtMoney(totGeral), SEP));
    linhas.push(_csvEsc('Total de itens vendidos: ' + totQty, SEP));
    linhas.push(''); // linha em branco

    if (incItens) {
      // SEÇÃO 1: DETALHAMENTO ITEM POR ITEM
      linhas.push(_csvEsc('=== DETALHAMENTO POR ITEM ===', SEP));
      var cab = [
        'Data','Dia da Semana','Hora','Atendimento #','Item #','Serviço','Quantidade',
        'Valor Unitário (R$)','Total do Item (R$)','Total do Atendimento (R$)',
        'Qtd Itens no Atendimento','Doc ID Firebase'
      ];
      linhas.push(cab.map(function(c){return _csvEsc(c, SEP);}).join(SEP));
      var diasSemana = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
      for (var i = 0; i < dados.length; i++) {
        var a = dados[i];
        var dataObj = a.data ? new Date(a.data + 'T00:00:00') : new Date();
        var diaSem = diasSemana[dataObj.getDay()];
        var dataPt = a.data ? a.data.split('-').reverse().join('/') : '';
        var qtdItens = a.items.length;
        for (var j = 0; j < a.items.length; j++) {
          var it = a.items[j];
          var unit = it.qty > 0 ? it.tot / it.qty : it.tot;
          var row = [
            dataPt, diaSem, a.hora || a.time || '',
            a.id || '', (j + 1), it.name, fmtNum(it.qty),
            fmtMoney(unit), fmtMoney(it.tot), fmtMoney(a.total),
            fmtNum(qtdItens), a._docId || ''
          ];
          linhas.push(row.map(function(c){return _csvEsc(c, SEP);}).join(SEP));
        }
      }
      linhas.push('');
    }

    // SEÇÃO 2: RESUMO POR ATENDIMENTO
    linhas.push(_csvEsc('=== RESUMO POR ATENDIMENTO ===', SEP));
    var cabAt = ['Data','Hora','Atendimento #','Qtd Serviços Diferentes','Qtd Total de Itens','Total (R$)','Serviços','Doc ID Firebase'];
    linhas.push(cabAt.map(function(c){return _csvEsc(c, SEP);}).join(SEP));
    for (var i = 0; i < dados.length; i++) {
      var a = dados[i];
      var totItens = 0; var srvList = [];
      for (var j = 0; j < a.items.length; j++) {
        totItens += a.items[j].qty || 0;
        srvList.push((a.items[j].qty > 1 ? a.items[j].qty + 'x ' : '') + a.items[j].name);
      }
      var dataPt = a.data ? a.data.split('-').reverse().join('/') : '';
      var row = [dataPt, a.hora || a.time || '', a.id || '', a.items.length, totItens, fmtMoney(a.total), srvList.join(' | '), a._docId || ''];
      linhas.push(row.map(function(c){return _csvEsc(c, SEP);}).join(SEP));
    }
    linhas.push('');

    if (incResumo) {
      // SEÇÃO 3: RESUMO POR DIA
      linhas.push(_csvEsc('=== RESUMO POR DIA ===', SEP));
      var cabDia = ['Data','Dia da Semana','Atendimentos','Itens Vendidos','Faturamento (R$)','Ticket Médio (R$)'];
      linhas.push(cabDia.map(function(c){return _csvEsc(c, SEP);}).join(SEP));
      var porDia = {};
      for (var i = 0; i < dados.length; i++) {
        var d = dados[i].data || '----';
        if (!porDia[d]) porDia[d] = { n: 0, itens: 0, total: 0 };
        porDia[d].n++;
        porDia[d].total += dados[i].total || 0;
        for (var j = 0; j < dados[i].items.length; j++) porDia[d].itens += dados[i].items[j].qty || 0;
      }
      var diasOrd = Object.keys(porDia).sort();
      var diasSem = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
      for (var k = 0; k < diasOrd.length; k++) {
        var dt = diasOrd[k];
        var info = porDia[dt];
        var dataObj = new Date(dt + 'T00:00:00');
        var dataPt = dt.split('-').reverse().join('/');
        var ticket = info.n > 0 ? info.total / info.n : 0;
        var row = [dataPt, diasSem[dataObj.getDay()], info.n, info.itens, fmtMoney(info.total), fmtMoney(ticket)];
        linhas.push(row.map(function(c){return _csvEsc(c, SEP);}).join(SEP));
      }
      linhas.push('');

      // SEÇÃO 4: RANKING DE SERVIÇOS
      linhas.push(_csvEsc('=== RANKING DE SERVIÇOS ===', SEP));
      var cabSrv = ['Posição','Serviço','Qtd Vendida','Faturamento (R$)','% do Faturamento','Preço Médio (R$)'];
      linhas.push(cabSrv.map(function(c){return _csvEsc(c, SEP);}).join(SEP));
      var porSrv = {};
      for (var i = 0; i < dados.length; i++) {
        for (var j = 0; j < dados[i].items.length; j++) {
          var it = dados[i].items[j];
          if (!porSrv[it.name]) porSrv[it.name] = { qty: 0, total: 0 };
          porSrv[it.name].qty += it.qty || 0;
          porSrv[it.name].total += it.tot || 0;
        }
      }
      var srvArr = [];
      for (var nm in porSrv) srvArr.push({ name: nm, qty: porSrv[nm].qty, total: porSrv[nm].total });
      srvArr.sort(function(a,b){ return b.total - a.total; });
      for (var i = 0; i < srvArr.length; i++) {
        var s = srvArr[i];
        var pct = totGeral > 0 ? (s.total / totGeral * 100) : 0;
        var precoMed = s.qty > 0 ? s.total / s.qty : 0;
        var row = [(i+1), s.name, fmtNum(s.qty), fmtMoney(s.total), fmtMoney(pct) + '%', fmtMoney(precoMed)];
        linhas.push(row.map(function(c){return _csvEsc(c, SEP);}).join(SEP));
      }
      linhas.push('');
      linhas.push(_csvEsc('TOTAIS GERAIS', SEP) + SEP + _csvEsc(dados.length + ' atendimentos', SEP) + SEP + _csvEsc(totQty + ' itens', SEP) + SEP + _csvEsc(fmtMoney(totGeral), SEP));
    }

    // Monta o CSV final com BOM UTF-8 para Excel abrir acentos corretamente
    var csv = '\uFEFF' + linhas.join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var ahref = document.createElement('a');
    ahref.href = url;
    var nomeArq = 'pdvdemo-atendimentos_' + di + '_a_' + df + '.csv';
    ahref.download = nomeArq;
    document.body.appendChild(ahref);
    ahref.click();
    document.body.removeChild(ahref);
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);

    status.style.background = '#e9f3df'; status.style.color = '#437a22';
    status.textContent = '✓ Planilha baixada: ' + nomeArq + ' (' + linhas.length + ' linhas, ' + dados.length + ' atendimentos)';
    btn.disabled = false; btn.textContent = '⬇ Baixar Planilha';
  } catch (e) {
    console.error('Erro export CSV:', e);
    status.style.background = '#fee2e2'; status.style.color = '#a12c7b';
    status.textContent = 'Erro: ' + (e.message || e);
    btn.disabled = false; btn.textContent = '⬇ Baixar Planilha';
  }
}

//  RELATÓRIO PDF

function gerarRelatorio() {
  if (_atendimentos.length === 0) { alert('Nenhum atendimento finalizado hoje!'); return; }
  var totalDia = 0;
  for (var i = 0; i < _atendimentos.length; i++) totalDia += _atendimentos[i].total;

  var linhas = '';
  for (var i = 0; i < _atendimentos.length; i++) {
    var h = _atendimentos[i];
    var itens = '';
    for (var j = 0; j < h.items.length; j++) {
      var it = h.items[j];
      itens += '<tr><td style="padding:4px 8px">' + it.name + '</td><td style="padding:4px 8px;text-align:center">' + it.qty + '</td><td style="padding:4px 8px;text-align:right">R$ ' + it.tot.toFixed(2).replace('.',',') + '</td></tr>';
    }
    linhas += '<div style="margin-bottom:20px;border:1px solid #ddd;border-radius:8px;overflow:hidden">' +
      '<div style="background:#f5f5f5;padding:8px 12px;display:flex;justify-content:space-between;font-weight:700;font-size:13px">' +
        '<span>Atendimento #' + h.id + '</span><span>' + h.time + '</span>' +
      '</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:12px">' +
        '<thead><tr style="background:#fafafa"><th style="padding:4px 8px;text-align:left;font-weight:600;color:#666">Serviço</th><th style="padding:4px 8px;font-weight:600;color:#666">Qtd</th><th style="padding:4px 8px;font-weight:600;color:#666;text-align:right">Valor</th></tr></thead>' +
        '<tbody>' + itens + '</tbody>' +
        '<tfoot><tr style="border-top:2px solid #ddd"><td colspan="2" style="padding:6px 8px;font-weight:700;font-size:13px">Total</td><td style="padding:6px 8px;text-align:right;font-weight:800;color:#2a7a2a;font-size:14px">R$ ' + h.total.toFixed(2).replace('.',',') + '</td></tr></tfoot>' +
      '</table></div>';
  }

  var hoje = new Date();
  var dataStr = hoje.toLocaleDateString('pt-BR', {weekday:'long', year:'numeric', month:'long', day:'numeric'});

  var win = window.open('', '_blank');
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório do Dia</title>' +
    '<style>body{font-family:Arial,sans-serif;padding:30px;color:#222;max-width:700px;margin:0 auto}' +
    'h1{font-size:20px;margin-bottom:4px}p{color:#666;font-size:13px;margin-bottom:24px}' +
    '.resumo{background:#f0f7f0;border:1px solid #b2d8b2;border-radius:8px;padding:16px 20px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center}' +
    '.resumo-val{font-size:28px;font-weight:800;color:#2a7a2a}' +
    '.resumo-info{font-size:12px;color:#555}' +
    '@media print{button{display:none}}' +
    '</style></head><body>' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">' +
      '<div><h1>Relatório do Dia</h1><p>' + dataStr + '</p></div>' +
      '<button onclick="window.print()" style="padding:8px 18px;background:#2a7a2a;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:700">🖨 Imprimir</button>' +
    '</div>' +
    '<div class="resumo">' +
      '<div><div class="resumo-info">Total do dia</div><div class="resumo-val">R$ ' + totalDia.toFixed(2).replace('.',',') + '</div></div>' +
      '<div style="text-align:right"><div class="resumo-info">Atendimentos</div><div style="font-size:22px;font-weight:800;color:#444">' + _atendimentos.length + '</div></div>' +
    '</div>' +
    linhas +
    '</body></html>');
  win.document.close();
}

//  GRÁFICO DE SERVIÇOS

function abrirGrafico() {
  if (_atendimentos.length === 0) { alert('Nenhum atendimento finalizado ainda!'); return; }

  // Contar serviços
  var contagem = {};
  for (var i = 0; i < _atendimentos.length; i++) {
    for (var j = 0; j < _atendimentos[i].items.length; j++) {
      var it = _atendimentos[i].items[j];
      contagem[it.name] = (contagem[it.name] || 0) + it.qty;
    }
  }
  var entries = [];
  for (var k in contagem) entries.push({name: k, qty: contagem[k]});
  entries.sort(function(a,b){ return b.qty - a.qty; });
  var top = entries.slice(0, 10);
  var maxQty = top[0] ? top[0].qty : 1;

  var bars = '';
  var colors = ['#4f98a3','#6daa45','#a78bdc','#e08c3a','#e05a5a','#3a9be0','#e0c93a','#3ae0b5','#e03ab5','#7a7a7a'];
  for (var i = 0; i < top.length; i++) {
    var pct = Math.round((top[i].qty / maxQty) * 100);
    bars += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">' +
      '<div style="width:130px;font-size:11px;color:#555;text-align:right;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="' + top[i].name + '">' + top[i].name + '</div>' +
      '<div style="flex:1;background:#f0f0f0;border-radius:4px;height:22px;overflow:hidden">' +
        '<div style="width:' + pct + '%;background:' + colors[i % colors.length] + ';height:100%;border-radius:4px;display:flex;align-items:center;padding-left:8px;transition:width .4s">' +
          '<span style="font-size:11px;font-weight:700;color:#fff">' + top[i].qty + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  var win2 = window.open('', '_blank');
  var hoje2 = new Date();
  var dataStr2 = hoje2.toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit', year:'numeric'});
  win2.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Serviços mais vendidos</title>' +
    '<style>body{font-family:Arial,sans-serif;padding:30px;color:#222;max-width:650px;margin:0 auto}h1{font-size:18px}p{color:#666;font-size:13px;margin-bottom:28px}@media print{button{display:none}}</style>' +
    '</head><body>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
      '<h1>Serviços mais vendidos</h1>' +
      '<button onclick="window.print()" style="padding:7px 16px;background:#5a3e8a;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:700">🖨 Imprimir</button>' +
    '</div>' +
    '<p>' + dataStr2 + ' — Top ' + top.length + ' serviços do dia</p>' +
    bars +
    '</body></html>');
  win2.document.close();
}

//  NOTINHA DO CLIENTE

var LOGO_B64 = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%2301696F'/%3E%3Ctext x='50' y='62' font-size='42' font-family='Arial,sans-serif' font-weight='bold' fill='%23fff' text-anchor='middle'%3EPD%3C/text%3E%3C/svg%3E";

function gerarNotinha(idx) {
  var h = _atendimentos[idx];
  if (!h) return;

  var hoje = new Date();
  var dataStr = hoje.toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit', year:'numeric'});

  var nomeCliente = prompt('Nome do cliente (opcional — pressione OK para pular):', '');
  if (nomeCliente === null) return; // cancelou

  // Mapa de preço cheio por serviço (faixa 1)
  var FULL_PRICE = {
    'Impressão PB Frente Apostila': 2.50,
    'Impressão PB Frente e Verso': 3.50,
    'Impressão Colorida Frente Apostila': 3.00,
    'Impressão Colorida Frente e Verso': 4.00,
    'Xerox / Cópia': 0.50
  };

  var linhas = '';
  for (var i = 0; i < h.items.length; i++) {
    var it = h.items[i];
    var unitPrice = it.qty > 0 ? it.tot / it.qty : 0;
    var fullPrice = FULL_PRICE[it.name] || null;
    var hasDiscount = fullPrice && it.qty > 1 && unitPrice < fullPrice - 0.001;
    var discountPct = hasDiscount ? Math.round((1 - unitPrice / fullPrice) * 100) : 0;

    if (hasDiscount) {
      linhas += '<tr>' +
        '<td colspan="2" style="padding:6px 6px 2px;font-size:12px;font-weight:600">' +
          (it.qty > 1 ? it.qty + 'x ' : '') + it.name +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td style="padding:1px 6px 2px;font-size:11px;color:#888">' +
          '<span style="text-decoration:line-through">R$ ' + fullPrice.toFixed(2).replace('.',',') + '/un</span>' +
          ' → <span style="color:#1a7a3a;font-weight:700">R$ ' + unitPrice.toFixed(2).replace('.',',') + '/un</span>' +
          ' <span style="background:#d4f5e2;color:#1a7a3a;border-radius:4px;padding:1px 5px;font-size:10px;font-weight:800">🏷️ -' + discountPct + '%</span>' +
        '</td>' +
        '<td style="padding:1px 6px 2px;font-size:12px;font-weight:700;text-align:right;color:#1a7a3a;border-bottom:1px solid #eee;vertical-align:bottom">R$ ' + it.tot.toFixed(2).replace('.',',') + '</td>' +
      '</tr>';
    } else {
      linhas += '<tr>' +
        '<td style="padding:5px 6px;font-size:12px;border-bottom:1px solid #eee">' + (it.qty > 1 ? it.qty + 'x ' : '') + it.name + '</td>' +
        '<td style="padding:5px 6px;font-size:12px;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">R$ ' + it.tot.toFixed(2).replace('.',',') + '</td>' +
      '</tr>';
    }
  }

  // Calcular economia total
  var totalSemDesc = 0;
  for (var i = 0; i < h.items.length; i++) {
    var it = h.items[i];
    var fp = FULL_PRICE[it.name] || null;
    var up = it.qty > 0 ? it.tot / it.qty : 0;
    if (fp && it.qty > 1 && up < fp - 0.001) totalSemDesc += fp * it.qty;
    else totalSemDesc += it.tot;
  }
  var economia = totalSemDesc - h.total;

  var win = window.open('', '_blank', 'width=420,height=650,scrollbars=yes');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Comprovante</title>
  <style>
    * { margin:0;padding:0;box-sizing:border-box }
    body { font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f4;padding:0 }
    .cupom { width:320px;margin:20px auto;padding:20px 16px;outline:1.5px solid #000;border-radius:0;position:relative }
    .logo-wrap { text-align:center;margin-bottom:8px }
    .logo-wrap img { width:90px;height:90px;object-fit:contain;border-radius:50% }
    .nome-loja { text-align:center;font-size:15px;font-weight:800;color:#1a3a8f;letter-spacing:.5px;margin-bottom:2px }
    .subtitulo { text-align:center;font-size:10px;color:#888;margin-bottom:12px }
    .divider { border:none;border-top:1px dashed #ccc;margin:10px 0 }
    .info-row { display:flex;justify-content:space-between;font-size:11px;color:#555;margin-bottom:3px }
    table { width:100%;border-collapse:collapse;margin:8px 0 }
    .total-row td { padding:8px 6px;font-size:14px;font-weight:800;border-top:2px solid #222 }
    .rodape { text-align:center;font-size:10px;color:#aaa;margin-top:14px;line-height:1.6 }
    @media print {
      button { display:none }
      body { background:#fff !important; padding:0; margin:0 }
      .cupom { outline:1.5px solid #000 !important; margin:10px auto !important; -webkit-print-color-adjust:exact; print-color-adjust:exact }
    }
  </style>
  </head><body>
  <div class="cupom">
    <div style="position:absolute;top:-10px;right:10px;background:#fff;padding:0 4px;font-size:13px;color:#aaa" title="Recorte aqui">✂</div>
    <div class="logo-wrap"><img src="${LOGO_B64}" alt="Logo"></div>
    <div class="nome-loja">PDV DEMO</div>
    <div class="subtitulo" style="color:#333;font-weight:600">Lan House · Papelaria · Eletrônicos</div>
    <hr class="divider">
    <div class="info-row"><span>Atendimento #${h.id}</span><span>${dataStr} ${h.time}</span></div>
    ${nomeCliente ? '<div class="info-row"><span>Cliente:</span><span style="font-weight:600">' + nomeCliente + '</span></div>' : ''}
    <hr class="divider">
    <table>
      <tbody>${linhas}</tbody>
      <tfoot>
        ${economia > 0.005 ? `<tr><td style="padding:4px 6px;font-size:11px;color:#1a7a3a">🏷️ Você economizou</td><td style="text-align:right;font-size:11px;color:#1a7a3a;font-weight:700;padding:4px 6px">- R$ ${economia.toFixed(2).replace('.',',')}</td></tr>` : ''}
        <tr class="total-row">
          <td>TOTAL</td>
          <td style="text-align:right">R$ ${h.total.toFixed(2).replace('.',',')}</td>
        </tr>
      </tfoot>
    </table>
    <hr class="divider">
    <div class="rodape">
      <strong style="font-size:11px;color:#444;display:block;margin-bottom:4px">PDV Demo</strong>
      <span>Rua Exemplo, 100 — Centro, Cidade/UF</span><br>
      <span>CNPJ: 00.000.000/0001-00</span><br><br>
      <span><svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366" style="vertical-align:middle;margin-right:3px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.833L.057 23.077a.75.75 0 0 0 .92.92l5.244-1.453A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.725 9.725 0 0 1-4.964-1.355l-.356-.211-3.114.863.863-3.114-.211-.356A9.725 9.725 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>(00) 0 0000-0000 &nbsp;|&nbsp; 📷 @pdvdemo</span><br><br>
      <span style="font-size:10px;color:#bbb">Seg–Sex: 08h às 18h &nbsp;|&nbsp; Sáb: 08h às 12h</span><br><br>
      <span style="font-size:11px;color:#555">Obrigado pela preferência! 😊</span>
    </div>
  </div>
  <div style="text-align:center;padding:12px">
    <button onclick="window.print()" style="padding:8px 20px;background:#1a3a8f;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:700">🖨 Imprimir Notinha</button>
  </div>
  </body></html>`);
  win.document.close();
}

